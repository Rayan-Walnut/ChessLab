import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDetailsModal = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Détails de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID :</label>
              <p className="mt-1 text-gray-900">{user.IdUtilisateur}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email :</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Créé le :</label>
              <p className="mt-1 text-gray-900">{user.created_at}</p>
            </div>
            {/* Ajoute d'autres champs si nécessaire */}
          </div>
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsModal;