import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const BracketSection = () => {
  const [matches, setMatches] = useState([]);
  const [layout, setLayout] = useState([]);
  const [data, setData] = useState({});
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function TournamentBracket({ layout, data, getParticipant }) {
    if (!layout || layout.length === 0) {
      return <div>Pas de données pour afficher le bracket</div>;
    }

    // Ajouter des lettres/identifiants uniques pour chaque match
    const matchIdentifiers = {};
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letterIndex = 0;
    
    layout.forEach((round) => {
      round.forEach((matchId) => {
        matchIdentifiers[matchId] = letters[letterIndex % letters.length];
        letterIndex++;
      });
    });

    // Style des matchs et des connecteurs
    const matchWidth = 180;
    const matchHeight = 60;
    const roundSpacing = 80;
    const verticalSpacing = 30;
    const matchBorderRadius = 4;
    const connectorColor = "#E6E6E6";
    const connectorWidth = 2;
    
    // Calculer les positions pour tous les matchs
    const matchPositions = {};
    
    // Positionnement pour le premier round
    if (layout[0]) {
      layout[0].forEach((matchId, idx) => {
        matchPositions[matchId] = {
          x: 0,
          y: idx * (matchHeight + verticalSpacing)
        };
      });
    }
    
    // Pour chaque round suivant, positionner les matchs en fonction des matchs précédents
    for (let round = 1; round < layout.length; round++) {
      layout[round].forEach((matchId, idx) => {
        const prevRoundIdx = round - 1;
        const childIdx1 = idx * 2;
        const childIdx2 = idx * 2 + 1;
        
        let y;
        if (childIdx1 < layout[prevRoundIdx]?.length && childIdx2 < layout[prevRoundIdx]?.length) {
          // Prendre la position médiane entre les deux matchs précédents
          const childId1 = layout[prevRoundIdx][childIdx1];
          const childId2 = layout[prevRoundIdx][childIdx2];
          const y1 = matchPositions[childId1]?.y + matchHeight / 2;
          const y2 = matchPositions[childId2]?.y + matchHeight / 2;
          y = (y1 + y2) / 2 - matchHeight / 2;
        } else if (childIdx1 < layout[prevRoundIdx]?.length) {
          // Si seulement le premier match précédent existe
          const childId1 = layout[prevRoundIdx][childIdx1];
          y = matchPositions[childId1]?.y;
        } else {
          // Fallback
          y = idx * (matchHeight + verticalSpacing) * Math.pow(2, round);
        }
        
        matchPositions[matchId] = {
          x: round * (matchWidth + roundSpacing),
          y: y
        };
      });
    }
    
    // Calculer la hauteur et largeur totales nécessaires
    const heights = Object.values(matchPositions).map(pos => pos.y + matchHeight);
    const maxHeight = heights.length ? Math.max(...heights) : 0;
    const maxWidth = layout.length * (matchWidth + roundSpacing) - roundSpacing;

    // Noms des rounds
    const getRoundName = (roundIdx, totalRounds) => {
      if (roundIdx === totalRounds - 1) return 'Winners Final';
      if (roundIdx === totalRounds - 2) return 'Winners Semi-Final';
      if (roundIdx === totalRounds - 3) return 'Winners Quarter-Final';
      return `Winners Round ${roundIdx + 1}`;
    };

    return (
      <div className="tournament-bracket" style={{ 
        position: "relative",
        width: `${maxWidth}px`,
        height: `${maxHeight + 40}px`,
        fontFamily: "Arial, sans-serif"
      }}>
        {/* En-têtes des rounds */}
        <div className="round-headers" style={{ 
          display: "flex",
          position: "relative",
          width: "100%",
          marginBottom: "15px"
        }}>
          {layout.map((_, roundIdx) => (
            <div 
              key={`header-${roundIdx}`} 
              style={{ 
                width: `${matchWidth}px`,
                marginRight: roundIdx < layout.length - 1 ? `${roundSpacing}px` : "0",
                textAlign: "center",
                padding: "10px 0",
                fontWeight: "600",
                fontSize: "14px",
                color: "#1e293b"
              }}
            >
              {getRoundName(roundIdx, layout.length)}
            </div>
          ))}
        </div>
        
        {/* Cartes des matchs */}
        {layout.map((round, roundIdx) => (
          <React.Fragment key={`round-${roundIdx}`}>
            {round.map((matchId, matchIdx) => {
              const matchData = data[matchId];
              const position = matchPositions[matchId];
              const isLastRound = roundIdx === layout.length - 1;
              
              if (!position) return null;
              
              // Déterminer le match suivant (pour les connexions)
              const nextRoundIdx = roundIdx + 1;
              const nextMatchIdx = Math.floor(matchIdx / 2);
              const hasNextMatch = nextRoundIdx < layout.length && nextMatchIdx < layout[nextRoundIdx].length;
              const nextMatchId = hasNextMatch ? layout[nextRoundIdx][nextMatchIdx] : null;
              const nextMatchPos = nextMatchId ? matchPositions[nextMatchId] : null;
              
              // Déterminer si c'est un match pair ou impair pour les connexions
              const isEvenMatch = matchIdx % 2 === 0;
              const oddMatchExists = matchIdx % 2 === 0 && matchIdx + 1 < round.length;
              const oddMatchId = oddMatchExists ? round[matchIdx + 1] : null;
              const oddMatchPos = oddMatchId ? matchPositions[oddMatchId] : null;
              
              return (
                <React.Fragment key={`match-${matchId}`}>
                  {/* Carte du match */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                      width: `${matchWidth}px`,
                      zIndex: 2
                    }}
                  >
                    {isLastRound ? (
                      // Match spécial pour la finale
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: `${matchBorderRadius}px`,
                          backgroundColor: "white",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          border: "1px solid #f59e0b"
                        }}
                      >
                        <div
                          style={{
                            padding: "18px 15px",
                            backgroundColor: "#fff8e1",
                            color: "#1e293b",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          {matchData && matchData.winner !== undefined ? 
                            getParticipant({ data: matchData, info: matchData.winner === matchData.top ? "top" : "bottom" }) :
                            <span>À déterminer</span>
                          }
                          <Trophy size={16} className="text-amber-500" />
                        </div>
                      </div>
                    ) : (
                      // Match standard
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: `${matchBorderRadius}px`,
                          backgroundColor: "white",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          border: "1px solid #e2e8f0",
                          position: "relative"
                        }}
                      >
                        {/* Identifiant du match */}
                        <span
                          style={{
                            position: "absolute",
                            right: "2px",
                            top: "2px",
                            color: "#94a3b8",
                            fontSize: "10px",
                            fontWeight: "600",
                            zIndex: 3
                          }}
                        >
                          {matchIdentifiers[matchId]}
                        </span>
                        
                        <div
                          className={`player-top ${matchData && matchData.winner === matchData.top ? "winner" : ""}`}
                          style={{
                            padding: "7px 10px",
                            borderBottom: "1px solid #e5e7eb",
                            backgroundColor: matchData && matchData.winner === matchData.top ? "#ecfdf5" : "#f8fafc",
                            color: "#1e293b",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          {getParticipant({ data: matchData, info: "top" })}
                          {matchData && matchData.winner === matchData.top && (
                            <span style={{ color: "#10b981", fontSize: "12px", marginLeft: "6px" }}>✓</span>
                          )}
                        </div>
                        <div
                          className={`player-bottom ${matchData && matchData.winner === matchData.bottom ? "winner" : ""}`}
                          style={{
                            padding: "7px 10px",
                            backgroundColor: matchData && matchData.winner === matchData.bottom ? "#ecfdf5" : "#f8fafc",
                            color: "#1e293b",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          {getParticipant({ data: matchData, info: "bottom" })}
                          {matchData && matchData.winner === matchData.bottom && (
                            <span style={{ color: "#10b981", fontSize: "12px", marginLeft: "6px" }}>✓</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Lignes de connexion */}
                  {hasNextMatch && (
                    <>
                      {/* Si c'est un match pair et qu'il a un match impair associé */}
                      {isEvenMatch && oddMatchExists ? (
                        <>
                          {/* Ligne horizontale depuis le match pair */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${position.x + matchWidth}px`,
                              top: `${position.y + matchHeight / 2}px`,
                              width: `${roundSpacing / 2}px`,
                              height: `${connectorWidth}px`,
                              backgroundColor: connectorColor,
                              zIndex: 1
                            }}
                          />
                          
                          {/* Ligne verticale entre les deux matchs */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${position.x + matchWidth + roundSpacing / 2 - connectorWidth / 2}px`,
                              top: `${position.y + matchHeight / 2}px`,
                              width: `${connectorWidth}px`,
                              height: `${oddMatchPos.y - position.y}px`,
                              backgroundColor: connectorColor,
                              zIndex: 1
                            }}
                          />
                          
                          {/* Ligne horizontale depuis le match impair */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${oddMatchPos.x + matchWidth}px`,
                              top: `${oddMatchPos.y + matchHeight / 2}px`,
                              width: `${roundSpacing / 2}px`,
                              height: `${connectorWidth}px`,
                              backgroundColor: connectorColor,
                              zIndex: 1
                            }}
                          />
                          
                          {/* Ligne horizontale du centre vers le match suivant */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${position.x + matchWidth + roundSpacing / 2}px`,
                              top: `${nextMatchPos.y + matchHeight / 2}px`,
                              width: `${roundSpacing / 2}px`,
                              height: `${connectorWidth}px`,
                              backgroundColor: connectorColor,
                              zIndex: 1
                            }}
                          />
                          
                          {/* Ligne verticale du centre vers le match suivant */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${position.x + matchWidth + roundSpacing / 2 - connectorWidth / 2}px`,
                              top: `${(position.y + oddMatchPos.y) / 2 + matchHeight / 2}px`,
                              width: `${connectorWidth}px`,
                              height: `${Math.abs(nextMatchPos.y + matchHeight / 2 - ((position.y + oddMatchPos.y) / 2 + matchHeight / 2))}px`,
                              backgroundColor: connectorColor,
                              zIndex: 1
                            }}
                          />
                        </>
                      ) : (
                        // Ligne horizontale directe si pas de paire
                        <div
                          style={{
                            position: "absolute",
                            left: `${position.x + matchWidth}px`,
                            top: `${position.y + matchHeight / 2}px`,
                            width: `${roundSpacing}px`,
                            height: `${connectorWidth}px`,
                            backgroundColor: connectorColor,
                            zIndex: 1
                          }}
                        />
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Récupération des matchs depuis l'API
  useEffect(() => {
    async function fetchMatches() {
      try {
        console.log("=== [BracketSection] Fetching matches for tournament #1 ===");
        setLoading(true);
        const response = await fetch("http://localhost/ChessLab/api/get_matches.php?tournament_id=1");
        const result = await response.json();
        if (result.matches && Array.isArray(result.matches)) {
          setMatches(result.matches);
        } else {
          console.error("Format de données inattendu :", result);
          setError("Format de données inattendu");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des matchs:", err);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  // Transformation des données
  useEffect(() => {
    if (matches.length === 0) return;
    try {
      // Construction des participants
      const participantSet = new Set();
      matches.forEach((match) => {
        if (match.player1) participantSet.add(match.player1);
        if (match.player2) participantSet.add(match.player2);
      });
      const participantArray = Array.from(participantSet).sort();
      
      // Mapping noms -> indices
      const playerNameToIndex = {};
      participantArray.forEach((name, index) => {
        playerNameToIndex[name] = index;
      });

      // Construction des rounds et matches
      const roundsMap = {};
      const newData = {};
      matches.forEach((match) => {
        const matchId = Number(match.id);
        const round = match.round || 1;
        if (!roundsMap[round]) roundsMap[round] = [];
        roundsMap[round].push(match);
        
        const topIndex = match.player1 ? playerNameToIndex[match.player1] : -1;
        const bottomIndex = match.player2 ? playerNameToIndex[match.player2] : -1;
        newData[matchId] = { top: topIndex, bottom: bottomIndex };
        
        if (match.winner) {
          newData[matchId].winner = match.winner === match.player1 ? topIndex : bottomIndex;
        }
      });

      const sortedRoundsKeys = Object.keys(roundsMap).sort((a, b) => Number(a) - Number(b));
      const newLayout = sortedRoundsKeys.map((roundKey) => {
        const sortedMatches = roundsMap[roundKey].sort((a, b) => Number(a.match_number) - Number(b.match_number));
        return sortedMatches.map((match) => Number(match.id));
      });

      setLayout(newLayout);
      setParticipants(participantArray);
      setData(newData);
    } catch (err) {
      console.error("Erreur lors de la transformation des données:", err);
      setError("Erreur lors de la transformation des données");
    }
  }, [matches]);

  const getParticipant = ({ data: matchData, info }) => {
    const index = matchData[info];
    if (index >= 0 && participants[index]) {
      return <span>{participants[index]}</span>;
    }
    return <span className="text-gray-400">-</span>;
  };

  if (loading) {
    return (
      <main className="flex-1 p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bracket du tournoi #1</CardTitle>
            <CardDescription>Chargement des données...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-t-blue-500 border-blue-500/30"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bracket du tournoi #1</CardTitle>
            <CardDescription className="text-red-500">Erreur lors du chargement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-lg font-medium">Bracket du tournoi #1</CardTitle>
          <CardDescription>Suivez l'évolution des matchs</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <TournamentBracket layout={layout} data={data} getParticipant={getParticipant} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default BracketSection;