"use client";
import React, { useState, useEffect } from "react";
import { MoreHorizontal, Users, Bell, Search, Trophy, Mail, Lock } from "lucide-react";
import BracketSection from "@/components/BracketSection";
import TournamentsSection from "./components/TournamentsSection";
import UsersSection from "./components/UsersSection";
import ContactsSection from "./components/ContactsSection";

// Composants UI
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Modals pour la gestion des utilisateurs
import AddUserModal from "../components/AddUserModal";
import UserDetailsModal from "../components/UserDetailsModal";
import UpdateUserModal from "../components/UpdateUserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

// Modal pour l'ajout de tournoi
import AddTournamentModal from "../components/AddTournamentModal";

// Créez ces deux composants dans le dossier pages/components
import UpdateTournamentModal from "./components/UpdateTournamentModal";
import ConfirmDeleteTournamentModal from "./components/ConfirmDeleteTournamentModal";

// Modals pour les contacts
import ContactDetailsModal from "./components/ContactDetailsModal";
import ConfirmDeleteContactModal from "./components/ConfirmDeleteContactModal";

export default function Admin() {
  // Gestion des utilisateurs
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Gestion des tournois
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [errorTournaments, setErrorTournaments] = useState(null);
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [selectedTournamentForUpdate, setSelectedTournamentForUpdate] = useState(null);
  const [isUpdateTournamentModalOpen, setIsUpdateTournamentModalOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const [isDeleteTournamentModalOpen, setIsDeleteTournamentModalOpen] = useState(false);

  // Gestion des contacts
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [errorContacts, setErrorContacts] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactDetailsModalOpen, setIsContactDetailsModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleteContactModalOpen, setIsDeleteContactModalOpen] = useState(false);

  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      // Récupérer le token depuis localStorage
      const token = localStorage.getItem("auth");
      
      if (!token) {
        throw new Error("Token d'authentification non trouvé. Veuillez vous reconnecter.");
      }
      
      const response = await fetch("http://localhost/ChessLab/api/get_all_users.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse d'erreur:", errorText);
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Users data:", data);
      
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        console.error("Format de réponse incorrect:", data);
        setUsers([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchTournaments = async () => {
    console.log("Fetching tournaments...");
    try {
      const response = await fetch("http://localhost/ChessLab/api/get_tournaments.php");
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      const data = await response.json();
      console.log("Tournaments data:", data);
      // Supposons que l'API renvoie un objet { tournaments: [...] } ou { data: [...] }
      setTournaments(data.tournaments || data.data || []);
      setLoadingTournaments(false);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setErrorTournaments(err.message);
      setLoadingTournaments(false);
    }
  };

  const fetchContacts = async () => {
    console.log("Fetching contacts...");
    try {
      const response = await fetch("http://localhost/ChessLab/api/get_contacts.php");
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      const data = await response.json();
      console.log("Contacts data:", data);
      setContacts(data.data || []);
      setLoadingContacts(false);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setErrorContacts(err.message);
      setLoadingContacts(false);
    }
  };

  // Chargement des données selon la section active
  useEffect(() => {
    if (activeSection === "users") {
      fetchUsers();
    } else if (activeSection === "tournaments") {
      fetchTournaments();
    } else if (activeSection === "contacts") {
      fetchContacts();
    }
  }, [activeSection]);

  // Fonctions de gestion des utilisateurs
  const handleUserAdded = (responseData) => {
    // Assurez-vous d'extraire correctement l'utilisateur de la réponse
    const newUser = responseData.user || responseData.data;
    if (Array.isArray(newUser)) {
      setUsers(prev => [...newUser, ...prev]);
    } else if (newUser) {
      setUsers(prev => [newUser, ...prev]);
    } else {
      // Si aucun utilisateur n'est retourné, juste rafraîchir les données
      fetchUsers();
    }
    setSuccessMessage("Utilisateur ajouté avec succès !");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUserForUpdate(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (user) => {
    setIsDeleteModalOpen(false);
    try {
      const response = await fetch("http://localhost/ChessLab/api/delete_users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdUtilisateur: user.IdUtilisateur }),
      });
      const data = await response.json();
      if (response.ok && data.message === "Utilisateur supprimé avec succès.") {
        setUsers((prev) => prev.filter((u) => u.IdUtilisateur !== user.IdUtilisateur));
        setSuccessMessage("Utilisateur supprimé avec succès !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(data.message || "Erreur inconnue lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.IdUtilisateur === updatedUser.IdUtilisateur ? updatedUser : u))
    );
    setSuccessMessage("Utilisateur modifié avec succès !");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Fonctions pour la gestion des tournois
  const handleAddTournament = () => {
    setIsTournamentModalOpen(true);
  };

  const handleTournamentAdded = (newTournament) => {
    setTournaments((prev) => [newTournament, ...prev]);
    setSuccessMessage("Tournoi ajouté avec succès !");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEditTournament = (tournament) => {
    setSelectedTournamentForUpdate(tournament);
    setIsUpdateTournamentModalOpen(true);
  };

  const handleDeleteTournamentClick = (tournament) => {
    setTournamentToDelete(tournament);
    setIsDeleteTournamentModalOpen(true);
  };

  const handleTournamentUpdated = (updatedTournament) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === updatedTournament.id ? updatedTournament : t))
    );
    setSuccessMessage("Tournoi modifié avec succès !");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleConfirmDeleteTournament = async (tournament) => {
    setIsDeleteTournamentModalOpen(false);
    try {
      const response = await fetch("http://localhost/ChessLab/api/delete_tournament.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tournament.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setTournaments((prev) => prev.filter((t) => t.id !== tournament.id));
        setSuccessMessage("Tournoi supprimé avec succès !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(data.message || "Erreur lors de la suppression du tournoi.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Erreur de connexion au serveur.");
    }
  };

  // Fonctions pour la gestion des contacts
  const handleViewContactDetails = (contact) => {
    setSelectedContact(contact);
    setIsContactDetailsModalOpen(true);
  };

  const handleDeleteContactClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteContactModalOpen(true);
  };

  const handleMarkAsRead = async (contact) => {
    try {
      const response = await fetch("http://localhost/ChessLab/api/mark_contact_read.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contact.id }),
      });
      const data = await response.json();
      if (response.ok) {
        // Mettre à jour le statut localement
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, read_status: 1 } : c))
        );
        // Mettre à jour le contact sélectionné si le modal est ouvert
        if (selectedContact && selectedContact.id === contact.id) {
          setSelectedContact({ ...selectedContact, read_status: 1 });
        }
        setSuccessMessage("Message marqué comme lu !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(data.message || "Erreur lors de la mise à jour du statut.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleConfirmDeleteContact = async (contact) => {
    setIsDeleteContactModalOpen(false);
    try {
      const response = await fetch("http://localhost/ChessLab/api/delete_contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contact.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contact.id));
        setSuccessMessage("Message supprimé avec succès !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(data.message || "Erreur lors de la suppression du message.");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      alert("Erreur de connexion au serveur.");
    }
  };

  // Gestion des chargements et erreurs
  if (activeSection === "users" && loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-blue-600/30"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (activeSection === "users" && error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>Une erreur est survenue lors du chargement.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button variant="outline" onClick={fetchUsers}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSection === "tournaments" && loadingTournaments) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-blue-600/30"></div>
          <p className="text-gray-600">Chargement des tournois...</p>
        </div>
      </div>
    );
  }

  if (activeSection === "tournaments" && errorTournaments) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>Une erreur est survenue lors du chargement des tournois.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{errorTournaments}</p>
            <Button variant="outline" onClick={fetchTournaments}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSection === "contacts" && loadingContacts) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-blue-600/30"></div>
          <p className="text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (activeSection === "contacts" && errorContacts) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>Une erreur est survenue lors du chargement des messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{errorContacts}</p>
            <Button variant="outline" onClick={fetchContacts}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md z-50">
          {successMessage}
        </div>
      )}

      {/* Sidebar */}
      <div className="bg-white border-r border-gray-300 w-64">
        <div className="p-4 flex items-center justify-between border-b border-gray-300 h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">CL</div>
            <span className="font-bold text-lg">ChessLab</span>
          </div>
        </div>
        <div className="p-2 space-y-2">
          <div
            onClick={() => setActiveSection("users")}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-blue-100 ${activeSection === "users" ? "bg-blue-100" : ""}`}
          >
            <Users className="h-5 w-5" />
            <span>Utilisateurs</span>
          </div>
          <div
            onClick={() => setActiveSection("tournaments")}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-blue-100 ${activeSection === "tournaments" ? "bg-blue-100" : ""}`}
          >
            <Trophy className="h-5 w-5" />
            <span>Tournois</span>
          </div>
          <div
            onClick={() => setActiveSection("bracket")}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-blue-100 ${activeSection === "bracket" ? "bg-blue-100" : ""}`}
          >
            <Trophy className="h-5 w-5" />
            <span>Bracket</span>
          </div>
          <div
            onClick={() => setActiveSection("contacts")}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-blue-100 ${activeSection === "contacts" ? "bg-blue-100" : ""}`}
          >
            <Mail className="h-5 w-5" />
            <span>Messages</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto h-full">
        <header className="h-16 border-b border-gray-300 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              Dashboard Admin -{" "}
              {activeSection === "users"
                ? "Utilisateurs"
                : activeSection === "tournaments"
                  ? "Tournois"
                  : activeSection === "contacts"
                    ? "Messages"
                    : "Bracket"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Rechercher..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600"></span>
            </Button>
          </div>
        </header>

        {activeSection === "users" && (
          <UsersSection
            users={users}
            onClickAddUser={() => setIsModalOpen(true)}
            onClickViewDetails={handleViewDetails}
            onClickEditUser={handleEditUser}
            onClickDeleteUser={handleDeleteClick}
          />
        )}

        {activeSection === "tournaments" && (
          <TournamentsSection
            tournaments={tournaments}
            onClickAddTournament={handleAddTournament}
            onClickEditTournament={handleEditTournament}
            onClickDeleteTournament={handleDeleteTournamentClick}
          />
        )}

        {activeSection === "bracket" && <BracketSection />}
        
        {activeSection === "contacts" && (
          <ContactsSection
            contacts={contacts}
            onClickViewDetails={handleViewContactDetails}
            onClickDeleteContact={handleDeleteContactClick}
            onClickMarkAsRead={handleMarkAsRead}
          />
        )}
      </div>

      {/* Modals Utilisateurs */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        user={selectedUser}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        user={selectedUserForUpdate}
        onClose={() => setIsUpdateModalOpen(false)}
        onUserUpdated={handleUserUpdated}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        user={userToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Modals Tournois */}
      <AddTournamentModal
        isOpen={isTournamentModalOpen}
        onClose={() => setIsTournamentModalOpen(false)}
        onTournamentAdded={handleTournamentAdded}
      />
      <UpdateTournamentModal
        isOpen={isUpdateTournamentModalOpen}
        tournament={selectedTournamentForUpdate}
        onClose={() => setIsUpdateTournamentModalOpen(false)}
        onTournamentUpdated={handleTournamentUpdated}
      />
      <ConfirmDeleteTournamentModal
        isOpen={isDeleteTournamentModalOpen}
        tournament={tournamentToDelete}
        onClose={() => setIsDeleteTournamentModalOpen(false)}
        onConfirm={handleConfirmDeleteTournament}
      />
      
      {/* Modals Contacts */}
      <ContactDetailsModal
        isOpen={isContactDetailsModalOpen}
        contact={selectedContact}
        onClose={() => setIsContactDetailsModalOpen(false)}
        onMarkAsRead={handleMarkAsRead}
      />
      <ConfirmDeleteContactModal
        isOpen={isDeleteContactModalOpen}
        contact={contactToDelete}
        onClose={() => setIsDeleteContactModalOpen(false)}
        onConfirm={handleConfirmDeleteContact}
      />
    </div>
  );
}