import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Zap, Copy, Check, Users, Crown, UserPlus, Play } from "lucide-react";
import { styles } from "../styles";

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL_DEV);

export default function WaitingRoom() {
  const navigate = useNavigate();

  const { code, id } = useParams();
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayername] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState([]);
  const [justJoinedPlayer, setJustJoinedPlayer] = useState();

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!justJoinedPlayer) return;

    setShowMessage(true);

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, [justJoinedPlayer]);

  useEffect(() => {
    socket.emit("joinRoom", { id, playerName });

    socket.on("updatePlayers", (waitingRoomData) => {
      setPlayers(waitingRoomData?.playersInRoom);
      setJustJoinedPlayer(waitingRoomData?.latestPlayer);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, [id, playerName]);

  //Loading room data from storage
  useEffect(() => {
    if (code) {
      setRoomCode(code);
      const roomData = localStorage.getItem(`room:${code}`);
      if (roomData) {
        try {
          const room = JSON.parse(roomData);

          setPlayername(room.playerName || "");
          setRoomName(room.roomName || "");
          setTopic(room.topic || "");
          setNumQuestions(room.numQuestions || 10);
          setPlayers(room.players || []);
        } catch (error) {
          console.error("Failed to parse room data:", error);
        }
      }
    }
  }, [code]);

  //When any user in the room starts quiz, everyone will be moved to the next page
  useEffect(() => {
    socket.on("quizStarted", ({ questions, topic, roomCode, id }) => {
      console.log(roomCode, id);
      //Navigate to quiz page for all players
      navigate(`/quiz-game/${roomCode}`, {
        state: { questions, topic, roomName, numQuestions, id },
      });
    });

    return () => {
      socket.off("quizStarted");
    };
  }, []);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartQuiz = () => {
    const roomId = id;

    socket.emit("startQuiz", {
      roomId,
      roomCode,
      topic,
      numQuestions,
    });
  };

  const handleLeaveRoom = () => {
    window.history.back();
  };

  return (
    <div
      className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <span className={`text-2xl font-bold ${styles.text.gradient}`}>
                MindWars
              </span>
            </div>
            <button
              onClick={handleLeaveRoom}
              className={styles.button.secondary.replace(
                "px-6 py-3",
                "px-4 py-2"
              )}>
              Leave Room
            </button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30 mb-6">
                <Check className="w-4 h-4 text-green-300" />
                <span className="text-sm text-green-200">
                  Room Created Successfully!
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                Your Room is <span className={styles.text.gradient}>Ready</span>
              </h1>
              <p className={styles.text.muted}>
                Share the room code with your friends to start the quiz battle!
              </p>
            </div>
            {showMessage && justJoinedPlayer && (
              <div className="fixed bottom-6 right-6 z-50 animate-toast-slide">
                <div
                  className="relative px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md 
                    border border-white/20 shadow-xl text-white">
                  <div className="absolute inset-0 bg-purple-500/20 blur-2xl -z-10" />
                  <p className="font-semibold tracking-wide">
                    {justJoinedPlayer} joined the room!
                  </p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <div className={`${styles.card.base} text-center`}>
                  <div className="text-sm text-slate-400 mb-3">Room Code</div>
                  <div className="text-5xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    {roomCode}
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className={`${styles.card.base} space-y-4`}>
                  <h3 className="font-semibold text-lg mb-4">Room Details</h3>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      Player Name
                    </div>
                    <div className="font-semibold">{playerName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Room Name</div>
                    <div className="font-semibold">{roomName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Topic</div>
                    <div className="font-semibold">{topic}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Questions</div>
                    <div className="font-semibold">{numQuestions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Players</div>
                    <div className="font-semibold">{players.length} / 8</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className={styles.card.base}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Users className="w-6 h-6 text-purple-400" />
                      Players in Lobby
                    </h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-purple-200">
                        {players.length} Online
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                          {player.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {player.name}
                            {player.isHost && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            {player.isHost ? "Host" : "Player"}
                          </div>
                        </div>
                      </div>
                    ))}

                    {[...Array(Math.max(0, 8 - players.length))].map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 border-dashed flex items-center gap-4 opacity-50">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-500">
                            Waiting...
                          </div>
                          <div className="text-xs text-slate-600">
                            Empty slot
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {players.length < 2 && (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                      <p className="text-sm text-cyan-300">
                        Waiting for at least one more player to join...
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleStartQuiz}
                      disabled={players.length < 2}
                      className={`flex-1 ${styles.button.primary} flex items-center justify-center gap-2`}>
                      <Play className="w-5 h-5" />
                      Start Quiz
                    </button>
                    <button
                      onClick={handleLeaveRoom}
                      className={`sm:flex-none ${styles.button.secondary}`}>
                      Cancel
                    </button>
                  </div>

                  {players.length < 2 && (
                    <p className="text-xs text-center text-slate-500 mt-3">
                      Need at least 2 players to start the quiz
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
