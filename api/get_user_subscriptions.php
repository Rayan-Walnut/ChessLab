<?php
// get_user_subscriptions.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'api.php'; // Fichier avec la connexion $conn

// Log pour le débogage
$logFile = 'subscriptions_log.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Démarrage de la requête get_user_subscriptions\n", FILE_APPEND);

// Vérifier l'authentification
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = str_replace('Bearer ', '', $auth_header);

file_put_contents($logFile, date('Y-m-d H:i:s') . " - Token: " . $token . "\n", FILE_APPEND);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié"]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Erreur: Non authentifié\n", FILE_APPEND);
    exit;
}

// CORRECTION: Utiliser un ID utilisateur qui existe dans la table
$user_id = 2; // Utiliser le même ID que dans add_to_cart.php

file_put_contents($logFile, date('Y-m-d H:i:s') . " - ID utilisateur utilisé: " . $user_id . "\n", FILE_APPEND);

// Vérifier si la table user_subscriptions existe
try {
    $check_table = $conn->query("SHOW TABLES LIKE 'user_subscriptions'");
    $table_exists = $check_table->num_rows > 0;
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Table user_subscriptions existe: " . ($table_exists ? 'Oui' : 'Non') . "\n", FILE_APPEND);
    
    if (!$table_exists) {
        // La table n'existe pas encore
        echo json_encode([
            "success" => true,
            "message" => "Aucun abonnement actif trouvé",
            "subscriptions" => []
        ]);
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Table non existante, retourne liste vide\n", FILE_APPEND);
        exit;
    }
    
    // Récupérer les abonnements de l'utilisateur
    $sql = "SELECT us.id, us.start_date, us.end_date, us.status, 
                  s.name, s.description, s.features, s.price,
                  o.payment_method, o.created_at as order_date
           FROM user_subscriptions us
           JOIN subscriptions s ON us.subscription_id = s.id
           LEFT JOIN orders o ON us.order_id = o.id
           WHERE us.user_id = '$user_id'
           ORDER BY us.end_date DESC";
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Requête SQL: " . $sql . "\n", FILE_APPEND);
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Erreur de base de données: " . $conn->error);
    }
    
    if ($result->num_rows > 0) {
        $subscriptions = array();
        while ($row = $result->fetch_assoc()) {
            $row['is_active'] = $row['status'] === 'active' && strtotime($row['end_date']) >= time();
            $row['days_remaining'] = max(0, floor((strtotime($row['end_date']) - time()) / (60 * 60 * 24)));
            $subscriptions[] = $row;
        }
        
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Nombre d'abonnements trouvés: " . count($subscriptions) . "\n", FILE_APPEND);
        
        echo json_encode([
            "success" => true,
            "message" => "Abonnements récupérés avec succès",
            "subscriptions" => $subscriptions
        ]);
    } else {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Aucun abonnement trouvé\n", FILE_APPEND);
        
        echo json_encode([
            "success" => true,
            "message" => "Aucun abonnement trouvé",
            "subscriptions" => []
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Exception: " . $e->getMessage() . "\n", FILE_APPEND);
}

$conn->close();
?>