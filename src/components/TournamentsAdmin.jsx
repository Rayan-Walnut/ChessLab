"use client"
import { useState, useEffect } from "react"
import { MoreHorizontal, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import AddTournamentModal from "@/components/AddTournamentModal"
import UpdateTournamentModal from "@/components/UpdateTournamentModal"
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal"

const TournamentsAdmin = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTournamentForUpdate, setSelectedTournamentForUpdate] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [tournamentToDelete, setTournamentToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const fetchTournaments = async () => {
    try {
      const response = await fetch("http://localhost/ChessLab/api/get_tournaments.php")
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
      const data = await response.json()
      setTournaments(data.tournaments)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  const handleTournamentAdded = (newTournament) => {
    setTournaments((prev) => [newTournament, ...prev])
    setSuccessMessage("Tournoi ajouté avec succès !")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleTournamentUpdated = (updatedTournament) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === updatedTournament.id ? updatedTournament : t))
    )
    setSuccessMessage("Tournoi modifié avec succès !")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteClick = (tournament) => {
    setTournamentToDelete(tournament)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (tournament) => {
    setIsDeleteModalOpen(false)
    try {
      const response = await fetch("http://localhost/ChessLab/api/delete_tournament.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tournament.id }),
      })
      const data = await response.json()
      if (response.ok && data.message === "Tournoi supprimé avec succès.") {
        setTournaments((prev) => prev.filter((t) => t.id !== tournament.id))
        setSuccessMessage("Tournoi supprimé avec succès !")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        alert(data.message || "Erreur lors de la suppression.")
      }
    } catch (err) {
      console.error(err)
      alert("Erreur de connexion au serveur.")
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Erreur: {error}</div>
  }

  return (
    <div className="p-6">
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md z-50">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Liste des tournois</CardTitle>
            <CardDescription>{tournaments.length} tournoi{tournaments.length > 1 && "s"}</CardDescription>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>Ajouter un tournoi</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>{tournament.id}</TableCell>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>{tournament.start_date}</TableCell>
                    <TableCell>{tournament.end_date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedTournamentForUpdate(tournament) || setIsUpdateModalOpen(true)}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(tournament)}>
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Aucun tournoi trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddTournamentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTournamentAdded={handleTournamentAdded}
      />
      <UpdateTournamentModal
        isOpen={isUpdateModalOpen}
        tournament={selectedTournamentForUpdate}
        onClose={() => setIsUpdateModalOpen(false)}
        onTournamentUpdated={handleTournamentUpdated}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        user={tournamentToDelete}  // tu peux adapter le libellé dans le ConfirmDeleteModal pour "tournoi"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TournamentsAdmin;