// SubscriptionSection.jsx - Composant des forfaits
import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import Button from './Button';

const SubscriptionSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('auth');
    setIsAuthenticated(!!token);

    // Charger les forfaits
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('http://localhost/ChessLab/api/get_subscriptions.php');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des forfaits');
        }
        const data = await response.json();
        if (data.success) {
          setSubscriptions(data.subscriptions || []);
        } else {
          setError(data.message || 'Erreur lors du chargement des forfaits');
        }
      } catch (err) {
        console.error('Erreur de chargement des forfaits:', err);
        setError(err.message || 'Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleAddToCart = async (subscriptionId) => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion avec un paramètre de redirection
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    // Éviter les ajouts multiples simultanés
    if (addingToCart) return;
    
    setAddingToCart(true);
    
    const token = localStorage.getItem('auth');
    try {
      console.log('Ajout au panier du forfait ID:', subscriptionId);
      
      const response = await fetch('http://localhost/ChessLab/api/add_to_cart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscription_id: subscriptionId })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      
      if (data.success) {
        // Afficher une notification ou un message de succès
        alert('Forfait ajouté au panier !');
      } else {
        console.error('Erreur retournée par le serveur:', data.message);
        alert(data.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      alert('Erreur de connexion au serveur: ' + err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center">Chargement des forfaits...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-500">Erreur: {error}</div>;
  }

  return (
    <section className="py-16 bg-gray-50" id="forfaits">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 text-center">
          Nos Forfaits
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-base">
          Des forfaits adaptés à tous les niveaux, de débutant à expert
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptions.map((subscription) => {
            // Vérifier si c'est le forfait intermédiaire (généralement le plus populaire)
            const isPopular = subscription.name.toLowerCase().includes('intermédiaire');
            const features = subscription.features ? subscription.features.split(',') : [];

            return (
              <div 
                key={subscription.id} 
                className={`relative ${isPopular ? 'ring-2 ring-blue-600 transform scale-105' : 'border-2 border-blue-100'} p-6 bg-white hover:shadow-xl transition-all duration-300 rounded-xl`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Plus populaire
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{subscription.name}</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {subscription.price}€
                    <span className="text-base font-normal text-gray-600">/mois</span>
                  </div>
                  <p className="text-gray-600 text-sm">{subscription.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 text-sm">
                      <Check className="w-5 h-5 text-blue-600 mr-3" />
                      {feature.trim()}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleAddToCart(subscription.id)}
                  variant={isPopular ? "primary" : "outline"} 
                  className={isPopular 
                    ? "w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    : "w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  }
                  disabled={addingToCart}
                >
                  <div className="flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAuthenticated 
                      ? addingToCart ? "Ajout en cours..." : "Ajouter au panier" 
                      : "Se connecter pour commander"}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;