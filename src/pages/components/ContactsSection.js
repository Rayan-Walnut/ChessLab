// ContactsSection.jsx - Composant pour afficher les messages de contact
import React, { useState } from "react";
import { Mail, Eye, Trash, Check, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const ContactsSection = ({ contacts, onClickViewDetails, onClickDeleteContact, onClickMarkAsRead }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les contacts basés sur le terme de recherche
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Messages de Contact</h2>
          <p className="text-gray-500">
            Gérez les messages reçus via le formulaire de contact
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:min-w-[300px]">
            <Input
              placeholder="Rechercher un message..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Non lus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contacts.filter(c => c.read_status != 1).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Messages cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{
              contacts.filter(c => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(c.created_at) > weekAgo;
              }).length
            }</div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages récents</CardTitle>
          <CardDescription>
            Consultez et gérez les messages envoyés par vos visiteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Aucun message trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className={contact.read_status == 1 ? "" : "bg-blue-50"}>
                    <TableCell>
                      {contact.read_status == 1 ? (
                        <Badge variant="default" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                          <Check className="h-3 w-3" />
                          <span>Lu</span>
                        </Badge>
                      ) : (
                        <Badge variant="primary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Non lu</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {contact.message?.substring(0, 30)}
                      {contact.message?.length > 30 ? "..." : ""}
                    </TableCell>
                    <TableCell>
                      {new Date(contact.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {contact.read_status != 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onClickMarkAsRead(contact)}
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onClickViewDetails(contact)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onClickDeleteContact(contact)}
                          title="Supprimer"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsSection;