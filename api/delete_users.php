<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Connexion à la base de données

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['IdUtilisateur'])) {
    $id = $conn->real_escape_string($data['IdUtilisateur']);
    $sql = "DELETE FROM utilisateur WHERE IdUtilisateur = '$id'";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Utilisateur supprimé avec succès."]);
    } else {
        echo json_encode(["message" => "Erreur lors de la suppression : " . $conn->error]);
    }
} else {
    echo json_encode(["message" => "ID utilisateur manquant."]);
}

$conn->close();