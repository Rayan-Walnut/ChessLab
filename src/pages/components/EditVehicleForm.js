import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Select from './Select';

const EditVehicleForm = ({ vehiculeId, onClose }) => {
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

    useEffect(() => {
        const fetchVehiculeData = async () => {
            try {
                const response = await fetch(`http://localhost/copvoreact/api/get_vehicule.php?id=${vehiculeId}`);
                if (!response.ok) throw new Error('Erreur lors de la récupération');
                const data = await response.json();
                
                const vehicule = data.data;
                setFormData({
                    immatriculation: vehicule.Immatriculation,
                    dateImmatriculation: vehicule.DateImmatriculation.split('T')[0],
                    marqueVehicule: vehicule.MarqueVehicule,
                    typeVarianteVersion: vehicule.TypeVarianteVersion,
                    denominationCommerciale: vehicule.DenominationCommerciale,
                    numeroIdentification: vehicule.NumeoIdentification,
                    genreNational: vehicule.GenreNational,
                    numeroFormule: vehicule.NumeroFormule,
                    puissanceDin: vehicule.PuissanceDin,
                    puissanceFiscale: vehicule.PuissanceFiscale,
                    opacite: vehicule.Opacite
                });
                setSelectedColor(vehicule.IdCouleur);
            } catch (err) {
                setError(err.message);
            }
        };

        if (vehiculeId) {
            fetchVehiculeData();
        }
    }, [vehiculeId]);

    const handleColorChange = (value) => {
        setSelectedColor(value);
        setFormData(prev => ({ ...prev, couleur: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('auth');
            const vehiculeData = {
                ...formData,
                id: vehiculeId,
                couleur: selectedColor,
                dateImmatriculation: formData.dateImmatriculation,
                puissanceDin: formData.puissanceDin ? `${formData.puissanceDin}` : '',
                puissanceFiscale: formData.puissanceFiscale ? `${formData.puissanceFiscale}` : ''
            };

            const response = await fetch('http://localhost/copvoreact/api/edit_vehicule.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(vehiculeData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erreur de modification');

            setSuccess(true);
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);

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
                    <p className="text-green-600">Véhicule modifié avec succès!</p>
                    <button onClick={() => setSuccess(false)} className="text-green-400 hover:text-green-600">
                        <X size={20} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Même structure de formulaire que AddVehicleForm */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Immatriculation
                            <span className="text-red-600">(A)</span>
                        </label>
                        <input
                            type="text"
                            name="immatriculation"
                            value={formData.immatriculation}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Date Immatriculation
                            <span className="text-red-600">(B)</span>
                        </label>
                        <input
                            type="date"
                            name="dateImmatriculation"
                            value={formData.dateImmatriculation}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Autres champs identiques à AddVehicleForm... */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Marque Véhicule
                            <span className="text-red-600">(D.1)</span>
                        </label>
                        <input
                            type="text"
                            name="marqueVehicule"
                            value={formData.marqueVehicule}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Type Variante Version
                            <span className="text-red-600">(D.2)</span>
                        </label>
                        <input
                            type="text"
                            name="typeVarianteVersion"
                            value={formData.typeVarianteVersion}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                            maxLength={15}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Puissance Din
                            <span className="text-red-600">(P.2)</span>
                        </label>
                        <input
                            type="number"
                            name="puissanceDin"
                            value={formData.puissanceDin}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                            Puissance Fiscale
                            <span className="text-red-600">(P.6)</span>
                        </label>
                        <input
                            type="number"
                            name="puissanceFiscale"
                            value={formData.puissanceFiscale}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>

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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Opacité</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="opacite"
                                    value="claire"
                                    checked={formData.opacite === 'claire'}
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
                                    checked={formData.opacite === 'foncee'}
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
                        disabled={loading}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Modification...' : 'Modifier'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVehicleForm;