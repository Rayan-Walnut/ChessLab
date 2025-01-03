import React from 'react';
import { Trophy, Medal, Star, Globe, Linkedin, Mail } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Alexandre Dupont',
      role: 'Grand Maître International',
      image: '/team/member1.jpg', // à remplacer par vos images
      achievements: ['Champion de France 2022', 'ELO 2650'],
      specialties: ['Stratégie avancée', 'Finales complexes'],
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'alexandre@chesslab.fr'
      }
    },
    {
      name: 'Marie Laurent',
      role: 'Maître International',
      image: '/team/member2.jpg',
      achievements: ['Vice-championne d\'Europe 2021', 'ELO 2450'],
      specialties: ['Ouvertures modernes', 'Tactiques'],
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'marie@chesslab.fr'
      }
    },
    {
      name: 'Thomas Bernard',
      role: 'FIDE Master',
      image: '/team/member3.jpg',
      achievements: ['Champion régional 2023', 'ELO 2350'],
      specialties: ['Formation débutants', 'Milieu de jeu'],
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'thomas@chesslab.fr'
      }
    },
    {
      name: 'Sophie Martin',
      role: 'Maître FIDE',
      image: '/team/member4.jpg',
      achievements: ['Championne jeunes 2020', 'ELO 2300'],
      specialties: ['Pédagogie jeunes', 'Préparation mentale'],
      socials: {
        linkedin: 'https://linkedin.com',
        email: 'sophie@chesslab.fr'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* En-tête de la page */}
      <Header />

      {/* Section statistiques */}
      <div className="container mx-auto px-4 py-12 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600">Titres internationaux</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Medal className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600">Élèves formés</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">20+</div>
            <div className="text-gray-600">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
            <div className="text-gray-600">Pays représentés</div>
          </div>
        </div>
      </div>

      {/* Section membres de l'équipe */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Réalisations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {member.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Spécialités</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {member.specialties.map((specialty, i) => (
                        <li key={i}>{specialty}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Linkedin className="w-5 h-5 text-gray-600" />
                  </a>
                  <a
                    href={`mailto:${member.socials.email}`}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section rejoindre l'équipe */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rejoindre Notre Équipe</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Vous êtes passionné par les échecs et l'enseignement ?
            Nous sommes toujours à la recherche de nouveaux talents pour enrichir notre équipe.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Postuler
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeamPage;