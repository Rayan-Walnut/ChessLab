<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Connexion à la base de données

// Récupérer les données envoyées en POST
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->email) &&
    !empty($data->password)
) {
    // Préparation de la requête SQL pour insérer un utilisateur
    $email = $conn->real_escape_string($data->email);
    $password = password_hash($data->password, PASSWORD_DEFAULT); // Hachage du mot de passe

    $sql = "INSERT INTO utilisateur (email, password) VALUES ('$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Utilisateur créé avec succès."]);
    } else {
        echo json_encode(["message" => "Erreur lors de la création de l'utilisateur : " . $conn->error]);
    }
} else {
    echo json_encode(["message" => "Les données sont incomplètes."]);
}

$conn->close();