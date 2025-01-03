import { Award, BookOpen, Users, Trophy, Star, Target, Brain } from 'lucide-react';
import Button from './components/Button';
import Card from './components/Card';
import Header from './components/Header';
import Footer from './components/Footer';
import CalendarPage from '../components/CalendarPage';
import PriceCalculator from '../components/PriceCalculator';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm ">
        <Header />
      </nav>

      <main className="flex-grow ">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/image-2.jpg"
              alt="Échecs background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-white/60 to-blue-100/80 backdrop-blur-sm" />

          {/* Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                <span>Devenez un </span>
                <span className="text-blue-600">Maître des Échecs</span>
              </h1>

              {/* Description */}
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-700">
                Découvrez l'art des échecs avec nos experts internationaux et notre méthode
                d'apprentissage innovante qui s'adapte à votre niveau
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <div className='flex'>
                    <Trophy className="w-5 h-5 mr-2" />
                    Commencer gratuitement
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-gray-800 text-gray-800 hover:bg-gray-100"
                >
                  <div className='flex'>
                    <BookOpen className="w-5 h-5 mr-2" />
                    Découvrir nos cours
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* Section Carte */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">
              Notre Localisation
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Retrouvez notre académie au cœur de Paris, à deux pas de la Tour Eiffel
            </p>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-transparent pointer-events-none rounded-lg" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1644969661273!5m2!1sfr!2sfr"
                className="w-full h-[500px] rounded-lg shadow-xl ring-1 ring-gray-200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm">
                <h3 className="font-bold text-gray-900 mb-2">Académie d'Échecs de Paris</h3>
                <p className="text-gray-600 text-sm">5 Avenue Anatole France, 75007 Paris</p>
                <p className="text-gray-600 text-sm">Du lundi au samedi : 9h - 20h</p>
              </div>
            </div>
          </div>
        </section>
        {/* Section Galerie Photos */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">
              Notre Académie en Images
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Découvrez notre environnement d'apprentissage et nos événements
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Image 1 */}
              <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/image-1.jpg"
                    alt="Académie d'échecs"
                    className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">Salle de Formation</h3>
                    <p className="text-white/90 text-sm">Un espace moderne pour apprendre</p>
                  </div>
                </div>
              </div>

              {/* Image 2 */}
              <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/image-2.jpg"
                    alt="Cours d'échecs"
                    className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">Cours Collectifs</h3>
                    <p className="text-white/90 text-sm">Apprentissage en groupe</p>
                  </div>
                </div>
              </div>

              {/* Image 3 */}
              <div className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src="/image-3.jpg"
                    alt="Tournoi d'échecs"
                    className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">Tournois</h3>
                    <p className="text-white/90 text-sm">Compétitions régulières</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Avantages */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
              Pourquoi choisir notre académie ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Experts Internationaux</h3>
                <p className="text-gray-600 text-sm">Apprenez avec des Grands Maîtres et Maîtres Internationaux</p>
              </div>
              <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Apprentissage Personnalisé</h3>
                <p className="text-gray-600 text-sm">Un parcours adapté à votre niveau et vos objectifs</p>
              </div>
              <div className="text-center p-6 hover:bg-blue-50 rounded-xl transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Méthode Innovante</h3>
                <p className="text-gray-600 text-sm">Techniques modernes et exercices interactifs</p>
              </div>
            </div>
          </div>
        </section>
        <CalendarPage />
        {/* Section Forfaits */}
        <section className="py-16 bg-gray-50" id="forfaits">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 text-center">
              Notre Forfait
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-base">
              Des forfaits adaptés à tous les niveaux, de débutant à expert
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Forfait Débutant */}
              <Card className="relative border-2 border-blue-100 p-6 bg-white hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Débutant</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    29€
                    <span className="text-base font-normal text-gray-600">/mois</span>
                  </div>
                  <p className="text-gray-600 text-sm">Parfait pour débuter aux échecs</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600 text-sm">
                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                    Cours fondamentaux
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    Forum communautaire
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Award className="w-5 h-5 text-blue-600 mr-3" />
                    Exercices basiques
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  Commencer
                </Button>
              </Card>

              {/* Forfait Intermédiaire */}
              <Card className="relative ring-2 ring-blue-600 transform scale-105 p-6 bg-white hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                    Plus populaire
                  </span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Intermédiaire</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    49€
                    <span className="text-base font-normal text-gray-600">/mois</span>
                  </div>
                  <p className="text-gray-600 text-sm">Pour progresser rapidement</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600 text-sm">
                    <Star className="w-5 h-5 text-blue-600 mr-3" />
                    Tout le niveau Débutant
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                    Cours stratégiques avancés
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    Mentorat personnalisé
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Trophy className="w-5 h-5 text-blue-600 mr-3" />
                    Tournois hebdomadaires
                  </li>
                </ul>
                <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Choisir ce forfait
                </Button>
              </Card>

              {/* Forfait Expert */}
              <Card className="relative border-2 border-blue-100 p-6 bg-white hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert</h3>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    99€
                    <span className="text-base font-normal text-gray-600">/mois</span>
                  </div>
                  <p className="text-gray-600 text-sm">Formation d'excellence</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600 text-sm">
                    <Star className="w-5 h-5 text-blue-600 mr-3" />
                    Tout le niveau Intermédiaire
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Trophy className="w-5 h-5 text-blue-600 mr-3" />
                    Sessions privées avec GM
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Target className="w-5 h-5 text-blue-600 mr-3" />
                    Analyses personnalisées
                  </li>
                  <li className="flex items-center text-gray-600 text-sm">
                    <Trophy className="w-5 h-5 text-blue-600 mr-3" />
                    Accès aux tournois élites
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  Choisir ce forfait
                </Button>
              </Card>
            </div>
          </div>
        </section>
        <div className='p-5'>
          <PriceCalculator />
        </div>


        {/* Section Contact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">
                Contactez-nous
              </h2>
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Une question ? Envie de commencer ? N'hésitez pas à nous contacter
              </p>

              <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
                <form className="space-y-6">
                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="jean.dupont@example.com"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  {/* Case à cocher RGPD */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="rgpd"
                      name="rgpd"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="rgpd" className="text-sm text-gray-500">
                      J'accepte que mes données soient traitées dans le cadre de ma demande de contact.
                      Consultez notre politique de confidentialité pour en savoir plus sur la gestion de vos données.
                    </label>
                  </div>

                  {/* Bouton d'envoi */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Envoyer le message</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;