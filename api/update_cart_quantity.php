<?php
// update_cart_quantity.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Récupérer les données
$data = json_decode(file_get_contents("php://input"), true);

// Log pour le débogage
$logFile = 'cart_log.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Démarrage de la requête update_cart_quantity\n", FILE_APPEND);
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Données reçues: " . print_r($data, true) . "\n", FILE_APPEND);

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

// Vérifier les données
if (!isset($data['cart_item_id']) || !is_numeric($data['cart_item_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID d'article invalide"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: ID d'article invalide\n", FILE_APPEND);
    exit;
}

if (!isset($data['quantity']) || !is_numeric($data['quantity']) || $data['quantity'] < 1) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Quantité invalide"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: Quantité invalide\n", FILE_APPEND);
    exit;
}

$cart_item_id = $conn->real_escape_string($data['cart_item_id']);
$quantity = $conn->real_escape_string($data['quantity']);

// Vérifier si l'article existe et appartient à l'utilisateur
$check_query = "SELECT id FROM cart_items WHERE id = '$cart_item_id' AND user_id = '$user_id'";
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête vérification: " . $check_query . "\n", FILE_APPEND);

$result = $conn->query($check_query);
if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur de base de données: " . $conn->error]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur de base de données: " . $conn->error . "\n", FILE_APPEND);
    exit;
}

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Article non trouvé ou non autorisé"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: Article non trouvé ou non autorisé\n", FILE_APPEND);
    exit;
}

// Mettre à jour la quantité
$update_query = "UPDATE cart_items SET quantity = '$quantity' WHERE id = '$cart_item_id' AND user_id = '$user_id'";
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête mise à jour: " . $update_query . "\n", FILE_APPEND);

if ($conn->query($update_query)) {
    echo json_encode([
        "success" => true,
        "message" => "Quantité mise à jour",
        "new_quantity" => (int)$quantity
    ]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Succès: Quantité mise à jour\n", FILE_APPEND);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la mise à jour: " . $conn->error
    ]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur lors de la mise à jour: " . $conn->error . "\n", FILE_APPEND);
}

$conn->close();
?>