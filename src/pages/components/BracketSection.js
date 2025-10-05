import React, { useState, useEffect } from "react";
import Bracket from "react-bracket";

function BracketSection() {
  const [matches, setMatches] = useState([]);
  const [layout, setLayout] = useState([]);
  const [data, setData] = useState({});
  const [participants, setParticipants] = useState([]);

  // Récupération des matchs depuis l'API
  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch("http://localhost/ChessLab/api/get_matches.php?tournament_id=1");
        const result = await response.json();
        console.log("Raw matches data:", result);
        // On s'attend à ce que result.matches soit un tableau d'objets matchs
        if (result.matches && Array.isArray(result.matches)) {
          setMatches(result.matches);
        } else {
          console.error("Format de données inattendu", result);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des matchs:", err);
      }
    }
    fetchMatches();
  }, []);

  // Transformation des matchs en layout, data et participants
  useEffect(() => {
    if (matches.length === 0) return;

    // 1. Construction de la structure layout par rounds
    const roundsMap = {};
    matches.forEach(match => {
      // Utilise match.round comme clé (assuré d'être numérique ou convertible)
      const round = match.round;
      if (!roundsMap[round]) roundsMap[round] = [];
      roundsMap[round].push(match);
    });
    // Tri des rounds dans l'ordre croissant
    const sortedRoundsKeys = Object.keys(roundsMap).sort((a, b) => Number(a) - Number(b));
    // Pour chaque round, on construit un tableau des IDs des matchs
    const newLayout = sortedRoundsKeys.map(roundKey => {
      const sortedMatches = roundsMap[roundKey].sort((a, b) => a.match_number - b.match_number);
      return sortedMatches.map(match => match.id);
    });
    setLayout(newLayout);

    // 2. Construction du tableau participants (unique par id)
    const participantSet = new Set();
    matches.forEach(match => {
      if (match.player1_id) participantSet.add(match.player1_id);
      if (match.player2_id) participantSet.add(match.player2_id);
    });
    // On transforme le Set en tableau trié
    const participantArray = Array.from(participantSet).sort((a, b) => a - b);
    // On crée des noms simples, ex: "Player 101"
    const newParticipants = participantArray.map(id => `Player ${id}`);
    setParticipants(newParticipants);

    // Création d'une table de correspondance id -> index
    const playerIdToIndex = {};
    participantArray.forEach((id, index) => {
      playerIdToIndex[id] = index;
    });

    // 3. Construction de l'objet data pour chaque match
    // Chaque match aura la forme attendue : { top: indexPlayer1, bottom: indexPlayer2 }
    // Pour les matchs où un joueur manque, on renvoie -1 (et le callback affichera un espace vide)
    const newData = {};
    matches.forEach(match => {
      const topIndex = match.player1_id ? playerIdToIndex[match.player1_id] : -1;
      const bottomIndex = match.player2_id ? playerIdToIndex[match.player2_id] : -1;
      newData[match.id] = { top: topIndex, bottom: bottomIndex };

      // Si le match a un gagnant (optionnel), on peut indiquer la clé "winner"
      if (match.winner_id) {
        newData[match.id].winner =
          match.winner_id === match.player1_id ? topIndex : bottomIndex;
      }
    });
    setData(newData);
  }, [matches]);

  // Callback pour récupérer le nom d'un participant
  const getParticipant = (options) => {
    // options.info contient la clé (top ou bottom)
    // options.data est l'objet data pour le match
    const index = options.data[options.info];
    if (index >= 0 && participants[index]) {
      return <span>{participants[index]}</span>;
    }
    return <span>&nbsp;</span>;
  };

  // Affichage du chargement si aucun match n'est récupéré
  if (matches.length === 0) {
    return <div>Chargement du bracket...</div>;
  }

  return (
    <div style={{ overflowX: "auto", padding: "1rem" }}>
      <Bracket layout={layout} data={data} participants={participants} getParticipant={getParticipant} />
    </div>
  );
}

export default BracketSection;