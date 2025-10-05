<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gérer les requêtes OPTIONS (pré-vol CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

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
    $tokenUserId = $decoded->user_id;
    
    // Récupérer les données envoyées en POST
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['IdUtilisateur']) || $data['IdUtilisateur'] != $tokenUserId) {
        echo json_encode(["success" => false, "message" => "Vous n'êtes pas autorisé à modifier ce profil."]);
        exit();
    }
    
    // Préparer les données à mettre à jour
    $userId = $conn->real_escape_string($data['IdUtilisateur']);
    $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : null;
    
    // Vérifier si l'email existe déjà pour un autre utilisateur
    if ($email) {
        $checkEmail = "SELECT IdUtilisateur FROM utilisateur WHERE email = ? AND IdUtilisateur != ?";
        $stmt = $conn->prepare($checkEmail);
        $stmt->bind_param("si", $email, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé par un autre compte."]);
            exit();
        }
    }
    
    // Construire la requête SQL dynamiquement (uniquement pour l'email puisque c'est le seul champ disponible)
    $updateFields = [];
    $types = "";
    $params = [];
    
    if ($email) {
        $updateFields[] = "email = ?";
        $types .= "s";
        $params[] = $email;
    }
    
    if (empty($updateFields)) {
        echo json_encode(["success" => false, "message" => "Aucune donnée à mettre à jour."]);
        exit();
    }
    
    // Ajouter l'ID utilisateur aux paramètres
    $types .= "i";
    $params[] = $userId;
    
    $sql = "UPDATE utilisateur SET " . implode(", ", $updateFields) . " WHERE IdUtilisateur = ?";
    
    $stmt = $conn->prepare($sql);
    
    // Liaison dynamique des paramètres
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Profil mis à jour avec succès."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la mise à jour : " . $stmt->error
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur d'authentification : " . $e->getMessage()
    ]);
}

$conn->close();