<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'api.php'; // Connexion à la base de données

// Récupérer les données envoyées en POST
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email']) && !empty($data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    // Vérifier si l'utilisateur existe déjà
    $sql = "SELECT * FROM utilisateur WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        echo json_encode(["message" => "L'utilisateur existe déjà."]);
        exit();
    }

    // Hash du mot de passe
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insertion du nouvel utilisateur dans la base de données
    $sqlInsert = "INSERT INTO utilisateur (email, password) VALUES ('$email', '$hashedPassword')";
    if ($conn->query($sqlInsert) === TRUE) {
        echo json_encode(["message" => "Utilisateur enregistré avec succès."]);
    } else {
        echo json_encode(["message" => "Erreur lors de l'enregistrement : " . $conn->error]);
    }
} else {
    echo json_encode(["message" => "Les données sont incomplètes."]);
}

$conn->close();
?>