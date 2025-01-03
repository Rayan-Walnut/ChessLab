import React, { useState } from 'react';
import { Heart, Share2, Calendar, Gauge, Fuel, MapPin, Phone, Mail, Check, ChevronLeft, ChevronRight, Info, Milestone } from 'lucide-react'
import Header from './components/Header';
import Card from './components/Card';
import Button from './components/Button';

const Details = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const vehicle = {
    id: 1,
    name: 'Mercedes-AMG GT',
    type: 'Black Series',
    year: 2023,
    price: 489500,
    mileage: 15000,
    power: '730ch',
    transmission: 'Automatique',
    fuel: 'Essence',
    consumption: '11.3L/100km',
    co2: '256 g/km',
    warranty: '24 mois',
    location: 'Paris, France',
    registration: {
      number: 'AA-123-BB',
      date: '15/06/2023',
      manufacturer: 'Mercedes-Benz',
      variant: 'C190 AMG GT BLACK SERIES',
      commercial: 'AMG GT Black Series',
      vin: 'WDDYJ7JA3LA015842',
      genre: 'VP',
      formula: 'ABC12345678',
      powerDin: '730',
      powerFiscal: '54',
      color: 'Gris Magno',
    },
    images: [
      'https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    description: 'La Mercedes-AMG GT Black Series représente le summum de la performance automobile. Avec son moteur V8 bi-turbo de 730 chevaux, cette supercar offre des sensations de conduite incomparables.',
    features: [
      'Système de navigation COMAND Online',
      'Toit panoramique',
      'Sièges sport AMG en cuir Nappa',
      'Système audio Burmester High-End',
      'Pack Carbone AMG extérieur',
      'Système de freinage céramique composite',
      'Jantes forgées 19"/20"',
      'Caméra 360°'
    ],
    stats: {
      power: '730ch',
      speed: '325 km/h',
      acceleration: '3.2s'
    }
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % vehicle.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
       <Header />
      </nav>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-600">Accueil</a>
          <ChevronRight size={16} />
          <a href="/vehicles" className="hover:text-gray-600">Véhicules</a>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium">{vehicle.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative w-full h-0 pb-[75%] rounded-2xl overflow-hidden">
              <img
                src={vehicle.images[activeImageIndex]}
                alt={vehicle.name}
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-full h-0 pb-[75%] rounded-lg overflow-hidden border-2 transition-colors ${index === activeImageIndex ? 'border-red-600' : 'border-transparent hover:border-red-300'
                    }`}
                >
                  <img src={image} alt="" layout="fill" objectFit="cover" className="absolute top-0 left-0 w-full h-full" />
                </button>
              ))}
            </div>

            {/* Description */}
            <Card className='p-6'>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
              <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
            </Card>

            {/* Features */}
            <Card className='p-6'>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Équipements et options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-600">
                    <Check size={20} className="text-red-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Technical Information */}
            <Card className='p-6'>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Informations techniques</h2>
              <div className="divide-y divide-gray-100">
                {Object.entries(vehicle.registration).map(([key, value]) => (
                  <div key={key} className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-500">{key}</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Details & Contact */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                  <p className="text-xl text-gray-600">{vehicle.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="p-2">
                    <Heart size={20} />
                  </Button>
                  <Button variant="outline" className="p-2">
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold text-red-600 mb-6">
                {vehicle.price.toLocaleString('fr-FR')} €
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <Calendar size={24} className="text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Année</div>
                    <div className="text-lg font-semibold text-gray-900">{vehicle.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <Milestone size={24} className="text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Kilométrage</div>
                    <div className="text-lg font-semibold text-gray-900">{vehicle.mileage.toLocaleString('fr-FR')} km</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <Gauge size={24} className="text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Puissance</div>
                    <div className="text-lg font-semibold text-gray-900">{vehicle.power}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <Fuel size={24} className="text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Carburant</div>
                    <div className="text-lg font-semibold text-gray-900">{vehicle.fuel}</div>
                  </div>
                </div>
              </div>

              <div className="py-4 px-4 bg-gray-50 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-gray-600 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    Ce véhicule est garanti {vehicle.warranty} et a fait l&apos;objet d&apos;une inspection complète par nos experts.
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  <Calendar className="w-5 h-5 mr-2" />
                  Réserver un essai
                </Button>
                <Button variant="outline" className="w-full border-2 border-gray-600 text-gray-600 hover:bg-gray-50 font-semibold py-4 rounded-xl transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  Demander plus d'informations
                </Button>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className='p-6'>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Contactez-nous</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={20} className="text-gray-400" />
                  <span>{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={20} className="text-gray-400" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={20} className="text-gray-400" />
                  <span>contact@copvo.fr</span>
                </div>
              </div>
            </Card>

            {/* Similar Vehicles */}
            <Card className='p-6'>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Véhicules similaires</h2>
              <div className="space-y-4">
                {[1, 2].map((_, index) => (
                  <a
                    key={index}
                    href="#test"
                    className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      width={96}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">Mercedes-AMG C63 S</h3>
                      <p className="text-sm text-gray-600">2023 • 12 000 km</p>
                      <p className="text-sm font-medium text-gray-600">129 900 €</p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-12 text-gray-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">À propos</h3>
              <p className="text-sm">
                CopVO est votre partenaire de confiance pour l&apos;achat de véhicules d&apos;occasion premium.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>Achat de véhicules</li>
                <li>Financement</li>
                <li>Garantie</li>
                <li>Service après-vente</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>+33 1 23 45 67 89</li>
                <li>contact@copvo.fr</li>
                <li>Paris, France</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href="#test"
                    className="text-gray-600 hover:text-gray-600 transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 mt-8 text-center text-sm">
            <p>&copy; 2024 CopVO. Tous droits réservés.</p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#test" className="hover:text-gray-600 transition-colors">Mentions légales</a>
              <a href="#test" className="hover:text-gray-600 transition-colors">Politique de confidentialité</a>
              <a href="#test" className="hover:text-gray-600 transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Details;