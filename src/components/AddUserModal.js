import React, { useState } from 'react';
import { Mail, Lock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationStates, setValidationStates] = useState({
    comport1: false,
    comport2: false,
    comport3: false,
    comport4: false,
    comport5: false
  });

  const validationRules = [
    { id: 'comport1', pattern: /[a-z]/, text: 'Une lettre minuscule' },
    { id: 'comport2', pattern: /[A-Z]/, text: 'Une lettre majuscule' },
    { id: 'comport3', pattern: /[0-9]/, text: 'Un chiffre' },
    { id: 'comport4', pattern: /[!@#$%^&*]/, text: 'Un caractère spécial' },
    { id: 'comport5', pattern: /.{12}/, text: '12 caractères minimum' }
  ];

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const newValidationStates = {};
    validationRules.forEach(rule => {
      newValidationStates[rule.id] = rule.pattern.test(newPassword);
    });
    setValidationStates(newValidationStates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(validationStates).every(Boolean)) {
      setError("Le mot de passe ne respecte pas tous les critères.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/ChessLab/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok && data.message === "Utilisateur enregistré avec succès.") {
        onUserAdded && onUserAdded(data);
        onClose();
      } else {
        setError(data.message || 'Erreur inconnue.');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const ValidationCriterion = ({ isValid, text }) => (
    <div className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${isValid ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
      {isValid ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
          <div className={`w-2.5 h-2.5 rounded-full ${isValid ? 'bg-green-500' : 'bg-transparent'}`}></div>
        </div>
      )}
      <span className={`text-sm font-medium ${isValid ? 'text-green-700' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <Card className="w-full max-w-2xl relative shadow-xl border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-8">
          <CardTitle className="text-2xl font-bold text-gray-800">Ajouter un utilisateur</CardTitle>
          <CardDescription className="text-gray-600 text-base mt-2">
            Créez un nouvel utilisateur pour votre plateforme ChessLab
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-3">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  id="email"
                  placeholder="Entrer l'adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 py-3 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-3">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  id="password"
                  placeholder="Entrer le mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-12 py-3 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  required
                />
              </div>
              <div className="mt-6 mb-3">
                <h4 className="font-semibold text-gray-700 text-lg">Le mot de passe doit contenir :</h4>
              </div>
              <div className="mt-4 space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {validationRules.map(rule => (
                  <ValidationCriterion key={rule.id} isValid={validationStates[rule.id]} text={rule.text} />
                ))}
              </div>
            </div>
            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 border border-red-200 animate-pulse">
                <p className="text-center text-base text-red-600 font-medium">{error}</p>
              </div>
            )}
            <div className="flex justify-end gap-4 mt-8 pt-5 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-3 text-base border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !Object.values(validationStates).every(Boolean)}
                className={`px-6 py-3 text-base rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription...
                  </div>
                ) : "S'inscrire"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUserModal;