<?php
// update_cart_item.php
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

if (!isset($data['cart_item_id']) || !isset($data['quantity']) || !is_numeric($data['quantity'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données invalides"]);
    exit;
}

$cart_item_id = $conn->real_escape_string($data['cart_item_id']);
$quantity = $conn->real_escape_string($data['quantity']);

// Vérifier si l'élément existe et appartient à l'utilisateur
$check_query = "SELECT id FROM cart_items WHERE id = '$cart_item_id' AND user_id = '$user_id'";
$result = $conn->query($check_query);

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Élément introuvable"]);
    exit;
}

// Mettre à jour la quantité
$update_query = "UPDATE cart_items SET quantity = '$quantity' WHERE id = '$cart_item_id'";

if ($conn->query($update_query)) {
    echo json_encode([
        "success" => true,
        "message" => "Quantité mise à jour",
        "quantity" => $quantity
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la mise à jour: " . $conn->error
    ]);
}

$conn->close();
?>