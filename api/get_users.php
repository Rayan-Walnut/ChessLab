<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Connexion à la base de données
require_once '../vendor/autoload.php'; // Inclure Dotenv et JWT

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

// Charger les variables d'environnement
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Récupération des variables d'environnement
$secretKey = $_ENV['SECRET_KEY'];

// Fonction pour obtenir le token d'autorisation
function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

// Vérifier si la connexion à la base est établie
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);
    exit();
}

// Récupérer le token
$token = getBearerToken();

if (!$token) {
    echo json_encode(["success" => false, "message" => "Token d'authentification manquant."]);
    exit();
}

try {
    // Décoder le token
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    
    // Récupérer l'ID utilisateur depuis le token
    $userId = $decoded->user_id;
    
    // Récupérer les informations de l'utilisateur
    // On récupère uniquement les colonnes qui existent dans votre table
    $sql = "SELECT IdUtilisateur, email, created_at FROM utilisateur WHERE IdUtilisateur = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Utilisateur non trouvé."
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur d'authentification : " . $e->getMessage()
    ]);
}

$conn->close();