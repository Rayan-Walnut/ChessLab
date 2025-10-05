<?php
// checkout.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'api.php'; // Fichier avec la connexion $conn

// Vérifier l'authentification
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = str_replace('Bearer ', '', $auth_header);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié"]);
    exit;
}

// Pour les tests, utiliser un ID fixe
$user_id = 1; // Remplacer par l'extraction réelle depuis le token

// Récupérer les données
$data = json_decode(file_get_contents("php://input"), true);
$payment_method = isset($data['payment_method']) ? $conn->real_escape_string($data['payment_method']) : 'card';

// Vérifier si le panier contient des éléments
$cart_query = "SELECT c.id, c.subscription_id, c.quantity, s.price, s.name, s.duration_days
               FROM cart_items c
               JOIN subscriptions s ON c.subscription_id = s.id
               WHERE c.user_id = '$user_id'";
$result = $conn->query($cart_query);

if ($result->num_rows === 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Le panier est vide"]);
    exit;
}

// Calculer le montant total
$total_amount = 0;
$cart_items = array();

while ($row = $result->fetch_assoc()) {
    $item_total = $row['price'] * $row['quantity'];
    $total_amount += $item_total;
    $cart_items[] = $row;
}

// Démarrer la transaction
$conn->begin_transaction();

try {
    // Créer la commande
    $insert_order = "INSERT INTO orders (user_id, total_amount, status, payment_method) 
                    VALUES ('$user_id', '$total_amount', 'pending', '$payment_method')";
    
    if (!$conn->query($insert_order)) {
        throw new Exception("Erreur lors de la création de la commande");
    }
    
    $order_id = $conn->insert_id;
    
    // Ajouter les éléments de la commande
    foreach ($cart_items as $item) {
        $subscription_id = $item['subscription_id'];
        $quantity = $item['quantity'];
        $price = $item['price'];
        
        $insert_item = "INSERT INTO order_items (order_id, subscription_id, quantity, price)
                        VALUES ('$order_id', '$subscription_id', '$quantity', '$price')";
        
        if (!$conn->query($insert_item)) {
            throw new Exception("Erreur lors de l'ajout d'un élément à la commande");
        }
        
        // Créer les abonnements de l'utilisateur
        $start_date = date('Y-m-d');
        $end_date = date('Y-m-d', strtotime("+{$item['duration_days']} days"));
        
        $insert_subscription = "INSERT INTO user_subscriptions 
                               (user_id, subscription_id, start_date, end_date, status, order_id)
                               VALUES ('$user_id', '$subscription_id', '$start_date', '$end_date', 'active', '$order_id')";
        
        if (!$conn->query($insert_subscription)) {
            throw new Exception("Erreur lors de la création de l'abonnement");
        }
    }
    
    // Vider le panier
    $clear_cart = "DELETE FROM cart_items WHERE user_id = '$user_id'";
    if (!$conn->query($clear_cart)) {
        throw new Exception("Erreur lors de la suppression du panier");
    }
    
    // Valider la transaction
    $conn->commit();
    
    // Pour les besoins de cet exemple, nous simulons un succès immédiat
    // Dans un système réel, vous devriez intégrer un système de paiement
    // comme Stripe, PayPal, etc.
    
    // Mettre à jour le statut de la commande
    $update_status = "UPDATE orders SET status = 'completed' WHERE id = '$order_id'";
    $conn->query($update_status);
    
    echo json_encode([
        "success" => true,
        "message" => "Commande complétée avec succès",
        "order_id" => $order_id,
        "total_amount" => $total_amount,
        // Si vous intégrez Stripe, vous pourriez inclure par exemple :
        // "stripe_session_id" => $stripe_session->id
    ]);
    
} catch (Exception $e) {
    // Annuler la transaction en cas d'erreur
    $conn->rollback();
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors du traitement de la commande: " . $e->getMessage()
    ]);
}

$conn->close();
?>