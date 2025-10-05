<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'api.php'; // Fichier contenant la connexion $conn

// Vérifier si la méthode de requête est bien POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Vérifier toutes les données requises
if (
    !empty($data['first_name']) &&
    !empty($data['last_name']) &&
    !empty($data['email']) &&
    !empty($data['phone']) &&
    !empty($data['message'])
) {
    $first_name = $conn->real_escape_string($data['first_name']);
    $last_name  = $conn->real_escape_string($data['last_name']);
    $email      = $conn->real_escape_string($data['email']);
    $phone      = $conn->real_escape_string($data['phone']);
    $message    = $conn->real_escape_string($data['message']);
    
    // Vérifier si le champ read_status existe dans la table
    $checkField = "SHOW COLUMNS FROM contacts LIKE 'read_status'";
    $fieldResult = $conn->query($checkField);

    if ($fieldResult->num_rows === 0) {
        // Le champ n'existe pas, on va l'ajouter
        $addField = "ALTER TABLE contacts ADD read_status TINYINT(1) NOT NULL DEFAULT 0";
        if (!$conn->query($addField)) {
            http_response_code(500);
            echo json_encode([
                "success" => false, 
                "message" => "Impossible de créer le champ read_status: " . $conn->error
            ]);
            exit;
        }
    }
    
    // Insertion avec le champ read_status
    $sql = "INSERT INTO contacts (first_name, last_name, email, phone, message, read_status) 
            VALUES ('$first_name', '$last_name', '$email', '$phone', '$message', 0)";
    
    if ($conn->query($sql) === TRUE) {
        $contactId = $conn->insert_id;
        // On récupère la ligne qui vient d'être insérée
        $sqlSelect = "SELECT * FROM contacts WHERE id = $contactId";
        $result = $conn->query($sqlSelect);
        $contact = $result->fetch_assoc();

        echo json_encode([
            "success" => true,
            "message" => "Message envoyé avec succès.",
            "contact" => $contact
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Erreur lors de l'envoi: " . $conn->error
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "message" => "Les données sont incomplètes."
    ]);
}

$conn->close();
?>