<?php
// mark_contact_read.php
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

// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Récupérer les données envoyées
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si l'ID est présent
if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID du message manquant.']);
    exit;
}

$id = $conn->real_escape_string($data['id']);

// Vérifier si le champ read_status existe dans la table
$checkField = "SHOW COLUMNS FROM contacts LIKE 'read_status'";
$fieldResult = $conn->query($checkField);

if ($fieldResult && $fieldResult->num_rows === 0) {
    // Le champ n'existe pas, on va l'ajouter
    $addField = "ALTER TABLE contacts ADD read_status TINYINT(1) NOT NULL DEFAULT 0";
    if (!$conn->query($addField)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Impossible de créer le champ read_status: ' . $conn->error]);
        exit;
    }
}

// Mettre à jour le statut de lecture
$sql = "UPDATE contacts SET read_status = 1 WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Message marqué comme lu.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour: ' . $conn->error]);
}

$conn->close();
?>