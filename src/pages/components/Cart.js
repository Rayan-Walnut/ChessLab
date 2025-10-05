// Cart.jsx - Composant moderne pour afficher le panier
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag, CreditCard, ChevronRight, Info } from 'lucide-react';
import Button from '../components/Button';
import Header from '../components/Header';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('auth');
    setIsAuthenticated(!!token);

    if (!token) {
      setLoading(false);
      return;
    }

    // Charger les articles du panier
    const fetchCartItems = async () => {
      try {
        console.log('Récupération des articles du panier...');
        
        const response = await fetch('http://localhost/ChessLab/api/get_cart_items.php', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Réponse du serveur:', data);
        
        if (data.success) {
          setCartItems(data.cart_items || []);
          setTotal(data.total || 0);
        } else {
          console.error('Erreur retournée par le serveur:', data.message);
          setError(data.message || 'Erreur lors du chargement du panier');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du panier:', err);
        setError(err.message || 'Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    // S'assurer que newQuantity est un nombre entier
    if (!isAuthenticated) return;
    
    console.log(`Suppression de l'article: ID=${itemId}`);
    
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch('http://localhost/ChessLab/api/remove_from_cart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart_item_id: itemId })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      
      if (data.success) {
        // Mettre à jour le panier localement
        const removedItem = cartItems.find(item => item.id === itemId);
        setCartItems(cartItems.filter(item => item.id !== itemId));
        
        // Recalculer le total
        if (removedItem) {
          setTotal(prev => prev - parseFloat(removedItem.item_total));
        }
      } else {
        alert(data.message || 'Erreur lors de la suppression de l\'article');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur de connexion au serveur: ' + err.message);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    // S'assurer que newQuantity est un nombre entier
    newQuantity = parseInt(newQuantity);
    
    // Vérifications de sécurité
    if (!isAuthenticated || isNaN(newQuantity) || newQuantity < 1) return;
    
    console.log(`Mise à jour de la quantité: ID=${itemId}, Nouvelle quantité=${newQuantity}`);
    
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch('http://localhost/ChessLab/api/update_cart_quantity.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart_item_id: itemId, quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      
      if (data.success) {
        // Mettre à jour le panier localement
        const updatedItems = cartItems.map(item => {
          if (item.id === itemId) {
            // S'assurer que les calculs sont effectués avec des nombres
            const itemPrice = parseFloat(item.price);
            const oldItemTotal = parseFloat(item.item_total);
            const newItemTotal = itemPrice * newQuantity;
            
            // Mettre à jour le total global
            setTotal(prev => prev - oldItemTotal + newItemTotal);
            
            // Retourner l'objet mis à jour avec les nouveaux montants
            return { 
              ...item, 
              quantity: newQuantity,
              item_total: newItemTotal
            };
          }
          return item;
        });
        setCartItems(updatedItems);
      } else {
        alert(data.message || 'Erreur lors de la mise à jour de la quantité');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la quantité:', err);
      alert('Erreur de connexion au serveur: ' + err.message);
    }
  };

  const handleCheckout = () => {
    // Rediriger vers la page de paiement
    window.location.href = '/checkout';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white shadow-sm">
          <Header />
        </nav>
        
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Vous n'êtes pas connecté</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Connectez-vous pour accéder à votre panier et découvrir nos offres exclusives</p>
              <Button
                onClick={() => window.location.href = '/login?redirect=/cart'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-sm transition-all"
              >
                <span className="flex items-center">
                  Se connecter <ChevronRight className="w-4 h-4 ml-2" />
                </span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white shadow-sm">
          <Header />
        </nav>
        
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-blue-600 font-medium">Chargement de votre panier...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white shadow-sm">
          <Header />
        </nav>
        
        <main className="flex-grow pt-24 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-center flex-col py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Info className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white shadow-sm">
        <Header />
      </nav>
      
      <main className="flex-grow pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Votre Panier</h1>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="text-gray-600 hover:text-blue-600 border-none shadow-none"
            >
              <div className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuer vos achats
              </div>
            </Button>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Votre panier est vide</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Parcourez nos forfaits et découvrez nos programmes d'échecs personnalisés</p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-sm transition-all"
                >
                  <span className="flex items-center">
                    Découvrir les forfaits <ChevronRight className="w-4 h-4 ml-2" />
                  </span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Articles ({cartItems.length})</h2>
                    <div className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-6 first:pt-0 flex flex-col sm:flex-row items-start gap-4">
                          <div className="sm:w-24 h-24 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                            <div className="text-blue-600 font-bold text-xl">{item.name.charAt(0)}</div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Supprimer l'article"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, parseInt(item.quantity) - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Diminuer la quantité"
                                >
                                  <span className="text-gray-500 font-medium">−</span>
                                </button>
                                <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, parseInt(item.quantity) + 1)}
                                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                  aria-label="Augmenter la quantité"
                                >
                                  <span className="text-gray-900 font-medium">+</span>
                                </button>
                              </div>
                              <div className="font-bold text-gray-900 text-right">
                                {parseFloat(item.item_total).toFixed(2)}€
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Sous-total</span>
                        <span>{parseFloat(total).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>TVA (20%)</span>
                        <span>{(parseFloat(total) * 0.2).toFixed(2)}€</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between font-bold text-gray-900">
                          <span>Total</span>
                          <span>{(parseFloat(total) * 1.2).toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Procéder au paiement
                      </div>
                    </Button>
                    
                    <div className="mt-6 text-center">
                      <p className="text-xs text-gray-500">
                        En procédant au paiement, vous acceptez nos conditions générales de vente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white py-8 border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src="/logo.png" alt="ChessLab" className="h-8" />
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Conditions générales</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Assistance</a>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} ChessLab. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;