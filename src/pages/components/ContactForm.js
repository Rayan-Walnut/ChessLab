import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    rgpd: false
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation de base
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.message) {
      setStatus({
        submitting: false,
        success: false,
        error: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }
    
    if (!formData.rgpd) {
      setStatus({
        submitting: false,
        success: false,
        error: "Veuillez accepter la politique de confidentialité."
      });
      return;
    }
    
    setStatus({ submitting: true, success: null, error: null });
    
    try {
      const response = await fetch("http://localhost/ChessLab/api/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus({
          submitting: false,
          success: result.message,
          error: null
        });
        
        // Réinitialiser le formulaire après succès
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          message: '',
          rgpd: false
        });
      } else {
        throw new Error(result.message || "Une erreur est survenue");
      }
    } catch (error) {
      setStatus({
        submitting: false,
        success: null,
        error: error.message
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-center">Contactez-nous</h2>
      
      {status.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {status.success}
        </div>
      )}
      
      {status.error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {status.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-700">
              Prénom<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Votre prénom"
              required
            />
          </div>
          
          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-700">
              Nom<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Votre nom"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="votre.email@exemple.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
            Téléphone<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="01 23 45 67 89"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
            Message<span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Votre message..."
            required
          />
        </div>
        
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="rgpd"
              name="rgpd"
              checked={formData.rgpd}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="rgpd" className="ml-3 text-sm text-gray-600">
              J'accepte que mes données soient traitées dans le cadre de ma demande de contact.<span className="text-red-500">*</span>
            </label>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={status.submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-md"
          >
            {status.submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : 'Envoyer'}
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
        </div>
      </form>
    </div>
  );
};

export default ContactForm;