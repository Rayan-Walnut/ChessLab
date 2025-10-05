<?php
// delete_contact.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Fichier avec la connexion $conn

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    $id = $conn->real_escape_string($data['id']);
    
    $sql = "DELETE FROM contacts WHERE id = '$id'";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            "success" => true,
            "message" => "Message supprimé avec succès."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de la suppression: " . $conn->error
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "ID du message manquant."
    ]);
}

$conn->close();
?>