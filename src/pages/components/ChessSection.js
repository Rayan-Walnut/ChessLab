"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.js"
import { Trophy, Users, Play, Clock, Calendar, ChevronRight, Plus, Search } from "lucide-react"
import ChessGame from "./ChessGame"

const ChessSection = () => {
  const [showGame, setShowGame] = useState(false)
  const [gameMode, setGameMode] = useState("play")
  const [searchQuery, setSearchQuery] = useState("")

  // Données simulées
  const recentGames = [
    { id: 1, opponent: "Magnus C.", result: "Victoire", date: "2023-05-15", rating: 1850 },
    { id: 2, opponent: "Hikaru N.", result: "Défaite", date: "2023-05-12", rating: 2100 },
    { id: 3, opponent: "Fabiano C.", result: "Nulle", date: "2023-05-10", rating: 1950 },
    { id: 4, opponent: "Anish G.", result: "Victoire", date: "2023-05-08", rating: 1800 },
  ]

  const tournaments = [
    { id: 1, name: "Tournoi Hebdomadaire", date: "2023-05-20", participants: 32, status: "Inscriptions ouvertes" },
    { id: 2, name: "Grand Prix d'Été", date: "2023-06-15", participants: 64, status: "À venir" },
    { id: 3, name: "Championnat Débutants", date: "2023-05-25", participants: 16, status: "Inscriptions ouvertes" },
  ]

  const puzzles = [
    { id: 1, difficulty: "Facile", rating: 1200, theme: "Fourchette" },
    { id: 2, difficulty: "Moyen", rating: 1600, theme: "Mat en 2" },
    { id: 3, difficulty: "Difficile", rating: 2000, theme: "Sacrifice" },
    { id: 4, difficulty: "Expert", rating: 2400, theme: "Finale" },
  ]

  const leaderboard = [
    { rank: 1, name: "GrandMaster42", rating: 2350, wins: 152, losses: 43 },
    { rank: 2, name: "ChessWizard", rating: 2280, wins: 134, losses: 51 },
    { rank: 3, name: "KnightRider", rating: 2210, wins: 128, losses: 62 },
    { rank: 4, name: "QueenGambit", rating: 2180, wins: 115, losses: 58 },
    { rank: 5, name: "BishopMaster", rating: 2150, wins: 108, losses: 60 },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jouer aux Échecs</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher des joueurs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setGameMode("play")
              setShowGame(true)
            }}
          >
            <Play className="mr-2 h-4 w-4" />
            Nouvelle Partie
          </Button>
        </div>
      </div>

      {showGame ? (
        <ChessGame isFullScreen={false} onClose={() => setShowGame(false)} />
      ) : (
        <Tabs defaultValue="play" className="w-full" onValueChange={(value) => setGameMode(value)}>
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-4">
            <TabsTrigger value="play">Jouer</TabsTrigger>
            <TabsTrigger value="tournaments">Tournois</TabsTrigger>
            <TabsTrigger value="puzzles">Puzzles</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
          </TabsList>

          <TabsContent value="play" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Modes de jeu</CardTitle>
                  <CardDescription>Choisissez votre mode de jeu préféré</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => setShowGame(true)}
                  >
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="text-lg font-medium">Jouer contre un ami</div>
                    <div className="text-sm text-muted-foreground">Invitez un ami pour une partie</div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200"
                    onClick={() => setShowGame(true)}
                  >
                    <Play className="h-8 w-8 text-green-600" />
                    <div className="text-lg font-medium">Jouer contre l'IA</div>
                    <div className="text-sm text-muted-foreground">Affrontez l'intelligence artificielle</div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-200"
                    onClick={() => setShowGame(true)}
                  >
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div className="text-lg font-medium">Partie rapide</div>
                    <div className="text-sm text-muted-foreground">Trouvez un adversaire rapidement</div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-amber-50 hover:border-amber-200"
                    onClick={() => setShowGame(true)}
                  >
                    <Trophy className="h-8 w-8 text-amber-600" />
                    <div className="text-lg font-medium">Partie classée</div>
                    <div className="text-sm text-muted-foreground">Jouez pour améliorer votre classement</div>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parties récentes</CardTitle>
                  <CardDescription>Vos dernières parties jouées</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentGames.map((game) => (
                    <div key={game.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium">{game.opponent}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(game.date).toLocaleDateString()} • {game.rating} Elo
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          game.result === "Victoire"
                            ? "bg-green-100 text-green-800"
                            : game.result === "Défaite"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {game.result}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    Voir toutes les parties
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques de jeu</CardTitle>
                <CardDescription>Vos performances aux échecs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Classement Elo</div>
                    <div className="text-2xl font-bold">1842</div>
                    <div className="text-xs text-green-600">+24 ce mois</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Parties jouées</div>
                    <div className="text-2xl font-bold">248</div>
                    <div className="text-xs text-muted-foreground">Depuis l'inscription</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Ratio V/D</div>
                    <div className="text-2xl font-bold">1.8</div>
                    <div className="text-xs text-muted-foreground">Victoires vs défaites</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Taux de victoire</div>
                    <div className="text-2xl font-bold">64%</div>
                    <div className="text-xs text-muted-foreground">Sur les 30 derniers jours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tournois disponibles</CardTitle>
                  <CardDescription>Participez à des tournois et gagnez des prix</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un tournoi
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer un nouveau tournoi</DialogTitle>
                      <DialogDescription>Configurez les détails de votre tournoi d'échecs</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tournament-name">Nom du tournoi</Label>
                        <Input id="tournament-name" placeholder="Entrez le nom du tournoi" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tournament-date">Date</Label>
                        <Input id="tournament-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tournament-type">Type de tournoi</Label>
                        <Select defaultValue="swiss">
                          <SelectTrigger id="tournament-type">
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="swiss">Système Suisse</SelectItem>
                            <SelectItem value="round-robin">Toutes Rondes</SelectItem>
                            <SelectItem value="elimination">Élimination directe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tournament-participants">Nombre de participants</Label>
                        <Input id="tournament-participants" type="number" min="4" placeholder="8" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tournament-time">Contrôle du temps</Label>
                        <Select defaultValue="rapid">
                          <SelectTrigger id="tournament-time">
                            <SelectValue placeholder="Sélectionnez un contrôle du temps" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bullet">Bullet (1 min)</SelectItem>
                            <SelectItem value="blitz">Blitz (3-5 min)</SelectItem>
                            <SelectItem value="rapid">Rapide (10 min)</SelectItem>
                            <SelectItem value="classical">Classique (30+ min)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Créer le tournoi</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tournaments.map((tournament) => (
                    <div key={tournament.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-lg">{tournament.name}</div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(tournament.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            {tournament.participants} participants
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tournament.status === "Inscriptions ouvertes"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tournament.status}
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" className="mr-2">
                          Voir les détails
                        </Button>
                        <Button>S'inscrire</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Voir tous les tournois
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="puzzles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Puzzles d'échecs</CardTitle>
                <CardDescription>Améliorez vos compétences avec des puzzles tactiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {puzzles.map((puzzle) => (
                    <div key={puzzle.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{puzzle.theme}</div>
                          <div className="text-sm text-muted-foreground">
                            Difficulté: {puzzle.difficulty} • {puzzle.rating} Elo
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setGameMode("puzzle")
                            setShowGame(true)
                          }}
                        >
                          Résoudre
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Puzzle du jour</Button>
                <Button variant="ghost">
                  Plus de puzzles
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Classement des joueurs</CardTitle>
                <CardDescription>Les meilleurs joueurs de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Rang</th>
                        <th className="text-left py-3 px-4 font-medium">Joueur</th>
                        <th className="text-left py-3 px-4 font-medium">Elo</th>
                        <th className="text-left py-3 px-4 font-medium">V</th>
                        <th className="text-left py-3 px-4 font-medium">D</th>
                        <th className="text-left py-3 px-4 font-medium">Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((player) => (
                        <tr key={player.rank} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                player.rank === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : player.rank === 2
                                    ? "bg-gray-200 text-gray-800"
                                    : player.rank === 3
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {player.rank}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{player.name}</td>
                          <td className="py-3 px-4">{player.rating}</td>
                          <td className="py-3 px-4 text-green-600">{player.wins}</td>
                          <td className="py-3 px-4 text-red-600">{player.losses}</td>
                          <td className="py-3 px-4">{(player.wins / player.losses).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  Voir le classement complet
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default ChessSection