"use client";
import React, { useState, useEffect, useRef } from "react";
import {Chess}  from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  RotateCw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  MessageSquare,
  Settings,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
  X,
} from "lucide-react";

/*
  ChessGame sans composants shadcn/ui – version corrigée (syntaxe OK)
*/

const ChessGame = ({
  initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  timeControl = 10,
  isFullScreen = false,
  onClose,
}) => {
  /* ---------- State ---------- */
  const [game, setGame] = useState(new Chess(initialFen));
  const [fen, setFen] = useState(initialFen);
  const [orientation, setOrientation] = useState("white");
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "Système", message: "Bienvenue dans la partie d'échecs!", timestamp: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [boardWidth, setBoardWidth] = useState(500);
  const [fullScreen, setFullScreen] = useState(isFullScreen);
  const [whiteTime, setWhiteTime] = useState(timeControl * 60);
  const [blackTime, setBlackTime] = useState(timeControl * 60);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeControlSetting, setTimeControl] = useState(timeControl);

  /* ---------- Refs ---------- */
  const timerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const boardContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ---------- Effects ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (boardContainerRef.current) {
        const width = boardContainerRef.current.offsetWidth;
        setBoardWidth(Math.min(width - 20, 600));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fullScreen]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (activeTimer) {
      timerRef.current = setInterval(() => {
        if (activeTimer === "white") {
          setWhiteTime((t) => {
            if (t <= 0) {
              clearInterval(timerRef.current);
              alert("Temps écoulé! Les noirs gagnent.");
              return 0;
            }
            return t - 1;
          });
        } else {
          setBlackTime((t) => {
            if (t <= 0) {
              clearInterval(timerRef.current);
              alert("Temps écoulé! Les blancs gagnent.");
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    }
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [activeTimer]);

  /* ---------- Helpers ---------- */
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const onDrop = (from, to) => {
    if (isAnalysisMode || currentMoveIndex < moveHistory.length - 1) {
      const g = new Chess(fen);
      try {
        const mv = g.move({ from, to, promotion: "q" });
        if (!mv) return false;
        const histEntry = { fen: g.fen(), move: `${mv.from}-${mv.to}`, san: mv.san };
        if (currentMoveIndex < moveHistory.length - 1) {
          setMoveHistory((h) => [...h.slice(0, currentMoveIndex + 1), histEntry]);
        } else {
          setMoveHistory((h) => [...h, histEntry]);
        }
        setCurrentMoveIndex((i) => i + 1);
        setFen(g.fen());
        setGame(g);
        if (!isAnalysisMode) setActiveTimer(g.turn() === "w" ? "white" : "black");
        return true;
      } catch {
        return false;
      }
    }
    // --- mode jeu normal ---
    try {
      const mv = game.move({ from, to, promotion: "q" });
      if (!mv) return false;
      setFen(game.fen());
      setMoveHistory((h) => [...h, { fen: game.fen(), move: `${mv.from}-${mv.to}`, san: mv.san }]);
      setCurrentMoveIndex((i) => i + 1);
      setActiveTimer(game.turn() === "w" ? "white" : "black");
      if (game.isGameOver()) {
        clearInterval(timerRef.current);
        let msg = "";
        if (game.isCheckmate()) msg = `Échec et mat! ${game.turn() === "w" ? "Les noirs" : "Les blancs"} gagnent.`;
        else if (game.isDraw()) msg = "Partie nulle!";
        if (msg) {
          setTimeout(() => alert(msg), 100);
          setChatMessages((c) => [...c, { sender: "Système", message: msg, timestamp: new Date() }]);
        }
      }
      return true;
    } catch {
      return false;
    }
  };

  /* ---------- Navigation Helpers ---------- */
  const goToMove = (i) => {
    if (i >= -1 && i < moveHistory.length) {
      setCurrentMoveIndex(i);
      setFen(i === -1 ? initialFen : moveHistory[i].fen);
    }
  };
  const goToPreviousMove = () => goToMove(currentMoveIndex - 1);
  const goToNextMove = () => goToMove(currentMoveIndex + 1);
  const goToStart = () => goToMove(-1);
  const goToEnd = () => goToMove(moveHistory.length - 1);

  /* ---------- Chat & Settings ---------- */
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages((c) => [...c, { sender: "Vous", message: newMessage, timestamp: new Date() }]);
    setNewMessage("");
  };

  const startNewGame = () => {
    const g = new Chess();
    setGame(g);
    setFen(g.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setWhiteTime(timeControlSetting * 60);
    setBlackTime(timeControlSetting * 60);
    setActiveTimer("white");
    setChatMessages([{ sender: "Système", message: "Nouvelle partie démarrée!", timestamp: new Date() }]);
  };

  const exportPGN = () => {
    const pgn = game.pgn();
    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `partie-echecs-${new Date().toISOString().slice(0, 10)}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importPGN = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const pgn = target.result;
        const g = new Chess();
        g.loadPgn(pgn);
        setGame(g);
        setFen(g.fen());
        const hist = g.history({ verbose: true });
        const newHist = [];
        let tmp = new Chess();
        for (const mv of hist) {
          tmp.move(mv);
          newHist.push({ fen: tmp.fen(), move: `${mv.from}-${mv.to}`, san: mv.san });
        }
        setMoveHistory(newHist);
        setCurrentMoveIndex(newHist.length - 1);
        setChatMessages((c) => [...c, { sender: "Système", message: "Partie importée avec succès!", timestamp: new Date() }]);
      } catch (err) {
        alert("Erreur lors de l'importation du PGN: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  /* ---------- JSX ---------- */
  return (
    <div className={`chess-game-container ${fullScreen ? "fixed inset-0 z-50 bg-gray-100 p-4" : ""}`}>
      {/* Wrapper */}
      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Partie d'échecs</h2>
            <p className="text-sm text-gray-500">
              {isAnalysisMode ? "Mode analyse" : "Mode jeu"} – {game.isGameOver() ? "Partie terminée" : "En cours"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 border rounded hover:bg-gray-50"
              onClick={() => setFullScreen(!fullScreen)}
              title="Plein écran"
            >
              {fullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
            {onClose && (
              <button className="p-2 border rounded hover:bg-gray-50" onClick={onClose} title="Fermer">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
          {/* Left panel */}
          <div className="p-4 flex flex-col bg-gray-50">
            {/* Timers & controls */}
            <div className="mb-6 space-y-4">
              {/* Timer header */}
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium">
                  <Clock className="h-5 w-5" /> Contrôle du temps
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-2 border rounded hover:bg-gray-100"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    className="p-2 border rounded hover:bg-gray-100"
                    onClick={() => setIsAnalysisMode(!isAnalysisMode)}
                  >
                    {isAnalysisMode ? "Mode jeu" : "Analyser"}
                  </button>
                </div>
              </div>

              {/* Clocks */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div
                  className={`py-3 rounded-lg text-white ${activeTimer === "black" ? "bg-black" : "bg-gray-700"}`}
                >
                  <div className="text-xs mb-1">Noirs</div>
                  <div className="text-xl font-mono">{formatTime(blackTime)}</div>
                </div>
                <div
                  className={`py-3 rounded-lg ${activeTimer === "white" ? "bg-white border" : "bg-gray-200"}`}
                >
                  <div className="text-xs mb-1">Blancs</div>
                  <div className="text-xl font-mono">{formatTime(whiteTime)}</div>
                </div>
              </div>
            </div>

            {/* Move history */}
            <div className="mb-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Historique des coups</span>
                <div className="flex gap-1">
                  <button onClick={goToStart} disabled={currentMoveIndex === -1} className="p-1 border rounded">
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button onClick={goToPreviousMove} disabled={currentMoveIndex === -1} className="p-1 border rounded">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button onClick={goToNextMove} disabled={currentMoveIndex === moveHistory.length - 1} className="p-1 border rounded">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button onClick={goToEnd} disabled={currentMoveIndex === moveHistory.length - 1} className="p-1 border rounded">
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="h-64 overflow-y-auto border rounded">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      <th className="text-left p-1 font-medium w-10">#</th>
                      <th className="text-left p-1 font-medium">Blancs</th>
                      <th className="text-left p-1 font-medium">Noirs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        <td className="p-1">{i + 1}.</td>
                        <td
                          className={`p-1 cursor-pointer ${currentMoveIndex === i * 2 ? "bg-blue-100 rounded" : ""}`}
                          onClick={() => goToMove(i * 2)}
                        >
                          {moveHistory[i * 2]?.san || ""}
                        </td>
                        <td
                          className={`p-1 cursor-pointer ${currentMoveIndex === i * 2 + 1 ? "bg-blue-100 rounded" : ""}`}
                          onClick={() => goToMove(i * 2 + 1)}
                        >
                          {moveHistory[i * 2 + 1]?.san || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button onClick={startNewGame} className="w-full py-2 px-3 border rounded hover:bg-gray-100 text-sm">
                Nouvelle partie
              </button>
              <button
                onClick={() => setOrientation(orientation === "white" ? "black" : "white")}
                className="w-full py-2 px-3 border rounded hover:bg-gray-100 flex items-center justify-center gap-2 text-sm"
              >
                <RotateCw className="h-4 w-4" /> Retourner
              </button>
              <button
                onClick={exportPGN}
                className="w-full py-2 px-3 border rounded hover:bg-gray-100 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="h-4 w-4" /> Exporter PGN
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full py-2 px-3 border rounded hover:bg-gray-100 flex items-center justify-center gap-2 text-sm"
              >
                <Upload className="h-4 w-4" /> Importer PGN
              </button>
              <input ref={fileInputRef} type="file" accept=".pgn" onChange={importPGN} className="hidden" />
            </div>
          </div>

          {/* Board */}
          <div ref={boardContainerRef} className="p-4 flex items-center justify-center lg:col-span-2">
            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={orientation}
              boardWidth={boardWidth}
              areArrowsAllowed={true}
              customBoardStyle={{ borderRadius: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center text-sm">
          <div className="flex gap-2">
            <button
              className="py-2 px-3 border rounded flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" /> Chat
            </button>
            <button
              className="py-2 px-3 border rounded flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" /> Paramètres
            </button>
          </div>
          <span className="text-gray-500">
            {game.isGameOver()
              ? `Partie terminée – ${game.isCheckmate() ? `Échec et mat! ${game.turn() === "w" ? "Les noirs" : "Les blancs"} gagnent.` : "Partie nulle"}`
              : `Au tour des ${game.turn() === "w" ? "blancs" : "noirs"}`}
          </span>
        </div>
      </div>

      {/* Chat modal */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border shadow-lg rounded-lg flex flex-col z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Chat</h3>
            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === "Vous" ? "items-end" : "items-start"}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.sender === "Vous"
                      ? "bg-blue-100 text-blue-900"
                      : msg.sender === "Système"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-200 text-gray-900"
                    }`}
                >
                  <div className="text-[10px] font-semibold opacity-70 mb-1">{msg.sender}</div>
                  <div>{msg.message}</div>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Tapez un message..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button onClick={sendMessage} className="px-3 py-1 border rounded hover:bg-gray-100 text-sm">
              Envoyer
            </button>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed bottom-4 left-4 w-80 bg-white border shadow-lg rounded-lg flex flex-col z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Paramètres</h3>
            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-4 text-sm">
            {/* Time control */}
            <div className="space-y-1">
              <label htmlFor="time-control" className="font-medium block">
                Contrôle du temps (minutes)
              </label>
              <select
                id="time-control"
                value={timeControlSetting}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setTimeControl(v);
                  setWhiteTime(v * 60);
                  setBlackTime(v * 60);
                }}
                className="w-full border rounded px-2 py-1"
              >
                {[1, 3, 5, 10, 15, 30, 60].map((min) => (
                  <option key={min} value={min}>
                    {min} min {min === 1 ? "(Bullet)" : min <= 5 ? "(Blitz)" : min <= 15 ? "(Rapide)" : "(Classique)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="sound-toggle">Sons</label>
              <input type="checkbox" id="sound-toggle" defaultChecked className="h-4 w-4" />
            </div>

            {/* Hints toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="hints-toggle">Afficher les coups possibles</label>
              <input type="checkbox" id="hints-toggle" defaultChecked className="h-4 w-4" />
            </div>

            {/* Coordinates toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="coords-toggle">Afficher les coordonnées</label>
              <input type="checkbox" id="coords-toggle" defaultChecked className="h-4 w-4" />
            </div>

            <button onClick={() => setShowSettings(false)} className="w-full py-2 px-3 border rounded hover:bg-gray-100">
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;