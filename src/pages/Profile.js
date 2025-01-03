import React, { useState } from 'react';
import { 
    Camera, Edit2, Mail, Phone, Lock,  
    ArrowRight, User, Settings, Bell, 
     LogOut
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

const Profile = () => {
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [userData] = useState({
        nom: 'John',
        prenom: 'Doe',
        email: 'test2@example.com',
        telephone: '+33 6 12 34 56 78',
        role: 'Administrateur',
        lastActive: 'Il y a 2 heures'
    });

    const stats = [
        { label: 'Véhicules', value: 12, trend: '+2.4%', color: 'text-green-500' },
        { label: 'En attente', value: 3, trend: '-1.2%', color: 'text-yellow-500' }
    ];

    const menuItems = [
        { icon: User, label: 'Profil', tab: 'profile' },
        { icon: Settings, label: 'Paramètres', tab: 'settings' },
        { icon: Bell, label: 'Notifications', tab: 'notifications' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="container mx-auto px-4 py-8 mt-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="w-full lg:w-72">
                            <div className="bg-white rounded-2xl shadow-sm h-[calc(100vh-12rem)] sticky top-24">
                                <div className="p-6">
                                    <div className="flex flex-col items-center">
                                        {/* Photo de profil avec animation hover */}
                                        <div className="relative group">
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 p-0.5 transform transition-transform group-hover:scale-105">
                                                <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                                                    <img
                                                        src="https://via.placeholder.com/150"
                                                        alt="Profile"
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>
                                            <button className="absolute bottom-0 right-0 bg-gray-500 p-2.5 rounded-full text-white hover:bg-gray-600 transition-all transform hover:scale-110">
                                                <Camera size={18} />
                                            </button>
                                        </div>

                                        {/* Informations utilisateur */}
                                        <div className="mt-6 text-center">
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {`${userData.prenom} ${userData.nom}`}
                                            </h2>
                                            <div className="flex items-center justify-center mt-2">
                                                <span className="px-3 py-1.5 bg-gray-50 rounded-full text-sm font-medium text-gray-600">
                                                    {userData.role}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-3">
                                                {userData.lastActive}
                                            </p>
                                        </div>

                                        {/* Stats simplifiés */}
                                        <div className="w-full grid grid-cols-2 gap-4 mt-8">
                                            {stats.map((stat, index) => (
                                                <div key={index} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {stat.value}
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-sm text-gray-500">{stat.label}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="mt-10 space-y-2">
                                        {menuItems.map((item) => (
                                            <button
                                                key={item.tab}
                                                onClick={() => setActiveTab(item.tab)}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all ${
                                                    activeTab === item.tab
                                                        ? 'bg-gray-50 text-gray-600'
                                                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <item.icon size={20} />
                                                    <span>{item.label}</span>
                                                </div>
                                                <ArrowRight size={16} />
                                            </button>
                                        ))}
                                    </nav>

                                    {/* Déconnexion */}
                                    <div className="absolute bottom-6 left-0 right-0 px-6">
                                        <button className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl text-gray-600 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                            <LogOut size={20} />
                                            <span>Déconnexion</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-12rem)]">
                                <div className="p-8 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">Informations personnelles</h1>
                                            <p className="text-sm text-gray-500 mt-2">Gérez vos informations personnelles</p>
                                        </div>
                                        <button
                                            onClick={() => setEditMode(!editMode)}
                                            className="inline-flex items-center space-x-2 px-5 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                            <span>{editMode ? 'Annuler' : 'Modifier'}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 gap-8">
                                        {/* Champs de formulaire espacés */}
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Nom */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                                    <div className="relative rounded-xl">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <User className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={userData.nom}
                                                            disabled={!editMode}
                                                            className="block w-full pl-12 pr-4 py-4 border-gray-200 rounded-xl focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 text-lg"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Prénom */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                                    <div className="relative rounded-xl">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <User className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={userData.prenom}
                                                            disabled={!editMode}
                                                            className="block w-full pl-12 pr-4 py-4 border-gray-200 rounded-xl focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 text-lg"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                    <div className="relative rounded-xl">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Mail className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            value={userData.email}
                                                            disabled={!editMode}
                                                            className="block w-full pl-12 pr-4 py-4 border-gray-200 rounded-xl focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 text-lg"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Téléphone */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                                    <div className="relative rounded-xl">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Phone className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            value={userData.telephone}
                                                            disabled={!editMode}
                                                            className="block w-full pl-12 pr-4 py-4 border-gray-200 rounded-xl focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-50 text-lg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section sécurité */}
                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-4 bg-gray-50 rounded-xl">
                                                    <Lock className="h-6 w-6 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">Sécurité du compte</h3>
                                                    <p className="text-sm text-gray-500 mt-1">Dernière mise à jour il y a 3 jours</p>
                                                </div>
                                            </div>
                                            <button className="px-5 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium">
                                                Changer le mot de passe
                                            </button>
                                        </div>
                                    </div>
                                </div>
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