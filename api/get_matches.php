<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'api.php';

$tournamentId = isset($_GET['tournament_id']) ? (int)$_GET['tournament_id'] : 0;
if ($tournamentId <= 0) {
    echo json_encode(["message" => "ID de tournoi invalide."]);
    exit();
}

$sql = "SELECT * FROM matches WHERE tournament_id = $tournamentId ORDER BY round, match_number";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["message" => "Erreur lors de la récupération des matches."]);
    exit();
}

$matches = [];
while($row = $result->fetch_assoc()) {
    $matches[] = $row;
}

echo json_encode(["matches" => $matches]);
$conn->close();