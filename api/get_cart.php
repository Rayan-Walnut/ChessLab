<?php
// get_cart.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'api.php'; // Fichier avec la connexion $conn

// Vérifier l'authentification de l'utilisateur
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = str_replace('Bearer ', '', $auth_header);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié"]);
    exit;
}

// Pour les tests, utiliser un ID fixe
$user_id = 1; // Remplacer par l'extraction réelle de l'ID depuis le token

// Récupérer le panier avec les détails du forfait
$sql = "SELECT c.id, c.quantity, c.subscription_id, s.name, s.description, s.price, s.features
        FROM cart_items c
        JOIN subscriptions s ON c.subscription_id = s.id
        WHERE c.user_id = '$user_id'
        ORDER BY c.created_at DESC";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $items = array();
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Panier récupéré avec succès",
        "items" => $items
    ]);
} else {
    echo json_encode([
        "success" => true,
        "message" => "Le panier est vide",
        "items" => []
    ]);
}

$conn->close();
?>