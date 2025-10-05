<?php
// get_cart_count.php
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

// Compter les éléments dans le panier
$sql = "SELECT SUM(quantity) as total FROM cart_items WHERE user_id = '$user_id'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$count = $row['total'] ? intval($row['total']) : 0;

echo json_encode([
    "success" => true,
    "count" => $count
]);

$conn->close();
?>