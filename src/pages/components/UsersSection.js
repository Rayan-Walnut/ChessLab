"use client";
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

function UsersSection({ users, onClickAddUser, onClickViewDetails, onClickEditUser, onClickDeleteUser }) {
  // S'assurer que users est toujours un tableau, même s'il est undefined ou null
  const userList = Array.isArray(users) ? users : [];
  
  return (
    <main className="flex-1 overflow-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {userList.length} utilisateur{userList.length > 1 ? "s" : ""} enregistré{userList.length > 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Button onClick={onClickAddUser}>Ajouter un utilisateur</Button>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-medium w-[100px]">ID</th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Créé le</th>
                <th className="px-3 py-2 text-left font-medium w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.length > 0 ? (
                userList.map((user) => (
                  <tr key={user.IdUtilisateur} className="border-b">
                    <td className="px-3 py-2 font-medium">{user.IdUtilisateur}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.created_at}</td>
                    <td className="px-3 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onClickViewDetails(user)}>
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onClickEditUser(user)}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => onClickDeleteUser(user)}>
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}

export default UsersSection;