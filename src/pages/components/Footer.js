import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12 text-gray-600 border-t shadow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">À propos</h3>
            <p className="text-sm">
              Chess Lab est votre plateforme d'apprentissage et de perfectionnement aux échecs. Progressez à votre rythme avec nos cours et notre communauté.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Cours en ligne</li>
              <li>Analyse de parties</li>
              <li>Tournois hebdomadaires</li>
              <li>Coaching personnalisé</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>+33 1 23 45 67 89</li>
              <li>contact@chesslab.fr</li>
              <li>Paris, France</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Communauté</h3>
            <div className="flex gap-4">
              {['Discord', 'YouTube', 'Twitch', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-sm">
          <p>&copy; 2024 Chess Lab. Tous droits réservés.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-gray-900 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-gray-900 transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;