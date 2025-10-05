import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const UpdateUserModal = ({ isOpen, user, onClose, onUserUpdated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pré-remplit le formulaire dès que "user" change
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost/ChessLab/api/update_users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdUtilisateur: user.IdUtilisateur,
          email,
          // Envoie le password seulement s'il est renseigné
          ...(password && { password })
        }),
      });
      const data = await response.json();

      if (response.ok && data.message === "Utilisateur mis à jour avec succès.") {
        // Mets à jour l'utilisateur localement
        onUserUpdated && onUserUpdated({ ...user, email });
        onClose();
      } else {
        setError(data.message || "Erreur inconnue lors de la mise à jour.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Modifier l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <Input
                icon={Mail}
                type="email"
                id="email"
                placeholder="Entrer l'adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe (optionnel)
              </label>
              <Input
                icon={Lock}
                type="password"
                id="password"
                placeholder="Laisser vide pour ne pas changer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 border border-red-200">
                <p className="text-center text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Mise à jour..." : "Modifier"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateUserModal;