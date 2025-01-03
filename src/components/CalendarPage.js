import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trophy, Users, Clock, MapPin, BookOpen } from 'lucide-react';

const CalendarPage = () => {
  // État pour la date sélectionnée et la liste des événements
  const [currentDate, setCurrentDate] = useState(new Date());

  // Exemple de données d'événements
  const events = [
    {
      id: 1,
      title: "Tournoi Blitz Mensuel",
      date: "2024-03-15",
      time: "14:00 - 18:00",
      type: "tournament",
      location: "Salle principale",
      description: "Tournoi de parties rapides ouvert à tous les niveaux",
      icon: Trophy,
      color: "blue"
    },
    {
      id: 2,
      title: "Cours Stratégie Avancée",
      date: "2024-03-16",
      time: "10:00 - 12:00",
      type: "course",
      location: "Salle d'étude",
      description: "Cours sur les structures de pions avec le MI Thomas Bernard",
      icon: BookOpen,
      color: "green"
    },
    {
      id: 3,
      title: "Club Jeunes",
      date: "2024-03-16",
      time: "14:00 - 16:00",
      type: "club",
      location: "Salle junior",
      description: "Session hebdomadaire pour les jeunes joueurs",
      icon: Users,
      color: "purple"
    }
  ];

  // Fonction pour obtenir le nom du mois
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Fonction pour obtenir tous les jours du mois actuel
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const result = [];

    // Ajouter les jours du mois précédent
    for (let i = 0; i < firstDay; i++) {
      result.push({ day: '', isCurrentMonth: false });
    }

    // Ajouter les jours du mois actuel
    for (let i = 1; i <= days; i++) {
      result.push({ 
        day: i, 
        isCurrentMonth: true,
        events: events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getDate() === i && 
                 eventDate.getMonth() === date.getMonth() && 
                 eventDate.getFullYear() === date.getFullYear();
        })
      });
    }

    return result;
  };

  // Navigation dans le calendrier
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* En-tête */}
      <div className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0">
          <img 
            src="/fond.png" 
            alt="Fond échecs" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Calendrier des Événements</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Découvrez nos prochains tournois, cours et événements
          </p>
        </div>
      </div>

      {/* Corps du calendrier */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Navigation du mois */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((date, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 rounded-lg border ${
                  date.isCurrentMonth 
                    ? 'bg-white border-gray-200' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {date.day && (
                  <>
                    <div className="text-right text-sm text-gray-600 mb-2">
                      {date.day}
                    </div>
                    <div className="space-y-1">
                      {date.events?.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded-lg text-xs bg-${event.color}-50 border border-${event.color}-200`}
                        >
                          <div className="font-medium text-gray-900 mb-1">{event.title}</div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Liste des événements à venir */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Prochains événements</h3>
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="flex border-l-4 border-blue-500 bg-gray-50 rounded-lg p-4">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <event.icon className={`w-8 h-8 text-${event.color}-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;