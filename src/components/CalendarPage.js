import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trophy, Users, Clock, MapPin, BookOpen } from 'lucide-react';

const CalendarPage = () => {
  // État pour la date sélectionnée
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

    // Ajuster pour que la semaine commence le lundi (0 = Lundi, 6 = Dimanche)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Ajouter les jours du mois précédent
    for (let i = 0; i < adjustedFirstDay; i++) {
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

  // Mapping des couleurs pour les types d'événements
  const getEventTypeColor = (type) => {
    switch(type) {
      case 'tournament': return 'bg-blue-100 text-blue-800';
      case 'course': return 'bg-green-100 text-green-800';
      case 'club': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Calendrier des Événements</h1>
        
        {/* Navigation du mois */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-lg shadow mb-8">
          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 border-b">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 auto-rows-auto">
            {getDaysInMonth(currentDate).map((date, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-1 border-b border-r ${
                  date.isCurrentMonth 
                    ? 'bg-white' 
                    : 'bg-gray-50'
                } ${index % 7 === 6 ? 'border-r-0' : ''}`}
              >
                {date.day && (
                  <>
                    <div className={`text-right p-1 text-sm ${
                      new Date().getDate() === date.day && 
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear()
                        ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto'
                        : 'text-gray-700'
                    }`}>
                      {date.day}
                    </div>
                    
                    <div className="space-y-1 mt-1">
                      {date.events?.map((event) => (
                        <div
                          key={event.id}
                          className={`${getEventTypeColor(event.type)} text-xs p-1 rounded truncate`}
                          title={event.title}
                        >
                          {event.title.length > 12 ? event.title.substring(0, 10) + '...' : event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Liste des événements */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Événements à venir</h3>
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg mr-4 ${getEventTypeColor(event.type)}`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">{event.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
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