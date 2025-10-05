<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Fichier avec la connexion $conn

// Récupérer tous les contacts
$sql = "SELECT * FROM contacts ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $contacts = array();
    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    
    echo json_encode([
        "success" => true,
        "data" => $contacts
    ]);
} else {
    echo json_encode([
        "success" => true,
        "data" => []
    ]);
}

$conn->close();
?>