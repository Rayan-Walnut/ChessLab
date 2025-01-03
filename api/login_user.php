<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
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
$issuer = $_ENV['ISSUER'];
$audience = $_ENV['AUDIENCE'];

// Vérifier si la connexion à la base est établie
if (!$conn) {
    echo json_encode(["message" => "Erreur de connexion à la base de données."]);
    exit();
}

// Récupérer les données envoyées en POST
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email']) && !empty($data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    // Vérification de l'utilisateur dans la base de données
    $sql = "SELECT * FROM utilisateur WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Vérifier si le mot de passe est correct
        if (password_verify($password, $user['password'])) {
            // Générer le payload pour le token JWT
            $payload = [
                "iss" => $issuer,
                "aud" => $audience,
                "iat" => time(),
                "exp" => time() + 3600,
                "user_id" => $user['IdUtilisateur'],
                "email" => $user['email']
            ];

            // Générer le token
            $jwt = JWT::encode($payload, $secretKey, 'HS256');

            // Réponse avec le token
            echo json_encode([
                "message" => "Connexion réussie.",
                "token" => $jwt,
            ]);
        } else {
            echo json_encode(["message" => "Mot de passe incorrect."]);
        }
    } else {
        echo json_encode(["message" => "Utilisateur non trouvé."]);
    }
} else {
    echo json_encode(["message" => "Les données sont incomplètes."]);
}

$conn->close();