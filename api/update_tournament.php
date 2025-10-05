<?php
// update_tournament.php
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

// Vérifier si toutes les données nécessaires sont présentes
if (
    !empty($data['id']) &&
    !empty($data['name']) &&
    !empty($data['start_date']) &&
    !empty($data['end_date'])
) {
    $id = $conn->real_escape_string($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $start_date = $conn->real_escape_string($data['start_date']);
    $end_date = $conn->real_escape_string($data['end_date']);
    
    // Mise à jour du tournoi - uniquement les champs qui existent dans votre base de données
    $sql = "UPDATE tournaments 
            SET name = '$name', 
                start_date = '$start_date', 
                end_date = '$end_date'
            WHERE id = '$id'";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "success" => true,
            "message" => "Tournoi mis à jour avec succès.",
            "tournament" => [
                "id" => $id,
                "name" => $name,
                "start_date" => $start_date,
                "end_date" => $end_date
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la mise à jour: " . $conn->error
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Données incomplètes."
    ]);
}

$conn->close();
?>