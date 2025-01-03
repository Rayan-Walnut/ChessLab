import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Gauge,
  Filter,
  Heart,
  Share2,
  Fuel,
  ArrowUpDown,
} from "lucide-react";
import Button from './components/Button';
import Card from './components/Card';
import Header from './components/Header';
import Input from './components/Input';
import Footer from './components/Footer';

const VehicleExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [
    { id: 'all', name: 'Tout', count: 152 },
    { id: 'berlines', name: 'Berlines', count: 45 },
    { id: 'suv', name: 'SUV', count: 38 },
    { id: 'coupe', name: 'Coupés', count: 29 },
    { id: 'cabriolet', name: 'Cabriolets', count: 24 },
    { id: 'electric', name: 'Électrique', count: 16 }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-white border-gray-200">
        <div className="container mx-auto px-4 py-12 mt-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Découvrez notre collection de véhicules
            </h1>
            <p className="text-gray-600 mb-8">
              Plus de 150 véhicules premium sélectionnés et inspectés pour une expérience unique.
            </p>

            {/* Search Panel */}
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1">
                <Input
                  icon={Search}
                  placeholder="Rechercher un véhicule"
                />
              </div>

              <Button variant="outline" className="h-11 px-4 rounded-lg flex items-center gap-2">
                <Filter size={18} />
                <span>Filtres</span>
              </Button>
              <Button variant="outline" className="h-11 px-4 rounded-lg flex items-center gap-2">
                <ArrowUpDown size={18} />
                <span>Trier</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Categories */}
      <div className="border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${selectedCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {cat.name}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-md inline-flex items-center
                  ${selectedCategory === cat.id
                    ? 'bg-gray-500/30 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Véhicules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all">
              <div className="relative">
                <div className="">
                  <img
                    src="https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Badges et Actions */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded-md">
                    Premium
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex gap-1">
                  <button className="p-1.5 rounded-md bg-white/90 text-gray-600 
                    hover:text-gray-600 transition-colors">
                    <Heart size={16} />
                  </button>
                  <button className="p-1.5 rounded-md bg-white/90 text-gray-600 
                    hover:text-gray-600 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">Mercedes-AMG GT</h3>
                    <p className="font-medium text-gray-600">489 500 €</p>
                  </div>
                  <p className="text-sm text-gray-500">Black Series</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-gray-50">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-600">2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-gray-50">
                    <Gauge size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-600">15k km</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-gray-50">
                    <Fuel size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-600">Essence</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full flex justify-center">
                  Voir le détail
                </Button>
              </div>
            </Card>
          ))}


        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleExplorer;