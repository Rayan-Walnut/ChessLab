// ContactDetailsModal.jsx
import React from "react";
import { X, Mail, Phone, Calendar, MessageSquare, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";

const ContactDetailsModal = ({ isOpen, contact, onClose, onMarkAsRead }) => {
  if (!contact) return null;

  const handleMarkAsRead = () => {
    onMarkAsRead(contact);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails du message</span>
            {contact.read_status == 1 ? (
              <Badge className="bg-gray-100 text-gray-700">Lu</Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-700">Non lu</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Message reçu le {new Date(contact.created_at).toLocaleDateString()} à{' '}
            {new Date(contact.created_at).toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Informations expéditeur</h3>
              
              <div className="flex items-start gap-2 text-sm">
                <div className="bg-gray-100 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Nom complet</div>
                  <div>{contact.first_name} {contact.last_name}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <div className="bg-gray-100 p-2 rounded">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="break-all">{contact.email}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <div className="bg-gray-100 p-2 rounded">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Téléphone</div>
                  <div>{contact.phone}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm">
                <div className="bg-gray-100 p-2 rounded">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">Date d'envoi</div>
                  <div>{new Date(contact.created_at).toLocaleDateString()} à {new Date(contact.created_at).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Message</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-40 overflow-y-auto">
                <p className="whitespace-pre-line text-sm">{contact.message}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          {contact.read_status != 1 && (
            <Button 
              onClick={handleMarkAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Marquer comme lu
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsModal;