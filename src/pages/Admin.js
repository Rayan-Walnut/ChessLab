import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Users, Euro, Package } from 'lucide-react';
import AddVehicleForm from './components/AddVheicules';
import EditVehicleForm from './components/EditVehicleForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { jwtDecode } from 'jwt-decode';

const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const token = localStorage.getItem('auth');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }

  const [stats] = useState({
    totalCars: 157800,
    activeUsers: "1M",
    monthlyRevenue: 50000000000,
    pendingOrders: 6400
  });
  
  const fetchVehicules = async () => {
    try {
      const token = localStorage.getItem('auth');
      const response = await fetch('http://localhost/copvoreact/api/get_vehicule.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Problème lors de la récupération des données');
      const data = await response.json();
      setCars(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchVehicules();
  }, []);
  
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const renderStatsCard = (title, value, icon) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
    </div>
  );
}

if (error) {
  return <div className="text-red-600 text-center p-4">Erreur: {error}</div>;
}

return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <div className="mt-14 p-5">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un véhicule"
      >
        <AddVehicleForm onSuccess={() => {
          setIsModalOpen(false);
          fetchVehicules();
        }} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVehicle(null);
        }}
        title="Modifier le véhicule"
      >
        <EditVehicleForm
          vehiculeId={selectedVehicle}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
            fetchVehicules();
          }}
        />
      </Modal>

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
        </div>

        <div className="rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {renderStatsCard("Utilisateurs", stats.activeUsers, <Users className="h-4 w-4 text-gray-600" />)}
            {renderStatsCard("Revenus Mensuels", `${stats.monthlyRevenue.toLocaleString('fr-FR')} €`, <Euro className="h-4 w-4 text-gray-600" />)}
            {renderStatsCard("Commandes en attente", stats.pendingOrders, <Package className="h-4 w-4 text-gray-600" />)}
          </div>
        </div>

        
      </div>
    </div>
    <Footer />
  </div>
);
};

export default Admin;