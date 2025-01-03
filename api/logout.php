<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Suppression des sessions ou tokens
if (isset($_COOKIE['token'])) {
    setcookie('token', '', time() - 3600, '/'); // Supprime le cookie contenant le token
}

// Répondre avec un message de succès
echo json_encode([
    "message" => "Déconnexion réussie."
]);