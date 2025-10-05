// src/components/BracketAdmin.jsx
"use client"
import React, { useEffect, useState } from "react"
import { Bracket } from "react-bracket" // depuis react-bracket
import { Button } from "@/components/ui/button"

function BracketAdmin() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Id fictif, tu peux le passer en prop si tu veux un bracket pour un tournoi précis
  const tournamentId = 1

  const fetchMatches = async () => {
    try {
      const response = await fetch(`http://localhost/ChessLab/api/get_matches.php?tournament_id=${tournamentId}`)
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`)
      }
      const data = await response.json()
      if (data.matches) {
        setMatches(data.matches)
      } else {
        setError(data.message || "Aucun match trouvé.")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  // Fonction pour transformer nos "matches" en structure "rounds"
  const buildRounds = () => {
    if (!matches || matches.length === 0) return []

    // Regroupe les matches par round
    const roundsMap = {}
    matches.forEach((m) => {
      const r = m.round
      if (!roundsMap[r]) roundsMap[r] = []
      roundsMap[r].push(m)
    })

    // Trie les rounds par ordre croissant
    const sortedRoundsKeys = Object.keys(roundsMap).sort((a, b) => Number(a) - Number(b))

    // Construit le tableau final
    const bracketRounds = sortedRoundsKeys.map((roundKey) => {
      const seeds = roundsMap[roundKey].map((match) => {
        const team1Name = match.player1_id ? `P${match.player1_id}` : "En attente"
        const team2Name = match.player2_id ? `P${match.player2_id}` : "En attente"

        return {
          id: match.id,
          date: new Date().toLocaleString(), // Optionnel
          teams: [
            { name: team1Name },
            { name: team2Name },
          ],
        }
      })

      return {
        title: `Round ${roundKey}`,
        seeds,
      }
    })

    return bracketRounds
  }

  if (loading) {
    return <div className="p-6">Chargement du bracket...</div>
  }
  if (error) {
    return (
      <div className="p-6">
        Erreur : {error}
        <Button onClick={fetchMatches}>Réessayer</Button>
      </div>
    )
  }

  const rounds = buildRounds()

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Bracket du Tournoi #{tournamentId}</h2>
      {rounds.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <Bracket rounds={rounds} />
        </div>
      ) : (
        <p>Aucun match trouvé.</p>
      )}
    </div>
  )
}

export default BracketAdmin