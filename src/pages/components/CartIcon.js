// CartIcon.jsx - À intégrer dans votre Header
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

const CartIcon = () => {
  const [itemCount, setItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setIsAuthenticated(!!token);

    if (!token) return;

    const fetchCartCount = async () => {
      try {
        const response = await fetch('http://localhost/ChessLab/api/get_cart_count.php', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          setItemCount(data.count);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du compteur:', error);
      }
    };
    
    fetchCartCount();
    
    // Rafraîchir le compteur toutes les 5 minutes ou lors d'un focus sur la fenêtre
    const interval = setInterval(fetchCartCount, 300000);
    
    const handleWindowFocus = () => {
      fetchCartCount();
    };
    
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <a href="/panier" className="relative group">
      <div className="p-2 rounded-full hover:bg-blue-50 transition-colors">
        <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-blue-500" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {itemCount}
          </span>
        )}
      </div>
    </a>
  );
};

export default CartIcon;