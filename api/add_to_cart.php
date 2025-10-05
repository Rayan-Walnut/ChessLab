<?php
// add_to_cart.php
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
$logFile = 'add_to_cart_log.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Démarrage de la requête\n", FILE_APPEND);
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

// Vérifier les données du panier
if (!isset($data['subscription_id']) || !is_numeric($data['subscription_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de forfait invalide"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: ID de forfait invalide\n", FILE_APPEND);
    exit;
}

$subscription_id = $conn->real_escape_string($data['subscription_id']);
$quantity = isset($data['quantity']) && is_numeric($data['quantity']) ? $conn->real_escape_string($data['quantity']) : 1;

// Vérifier si le forfait existe
$check_sub_query = "SELECT id, price FROM subscriptions WHERE id = '$subscription_id'";
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête vérification forfait: " . $check_sub_query . "\n", FILE_APPEND);

$check_sub = $conn->query($check_sub_query);
if (!$check_sub) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur de base de données: " . $conn->error]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur de base de données: " . $conn->error . "\n", FILE_APPEND);
    exit;
}

if ($check_sub->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Forfait introuvable"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: Forfait introuvable\n", FILE_APPEND);
    exit;
}

// Récupérer le prix du forfait
$sub_data = $check_sub->fetch_assoc();
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Données du forfait: " . print_r($sub_data, true) . "\n", FILE_APPEND);

// Vérifier si l'utilisateur existe
$check_user_query = "SELECT IdUtilisateur FROM utilisateur WHERE IdUtilisateur = '$user_id'";
$user_result = $conn->query($check_user_query);
if (!$user_result || $user_result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Utilisateur introuvable"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: Utilisateur avec ID $user_id introuvable\n", FILE_APPEND);
    exit;
}

// Vérifier si la table cart_items existe
$check_table_query = "SHOW TABLES LIKE 'cart_items'";
$result_table = $conn->query($check_table_query);
if ($result_table->num_rows === 0) {
    // La table n'existe pas, créons-la
    $create_table_query = "CREATE TABLE `cart_items` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `subscription_id` int NOT NULL,
        `quantity` int NOT NULL DEFAULT 1,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `user_id` (`user_id`),
        KEY `subscription_id` (`subscription_id`),
        CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`IdUtilisateur`),
        CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;";
    
    if (!$conn->query($create_table_query)) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur lors de la création de la table: " . $conn->error]);
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur de création de table: " . $conn->error . "\n", FILE_APPEND);
        exit;
    }
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Table cart_items créée avec succès\n", FILE_APPEND);
}

try {
    // Vérifier si l'élément existe déjà dans le panier
    $check_query = "SELECT id, quantity FROM cart_items WHERE user_id = '$user_id' AND subscription_id = '$subscription_id'";
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête vérification panier: " . $check_query . "\n", FILE_APPEND);
    
    $result = $conn->query($check_query);
    if (!$result) {
        throw new Exception("Erreur lors de la vérification du panier: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        // Mettre à jour la quantité
        $row = $result->fetch_assoc();
        $new_quantity = $row['quantity'] + $quantity;
        $update_query = "UPDATE cart_items SET quantity = '$new_quantity' WHERE id = '{$row['id']}'";
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête mise à jour: " . $update_query . "\n", FILE_APPEND);
        
        if ($conn->query($update_query)) {
            echo json_encode([
                "success" => true,
                "message" => "Quantité mise à jour dans le panier",
                "quantity" => $new_quantity
            ]);
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Succès: Quantité mise à jour\n", FILE_APPEND);
        } else {
            throw new Exception("Erreur lors de la mise à jour: " . $conn->error);
        }
    } else {
        // Ajouter un nouvel élément
        $insert_query = "INSERT INTO cart_items (user_id, subscription_id, quantity) VALUES ('$user_id', '$subscription_id', '$quantity')";
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête insertion: " . $insert_query . "\n", FILE_APPEND);
        
        if ($conn->query($insert_query)) {
            echo json_encode([
                "success" => true,
                "message" => "Forfait ajouté au panier",
                "cart_item_id" => $conn->insert_id
            ]);
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Succès: Élément ajouté au panier\n", FILE_APPEND);
        } else {
            throw new Exception("Erreur lors de l'ajout: " . $conn->error);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Exception: " . $e->getMessage() . "\n", FILE_APPEND);
}

$conn->close();
?>