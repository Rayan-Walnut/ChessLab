import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Edit2, 
  Mail, 
  LogOut,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // État initial utilisateur et état de modification
  const [userData, setUserData] = useState({
    IdUtilisateur: '',
    email: '',
    created_at: ''
  });
  
  const [formData, setFormData] = useState({
    email: ''
  });

  // Récupérer le token JWT du localStorage
  const getToken = () => {
    return localStorage.getItem('auth');
  };

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchUserData();
    }
  }, []);

  // Récupérer les données utilisateur
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = getToken();
      
      const response = await fetch('http://localhost/ChessLab/api/get_users.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      const data = await response.json();
      
      if (data.user) {
        setUserData(data.user);
        setFormData({
          email: data.user.email || ''
        });
      }
    } catch (error) {
      showNotification(error.message || 'Erreur lors du chargement du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = getToken();
      
      // Construction des données à envoyer
      const dataToSend = {
        IdUtilisateur: userData.IdUtilisateur,
        email: formData.email
      };
      
      const response = await fetch('http://localhost/ChessLab/api/update_users.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Mettre à jour les données utilisateur après succès
        setUserData({
          ...userData,
          ...dataToSend
        });
        
        showNotification('Profil mis à jour avec succès', 'success');
        setEditMode(false);
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      showNotification(error.message || 'Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Afficher une notification temporaire
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Annuler les modifications
  const handleCancel = () => {
    setFormData({
      email: userData.email || ''
    });
    setEditMode(false);
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md transition-all ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : 
           notification.type === 'error' ? <AlertCircle className="h-5 w-5" /> : 
           <AlertCircle className="h-5 w-5" />}
          <p>{notification.message}</p>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <div className="flex flex-col items-center">
                  {/* Photo de profil */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>

                  {/* Informations utilisateur */}
                  <div className="mt-4 text-center">
                    <h2 className="text-lg font-bold text-gray-900">
                      Utilisateur
                    </h2>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        Membre
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {userData.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Inscrit le : {formatDate(userData.created_at)}
                    </p>
                  </div>
                </div>

                {/* Déconnexion */}
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1">
              {/* Panel de profil */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Informations personnelles</h1>
                    <p className="text-sm text-gray-500 mt-1">Gérez vos informations</p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <Edit2 size={16} />
                      <span>Modifier</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        <X size={16} />
                        <span>Annuler</span>
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <span>Chargement...</span>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>Enregistrer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!editMode}
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                    </div>
                    
                    {/* Informations supplémentaires en lecture seule */}
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Informations du compte</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">ID Utilisateur</p>
                          <p className="font-medium">{userData.IdUtilisateur}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date d'inscription</p>
                          <p className="font-medium">{formatDate(userData.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;