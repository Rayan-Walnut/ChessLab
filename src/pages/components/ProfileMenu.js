import React, { useState } from 'react';
import { LogOut, User, ChevronDown, Settings, LayoutDashboard } from 'lucide-react';

const ProfileMenu = ({ email }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    fetch('http://localhost/ChessLab/api/logout.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(() => {
        localStorage.removeItem('auth');
        window.location.reload();
      })
      .catch(error => console.error("Erreur de déconnexion:", error));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-white border border-gray-200
                   hover:border-gray-300 transition-all duration-200"
      >
        <div className="flex items-center justify-center h-6 w-6 bg-gray-50 rounded-full">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <span className="text-sm text-gray-700">{email}</span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 
                     ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 
                        rounded-lg shadow-sm">
          <div className="p-3 border-b border-gray-100 bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-50 rounded-full 
                            flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className=''>
                <p className="text-sm text-gray-700">{email}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>

          <div className="p-1">
            <a href="/admin" 
              className="flex items-center gap-2 px-3 py-2 rounded-md
                         text-gray-700 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm">Tableau de bord</span>
            </a>
            
            <a href="/profile" 
              className="flex items-center gap-2 px-3 py-2 rounded-md
                         text-gray-700 hover:bg-gray-50"
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Profil</span>
            </a>
            
            <div className="h-px bg-gray-100 my-1" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md
                         text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;