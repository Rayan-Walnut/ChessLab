"use client"

import { useEffect, useState } from "react"
import {
  Trophy,
  BookOpen,
  Target,
  Brain,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ShoppingCart,
  CastleIcon,
  Menu,
} from "lucide-react"
import CookieConsent from "react-cookie-consent"

const Home = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Simple toast implementation
  const showToast = (title, message, type = "success") => {
    // Vous pouvez remplacer ceci par votre propre système de notification
    alert(`${title}: ${message}`)
  }

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("auth")
    setIsAuthenticated(!!token)

    // Charger les forfaits depuis la base de données
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("http://localhost/ChessLab/api/get_subscriptions.php")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des forfaits")
        }
        const data = await response.json()
        if (data.success) {
          setSubscriptions(data.subscriptions || [])
        } else {
          setError(data.message || "Erreur lors du chargement des forfaits")
        }
      } catch (err) {
        setError(err.message || "Erreur de connexion au serveur")
        console.error("Erreur:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  const handleAddToCart = async (subscriptionId) => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      window.location.href = "/login?redirect=" + window.location.pathname
      return
    }

    const token = localStorage.getItem("auth")
    try {
      const response = await fetch("http://localhost/ChessLab/api/add_to_cart.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscription_id: subscriptionId }),
      })

      const data = await response.json()
      if (data.success) {
        showToast("Succès!", "Forfait ajouté au panier!")
      } else {
        showToast("Erreur!", data.message || "Erreur lors de l'ajout au panier", "error")
      }
    } catch (err) {
      console.error("Erreur:", err)
      showToast("Erreur!", "Erreur de connexion au serveur", "error")
    }
  }

  // Fallback pour les forfaits si l'API n'est pas disponible
  const defaultSubscriptions = [
    {
      id: 1,
      name: "Débutant",
      description: "Pack d'initiation aux échecs",
      price: "29.99",
      features: "Cours fondamentaux,Forum communautaire,Exercices basiques",
    },
    {
      id: 2,
      name: "Intermédiaire",
      description: "Pour les joueurs qui veulent progresser",
      price: "49.99",
      features: "Tout le niveau Débutant,Cours stratégiques avancés,Mentorat personnalisé,Tournois hebdomadaires",
    },
    {
      id: 3,
      name: "Expert",
      description: "Formation d'excellence pour les joueurs avancés",
      price: "99.99",
      features:
        "Tout le niveau Intermédiaire,Sessions privées avec GM,Analyses personnalisées,Accès aux tournois élites",
    },
  ]

  // Utiliser les forfaits de l'API ou les forfaits par défaut
  const displaySubscriptions = subscriptions.length > 0 ? subscriptions : defaultSubscriptions

  return (
    <div className="min-h-screen bg-gray-50">
       <CookieConsent
        location="top"
        buttonText="J'accepte"
        declineButtonText="Je refuse"
        enableDeclineButton
        cookieName="cookie_consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        declineButtonStyle={{ color: "#fff", background: "#888", fontSize: "13px" }}
        expires={150}
      >
        Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous ?
      </CookieConsent>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-white/80 shadow-sm backdrop-blur-md">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CastleIcon className="w-6 h-6 text-blue-600" />
              <h1 className="ml-2 text-lg font-medium">Académie d'Échecs</h1>
            </div>

            <div className="hidden md:flex space-x-4">
              <a href="/" className="font-medium">
                Accueil
              </a>
              <a href="/cours" className="font-medium">
                Nos Cours
              </a>
              <a href="/tarifs" className="font-medium">
                Tarifs
              </a>
              <a href="/contact" className="font-medium">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="/login"
                className="hidden md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CastleIcon className="mr-2 h-4 w-4" />
                Connexion
              </a>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="/" className="py-2 font-medium border-b border-gray-100">
              Accueil
            </a>
            <a href="/cours" className="py-2 font-medium border-b border-gray-100">
              Nos Cours
            </a>
            <a href="/tarifs" className="py-2 font-medium border-b border-gray-100">
              Tarifs
            </a>
            <a href="/contact" className="py-2 font-medium border-b border-gray-100">
              Contact
            </a>
            <a
              href="/login"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <CastleIcon className="mr-2 h-4 w-4" />
              Connexion
            </a>
          </div>
        </div>
      )}

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-[-6rem] right-[-6rem] w-96 h-96 bg-blue-100 rounded-full blur-[70px] opacity-40"></div>
          <div className="absolute top-1/2 left-[-12rem] w-96 h-96 bg-purple-100 rounded-full blur-[70px] opacity-40"></div>

          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <span className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    Académie d'Échecs • Paris
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                    Devenez un <span className="text-blue-600">Maître des Échecs</span>
                  </h1>
                </div>

                <p className="text-xl text-gray-600">Découvrez l'art des échecs avec nos experts internationaux</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg">
                    <Trophy className="mr-2 h-5 w-5" />
                    Commencer gratuitement
                  </button>
                  <button className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Découvrir nos cours
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-blue-100 to-purple-100 blur-[30px] rounded-full scale-125"></div>
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/image-2.jpg"
                    alt="Échecs experts"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=400&width=600"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Avantages */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Pourquoi choisir notre académie ?</h2>
              <p className="text-gray-600">Une approche moderne et efficace pour tous les niveaux</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Trophy,
                  title: "Experts Internationaux",
                  description: "Apprenez avec des Grands Maîtres",
                },
                {
                  icon: Target,
                  title: "Apprentissage Personnalisé",
                  description: "Un parcours adapté à votre niveau",
                },
                {
                  icon: Brain,
                  title: "Méthode Innovante",
                  description: "Techniques modernes et interactives",
                },
              ].map((item, i) => (
                <div key={i} className="h-full border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl mb-4">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Galerie */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Notre académie en images</h2>
              <p className="text-gray-600">Découvrez notre environnement d'apprentissage</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  image: "/image-1.jpg",
                  title: "Salle de Formation",
                  description: "Un espace moderne pour apprendre",
                },
                {
                  image: "/image-2.jpg",
                  title: "Cours Collectifs",
                  description: "Apprentissage en groupe",
                },
                {
                  image: "/image-3.jpg",
                  title: "Tournois",
                  description: "Compétitions régulières",
                },
              ].map((item, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden group">
                  <img
                    src={item.image || `/placeholder.svg?height=300&width=400`}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=300&width=400"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                      <p className="text-white/80">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Forfaits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Nos Forfaits</h2>
              <p className="text-gray-600">Choisissez le forfait qui correspond à votre niveau</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {displaySubscriptions.map((sub, index) => {
                const features = typeof sub.features === "string" ? sub.features.split(",") : sub.features || []
                const isRecommended = index === 1

                return (
                  <div
                    key={index}
                    className={`h-full border rounded-lg overflow-hidden ${
                      isRecommended ? "border-2 border-blue-600" : "border-gray-200"
                    }`}
                  >
                    {isRecommended && (
                      <div className="bg-blue-600 text-white text-center py-2">
                        <p className="font-bold">Recommandé</p>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-col space-y-4">
                        <h3 className="text-2xl font-bold">{sub.name}</h3>
                        <p className="text-gray-600">{sub.description}</p>

                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">{sub.price}€</span>
                          <span className="text-gray-500 ml-1">/mois</span>
                        </div>

                        <hr className="border-gray-200" />

                        <ul className="space-y-3">
                          {features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <button
                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center text-lg ${
                          isRecommended
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                        } transition-colors`}
                        onClick={() => handleAddToCart(sub.id)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-12 pb-6">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Académie d'Échecs</h3>
                <p className="text-gray-400">L'excellence de l'enseignement des échecs au cœur de Paris</p>
                <div className="flex space-x-4">
                  {[Facebook, Twitter, Instagram].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="bg-gray-800 hover:bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Liens Rapides</h3>
                <div className="flex flex-col space-y-2">
                  {["Accueil", "Nos Cours", "Tarifs", "Contact"].map((link) => (
                    <a key={link} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Cours</h3>
                <div className="flex flex-col space-y-2">
                  {["Débutants", "Intermédiaires", "Avancés", "Cours Enfants"].map((course) => (
                    <a key={course} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {course}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Contact</h3>
                <div className="flex flex-col space-y-3">
                  <div className="flex">
                    <MapPin className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <p className="text-gray-400">5 Avenue Anatole France, 75007 Paris</p>
                  </div>
                  <div className="flex">
                    <Phone className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <p className="text-gray-400">+33 (0)1 23 45 67 89</p>
                  </div>
                  <div className="flex">
                    <Mail className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                    <p className="text-gray-400">contact@academie-echecs-paris.fr</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-800 my-6" />

            <div className="pt-6 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Académie d'Échecs de Paris. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Home