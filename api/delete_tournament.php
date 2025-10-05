<?php
// delete_tournament.php
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

// Récupérer les données envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si l'ID est présent
if (!empty($data['id'])) {
    $id = $conn->real_escape_string($data['id']);
    
    // Suppression du tournoi
    $sql = "DELETE FROM tournaments WHERE id = '$id'";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "success" => true,
            "message" => "Tournoi supprimé avec succès."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la suppression: " . $conn->error
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID du tournoi manquant."
    ]);
}

$conn->close();
?>