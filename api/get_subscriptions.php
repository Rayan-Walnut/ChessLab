<?php
// get_subscriptions.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Fichier avec la connexion $conn

// Récupérer tous les forfaits
$sql = "SELECT * FROM subscriptions ORDER BY price ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $subscriptions = array();
    while ($row = $result->fetch_assoc()) {
        $subscriptions[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Forfaits récupérés avec succès",
        "subscriptions" => $subscriptions
    ]);
} else {
    echo json_encode([
        "success" => true,
        "message" => "Aucun forfait disponible",
        "subscriptions" => []
    ]);
}

$conn->close();
?>