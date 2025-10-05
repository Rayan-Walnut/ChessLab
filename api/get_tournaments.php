<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'api.php';

$sql = "SELECT * FROM tournaments";
$result = $conn->query($sql);

if ($result) {
    $tournaments = array();
    while($row = $result->fetch_assoc()){
        $tournaments[] = $row;
    }
    echo json_encode(["tournaments" => $tournaments]);
} else {
    echo json_encode(["message" => "Erreur lors de la récupération des tournois."]);
}

$conn->close();