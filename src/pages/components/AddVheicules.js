import React, { useState } from 'react';
import { X } from 'lucide-react';
import Select from './Select';

const AddVehicleForm = () => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        immatriculation: '',
        dateImmatriculation: '',
        marqueVehicule: '',
        typeVarianteVersion: '',
        denominationCommerciale: '',
        numeroIdentification: '',
        genreNational: '',
        numeroFormule: '',
        puissanceDin: '',
        puissanceFiscale: '',
        couleur: '',
        opacite: ''
    });

    const colors = [
        { idCouleur: 1, Nom: 'Noir' },
        { idCouleur: 2, Nom: 'Blanc' },
        { idCouleur: 3, Nom: 'Gris' },
        { idCouleur: 4, Nom: 'Bleu' },
        { idCouleur: 5, Nom: 'Rouge' }
    ];

    const handleColorChange = (value) => {
        setSelectedColor(value);
        setFormData(prev => ({ ...prev, couleur: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
    
        try {
            const token = localStorage.getItem('auth');
            const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
    
            // Formater les données
            const vehiculeData = {
                ...formData,
                idUtilisateur: user?.id || 1,
                couleur: selectedColor,
                // Formater la date en YYYY-MM-DD
                dateImmatriculation: formData.dateImmatriculation 
                    ? new Date(formData.dateImmatriculation).toISOString().split('T')[0]
                    : '',
                // Formater les puissances
                puissanceDin: formData.puissanceDin ? `${formData.puissanceDin} Din` : '',
                puissanceFiscale: formData.puissanceFiscale ? `${formData.puissanceFiscale} CV` : ''
            };
    
            const response = await fetch('http://localhost/ChessLab/api/add_vehicule.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(vehiculeData)
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }
    
            setFormData({
                immatriculation: '',
                dateImmatriculation: '',
                marqueVehicule: '',
                typeVarianteVersion: '',
                denominationCommerciale: '',
                numeroIdentification: '',
                genreNational: '',
                numeroFormule: '',
                puissanceDin: '',
                puissanceFiscale: '',
                couleur: '',
                opacite: ''
            });
            setSelectedColor(null);
            setSuccess(true);
    
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
             {error && (
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                    <p className="text-red-600">{error}</p>
                    <button onClick={() => setError(null)} className="text-gray-400 hover:text-red-600">
                        <X size={20} />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <p className="text-green-600">Véhicule ajouté avec succès!</p>
                    <button onClick={() => setSuccess(false)} className="text-green-400 hover:text-green-600">
                        <X size={20} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Immatriculation */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Immatriculation
                            <span className="text-red-600">(A)</span>
                        </label>
                        <input
                            type="text"
                            name="immatriculation"
                            placeholder="1234-AB-56"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                            required
                        />
                        <p className="text-xs text-gray-500">Formats acceptés : 1234-AB-56, ABC-123, AXX-1234</p>
                    </div>

                    {/* Date Immatriculation */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Date Immatriculation
                            <span className="text-red-600">(B)</span>
                        </label>
                        <input
                            type="date"
                            name="dateImmatriculation"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Marque Véhicule */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Marque Véhicule
                            <span className="text-red-600">(D.1)</span>
                        </label>
                        <input
                            type="text"
                            name="marqueVehicule"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Type Variante Version */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Type Variante Version
                            <span className="text-red-600">(D.2)</span>
                        </label>
                        <input
                            type="text"
                            name="typeVarianteVersion"
                            maxLength={15}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Denomination Commerciale */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Denomination Commerciale
                            <span className="text-red-600">(D.3)</span>
                        </label>
                        <input
                            type="text"
                            name="denominationCommerciale"
                            maxLength={8}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Numero Identification */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Numero Identification
                            <span className="text-red-600">(E)</span>
                        </label>
                        <input
                            type="text"
                            name="numeroIdentification"
                            maxLength={17}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Genre National */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Genre National
                            <span className="text-red-600">(J.1)</span>
                        </label>
                        <input
                            type="text"
                            name="genreNational"
                            maxLength={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Numero Formule */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Numero Formule
                        </label>
                        <input
                            type="text"
                            name="numeroFormule"
                            maxLength={17}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Puissance Din */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Puissance Din
                            <span className="text-red-600">(P.2)</span>
                        </label>
                        <input
                            type="number"
                            name="puissanceDin"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Puissance Fiscale */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Puissance Fiscale
                            <span className="text-red-600">(P.6)</span>
                        </label>
                        <input
                            type="number"
                            name="puissanceFiscale"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Couleur */}
                    <div className="">
                        <label className="text-sm font-medium text-gray-700">Couleur</label>
                        <div>
                            <Select
                                options={colors.map(color => ({ value: color.idCouleur, label: color.Nom }))}
                                value={selectedColor}
                                onChange={handleColorChange}
                                placeholder="Sélectionnez une couleur"
                                className="w-full"
                                searchable={true}
                                clearable={true}
                            />
                        </div>
                    </div>

                    {/* Opacité */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Opacité</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="opacite"
                                    value="claire"
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-red-600"
                                />
                                <span className="text-sm text-gray-700">Claire</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="opacite"
                                    value="foncee"
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-red-600"
                                />
                                <span className="text-sm text-gray-700">Foncée</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Enregistrer
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicleForm;