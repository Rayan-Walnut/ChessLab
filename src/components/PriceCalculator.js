import React, { useState } from 'react';
import { Calculator, Clock, Users, Target } from 'lucide-react';

const PriceCalculator = () => {
  const [selectedPlan, setSelectedPlan] = useState('debutant');
  const [duration, setDuration] = useState(1);
  const [options, setOptions] = useState([]);

  const basePrices = {
    debutant: 29,
    intermediaire: 49,
    expert: 99
  };

  const additionalOptions = [
    {
      id: 'coaching',
      name: 'Coaching privé',
      description: '2 sessions de 1h par mois',
      price: 30,
      icon: Users
    },
    {
      id: 'analysis',
      name: 'Analyse de parties',
      description: '4 analyses détaillées par mois',
      price: 20,
      icon: Target
    }
  ];

  const durations = [
    { months: 1, discount: 0 },
    { months: 3, discount: 10 },
    { months: 6, discount: 15 },
    { months: 12, discount: 20 }
  ];

  // Calcul du prix total
  const calculateTotal = () => {
    const basePrice = basePrices[selectedPlan];
    const optionsPrice = options.reduce((total, optionId) => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      return total + (option ? option.price : 0);
    }, 0);
    
    const subtotal = (basePrice + optionsPrice) * duration;
    const discount = durations.find(d => d.months === duration).discount;
    const total = subtotal * (1 - discount / 100);
    
    return {
      subtotal,
      discount: subtotal - total,
      total
    };
  };

  const { subtotal, discount, total } = calculateTotal();

  return (
    <div className="mt-16">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Calculateur de tarif</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Options de gauche */}
          <div className="space-y-6">
            {/* Sélection du forfait */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choisissez votre forfait
              </label>
              <div className="grid gap-3">
                {Object?.entries(basePrices).map(([plan, price]) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedPlan === plan
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="font-medium text-gray-900 capitalize">{plan}</div>
                    <div className="text-sm text-gray-600">{price}€/mois</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Durée d'engagement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée d'engagement
              </label>
              <div className="grid gap-3">
                {durations?.map(({ months, discount }) => (
                  <button
                    key={months}
                    onClick={() => setDuration(months)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                      duration === months
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">
                        {months} {months === 1 ? 'mois' : 'mois'}
                      </span>
                    </div>
                    {discount > 0 && (
                      <span className="text-green-600 text-sm font-medium">
                        -{discount}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Options de droite */}
          <div className="space-y-6">
            {/* Options additionnelles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options additionnelles
              </label>
              <div className="space-y-3">
                {additionalOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      options.includes(option.id)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={options.includes(option.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setOptions([...options, option.id]);
                        } else {
                          setOptions(options.filter(id => id !== option.id));
                        }
                      }}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{option.name}</div>
                        <div className="text-blue-600 font-medium">+{option.price}€/mois</div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Résumé des coûts */}
            <div className="bg-gray-50 rounded-xl p-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Résumé des coûts</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span>
                  <span>-{discount.toFixed(2)}€</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total ({duration} mois)</span>
                    <span className="text-xl">{total.toFixed(2)}€</span>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    Soit {(total / duration).toFixed(2)}€/mois
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;