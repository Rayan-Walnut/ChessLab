<?php
// get_cart_items.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'api.php'; // Fichier avec la connexion $conn
require_once '../vendor/autoload.php'; // Pour JWT

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

// Charger les variables d'environnement
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Récupération des variables d'environnement
$secretKey = $_ENV['SECRET_KEY'];

// Log pour le débogage
$logFile = 'cart_log.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Démarrage de la requête get_cart_items\n", FILE_APPEND);

// Récupérer le token d'authentification
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = str_replace('Bearer ', '', $auth_header);

file_put_contents($logFile, date('Y-m-d H:i:s') . " - Token: " . $token . "\n", FILE_APPEND);

// Vérifier si le token est présent
if (empty($token)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: Non authentifié\n", FILE_APPEND);
    exit;
}

// Décoder le token JWT pour extraire l'ID utilisateur
try {
    // Décodage du JWT
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    
    // Extraire l'ID utilisateur du token
    $user_id = $decoded->user_id;
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Token décodé avec succès, user_id: " . $user_id . "\n", FILE_APPEND);
} catch (Exception $e) {
    // En cas d'erreur de décodage, enregistrer l'erreur
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur de décodage du token: " . $e->getMessage() . "\n", FILE_APPEND);
    
    // En mode débogage, tentative de décodage manuel pour vérifier la structure
    $token_parts = explode('.', $token);
    if (count($token_parts) >= 2) {
        $payload = base64_decode(strtr($token_parts[1], '-_', '+/'));
        $payload_data = json_decode($payload, true);
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Tentative de décodage manuel: " . print_r($payload_data, true) . "\n", FILE_APPEND);
        
        // Utiliser l'ID utilisateur du décodage manuel si disponible
        if (isset($payload_data['user_id'])) {
            $user_id = $payload_data['user_id'];
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - ID utilisateur extrait manuellement: " . $user_id . "\n", FILE_APPEND);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Token invalide: ID utilisateur manquant"]);
            exit;
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Token invalide: format incorrect"]);
        exit;
    }
}

file_put_contents($logFile, date('Y-m-d H:i:s') . " - ID utilisateur utilisé: " . $user_id . "\n", FILE_APPEND);

// Vérifier si la table cart_items existe
$check_table_query = "SHOW TABLES LIKE 'cart_items'";
$result_table = $conn->query($check_table_query);
if ($result_table->num_rows === 0) {
    // La table n'existe pas encore
    echo json_encode([
        "success" => true,
        "message" => "Votre panier est vide",
        "cart_items" => [],
        "total" => 0,
        "item_count" => 0
    ]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Table cart_items n'existe pas encore\n", FILE_APPEND);
    exit;
}

// Récupérer les éléments du panier avec les détails des forfaits
$sql = "SELECT ci.id, ci.subscription_id, ci.quantity, ci.created_at,
               s.name, s.description, s.features, s.price
        FROM cart_items ci
        JOIN subscriptions s ON ci.subscription_id = s.id
        WHERE ci.user_id = '$user_id'";

file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête SQL: " . $sql . "\n", FILE_APPEND);

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur de base de données: " . $conn->error
    ]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: " . $conn->error . "\n", FILE_APPEND);
    exit;
}

$cart_items = array();
$total = 0;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $item_total = $row['price'] * $row['quantity'];
        $row['item_total'] = $item_total;
        $total += $item_total;
        $cart_items[] = $row;
    }
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Nombre d'articles trouvés: " . count($cart_items) . "\n", FILE_APPEND);
    
    echo json_encode([
        "success" => true,
        "message" => "Articles du panier récupérés avec succès",
        "cart_items" => $cart_items,
        "total" => $total,
        "item_count" => count($cart_items)
    ]);
} else {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Aucun article trouvé dans le panier\n", FILE_APPEND);
    
    echo json_encode([
        "success" => true,
        "message" => "Votre panier est vide",
        "cart_items" => [],
        "total" => 0,
        "item_count" => 0
    ]);
}

$conn->close();
?>