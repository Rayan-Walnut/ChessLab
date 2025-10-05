import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ConfirmDeleteModal = ({ isOpen, user, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supprimer l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Confirmer la suppression de <strong>{user?.email}</strong> ?
            <br />
            Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => onConfirm(user)}>
              Supprimer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConfirmDeleteModal