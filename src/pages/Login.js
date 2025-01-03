import React, { useState } from 'react';
import { Mail, Lock, Check, X } from 'lucide-react';
import Button from './components/Button';
import Card from './components/Card';
import Header from './components/Header';
import Input from './components/Input';

const Login = () => {
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

  // Définition des règles de validation
  const validationRules = [
    {
      id: 'comport1',
      pattern: /[a-z]/,
      text: 'Une lettre minuscule'
    },
    {
      id: 'comport2',
      pattern: /[A-Z]/,
      text: 'Une lettre majuscule'
    },
    {
      id: 'comport3',
      pattern: /[0-9]/,
      text: 'Un chiffre'
    },
    {
      id: 'comport4',
      pattern: /[!@#$%^&*]/,
      text: 'Un caractère spécial'
    },
    {
      id: 'comport5',
      pattern: /.{12}/,
      text: '12 caractères minimum'
    }
  ];

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Vérification de chaque règle
    const newValidationStates = {};
    validationRules.forEach(rule => {
      newValidationStates[rule.id] = rule.pattern.test(newPassword);
    });
    setValidationStates(newValidationStates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier si toutes les règles sont validées
    if (!Object.values(validationStates).every(Boolean)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/ChessLab/api/login_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('auth', data.token);
        window.location.href = '/admin';
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

  // Composant pour les critères de validation
  const ValidationCriterion = ({ isValid, text }) => (
    <div className={`flex items-center gap-2 p-2 rounded ${isValid ? 'bg-green-50' : 'bg-red-50'}`}>
      {isValid ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${isValid ? 'text-green-700' : 'text-red-700'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <Header />
      </nav>

      <main className="flex flex-col items-center justify-center flex-grow px-4 py-12 mt-10">
        <Card className="w-full max-w-lg p-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <Input
                icon={Mail}
                placeholder="Entrer votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <Input
                icon={Lock}
                placeholder="Entrer votre mot de passe"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />

              <div className='text-gray-600 mt-4 mb-4'>
                <h4 className="font-medium text-gray-800 mb-3">Le mot de passe doit contenir :</h4>
              </div>
              
              {/* Affichage des critères de validation */}
              <div className="mt-3 space-y-2">
                  {validationRules.map(rule => (
                    <ValidationCriterion
                      key={rule.id}
                      isValid={validationStates[rule.id]}
                      text={rule.text}
                    />
                  ))}
                </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm ml-auto">
                <a href="#forgot-password" className="font-medium text-gray-600 hover:text-gray-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>
            
            <div>
              <Button
                variant="primary"
                className="w-full text-center justify-center flex"
                type="submit"
                disabled={loading || !Object.values(validationStates).every(Boolean)}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-center text-sm text-red-600">{error}</p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Pas encore inscrit ?{' '}
            <a href="/register" className="font-medium text-gray-600 hover:text-gray-500">
              Créer un compte
            </a>
          </p>
        </Card>
      </main>

      <footer className="bg-gray-100 py-12 text-gray-600">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; 2024 CopVO. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;