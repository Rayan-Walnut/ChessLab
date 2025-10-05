<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['name']) && !empty($data['start_date']) && !empty($data['end_date'])) {
    $name = $conn->real_escape_string($data['name']);
    $start_date = $conn->real_escape_string($data['start_date']);
    $end_date = $conn->real_escape_string($data['end_date']);
    
    $sql = "INSERT INTO tournaments (name, start_date, end_date) VALUES ('$name', '$start_date', '$end_date')";
    if ($conn->query($sql) === TRUE) {
        $tournamentId = $conn->insert_id;
        // Récupère le tournoi ajouté
        $sqlSelect = "SELECT * FROM tournaments WHERE id = $tournamentId";
        $result = $conn->query($sqlSelect);
        $tournament = $result->fetch_assoc();
        echo json_encode([
            "message" => "Tournoi ajouté avec succès.",
            "tournament" => $tournament
        ]);
    } else {
        echo json_encode(["message" => "Erreur lors de l'ajout: " . $conn->error]);
    }
} else {
    echo json_encode(["message" => "Les données sont incomplètes."]);
}

$conn->close();