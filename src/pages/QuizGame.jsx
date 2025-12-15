import React, { useState, useEffect, useRef } from "react";
import { Zap, Clock, Users, Trophy, CheckCircle, XCircle } from "lucide-react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { quizGameStyles as styles } from "../styles";
import { updatePlayerBattlesWon, updateTotalScore } from "../apis/playerApis";
import { addPlayerTopic } from "../apis/playerTopicApis";

const socket = io(import.meta.env.VITE_SOCKET_URL_PROD);

export default function QuizGame() {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { id, roomData, topic: topicName } = location?.state || {};

  const hasProcessedScoreRef = useRef(false);

  const [roomCode, setRoomCode] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [playersList, setPlayersList] = useState([]);
  const [playerName, setPlayerName] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [finalScore, setFinalScore] = useState([]);
  const [finalScoreloader, setFinalScoreLoader] = useState(false);

  const [justLeftPlayer, setJustLeftPlayer] = useState();
  const [showMessageForPlayerLeft, setShowMessageForPlayerLeft] =
    useState(false);

  const [playerTopicAdded, setPlayerTopicAdded] = useState(false);

  const [hasProcessedFinalScore, setHasProcessedFinalScore] = useState(false);

  //User and roomData is coming via navigate state
  useEffect(() => {
    if (code) {
      if (roomData) {
        try {
          setPlayerName(roomData?.playerName || "");
          setPlayersList(roomData.players || []);
        } catch (error) {
          console.error("Failed to parse room data:", error);
        }
      }
    }
  }, [code]);

  //If all other players leave, end the quiz
  useEffect(() => {
    if (playersList?.length === 1 && !quizEnded) {
      const confirmEnd = window.confirm(
        "You're the last player remaining. The quiz will end. Continue?"
      );

      if (confirmEnd) {
        setQuizEnded(true);
      }
    }
  }, [playersList, quizEnded]);

  useEffect(() => {
    const handleNewQuestion = ({ question, questionIndex, totalQuestions }) => {
      setCurrentQuestion(question);
      setCurrentQuestionIndex(questionIndex - 1);
      setTotalQuestions(totalQuestions);
      setSelectedAnswer(null);
      setTimeLeft(10);
      setAnswered(false);
      setShowCorrectAnswer(false);
      setShowCelebration(false);
      setShowWrongEffect(false);
    };

    const handleQuizStarted = ({ questions, topic, roomCode, id }) => {
      setQuestions(questions);
      setTopic(topic);
      setRoomCode(roomCode);
      setTotalQuestions(questions.length);
    };

    const handleQuizEnded = () => {
      setQuizEnded(true);
    };

    const handleUpdatePlayers = (waitingRoomData) => {
      setPlayersList(waitingRoomData?.playersInRoom || []);
    };

    const handleLeaderboardUpdate = (leaderboardData) => {
      setLeaderboard(leaderboardData || []);
    };

    const handleCorrectAnswer = ({ playerName: correctPlayerName }) => {
      // Add notification for all users
      const notificationId = Date.now();
      setNotifications((prev) => [
        ...prev,
        {
          id: notificationId,
          playerName: correctPlayerName,
          isCurrentPlayer: correctPlayerName === playerName,
        },
      ]);

      // Remove notification after 4 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }, 4000);

      setAnswered(true);
      setShowCorrectAnswer(true);

      if (correctPlayerName === playerName) {
        setShowCelebration(true);
      }

      setTimeout(() => {
        setShowCelebration(false);
        setShowWrongEffect(false);
      }, 3000);
    };

    const handleWrongAnswer = ({ playerName: wrongPlayerName }) => {
      if (wrongPlayerName === playerName) {
        setShowWrongEffect(true);

        setTimeout(() => {
          setShowWrongEffect(false);
        }, 2000);
      }
    };

    const handleFinalScores = (scores) => {
      if (scores) {
        const sortedScores = Object.entries(scores)
          .map(([player, score]) => ({ player, score }))
          .sort((a, b) => b.score - a.score);

        setFinalScore(sortedScores);
      }
      setFinalScoreLoader(false);
    };

    socket.on("newQuestion", handleNewQuestion);
    socket.on("quizStarted", handleQuizStarted);
    socket.on("quizEnded", handleQuizEnded);
    socket.on("updatePlayers", handleUpdatePlayers);
    socket.on("leaderboardUpdate", handleLeaderboardUpdate);
    socket.on("correctAnswer", handleCorrectAnswer);
    socket.on("wrongAnswer", handleWrongAnswer);
    socket.on("finalScores", handleFinalScores);

    return () => {
      socket.off("newQuestion", handleNewQuestion);
      socket.off("quizStarted", handleQuizStarted);
      socket.off("quizEnded", handleQuizEnded);
      socket.off("updatePlayers", handleUpdatePlayers);
      socket.off("leaderboardUpdate", handleLeaderboardUpdate);
      socket.off("correctAnswer", handleCorrectAnswer);
      socket.off("wrongAnswer", handleWrongAnswer);
    };
  }, []);

  useEffect(() => {
    //Quiz will not start if either of the two is missing
    if (!id || !playerName) {
      return;
    }

    socket.emit("joinRoom", { id, playerName });

    const handleRoomJoined = ({ roomId }) => {
      console.log("Successfully joined room:", roomId);
    };

    socket.on("roomJoined", handleRoomJoined);

    return () => {
      socket.off("roomJoined", handleRoomJoined);
    };
  }, [id, playerName]);

  useEffect(() => {
    if (quizEnded || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizEnded, answered, currentQuestion]);

  useEffect(() => {
    if (quizEnded) {
      setFinalScoreLoader(true);
      socket.emit("submitPlayerScore", {
        roomId: id,
        playerName,
        score,
      });

      try {
        const storedPlayer = localStorage.getItem("player");
        const parsedStoredPlayer = JSON.parse(storedPlayer);

        const playerData = {
          newScore: score,
          email: parsedStoredPlayer.email,
        };

        const updatedTotalScore = updateTotalScore(playerData);
      } catch (error) {}
    }
  }, [quizEnded]);

  useEffect(() => {
    if (
      hasProcessedScoreRef.current ||
      !finalScore ||
      finalScore.length === 0
    ) {
      console.log("Skipping - already processed or no scores");
      return;
    }

    const checkTopPlayer = async () => {
      if (hasProcessedScoreRef.current) {
        return;
      }
      hasProcessedScoreRef.current = true;

      try {
        const topPlayer = finalScore.reduce(
          (max, current) => (current.score > max.score ? current : max),
          finalScore[0]
        );

        const storedPlayer = localStorage.getItem("player");

        // Only proceed if user is logged in
        if (!storedPlayer) {
          console.log("No score update for guest player");
          return;
        }

        const parsedStoredPlayer = JSON.parse(storedPlayer);

        let battleWon = false;
        if (topPlayer.player === playerName) {
          battleWon = true;
          console.log("🏆 You won! Updating battles won...");
          const updatedTotalBattlesWon = await updatePlayerBattlesWon({
            email: parsedStoredPlayer?.email,
          });
        }

        // Add topic to player

        const playerTopicData = {
          email: parsedStoredPlayer?.email,
          topicName: topicName,
          score,
          battleWon,
        };

        const addedPlayerTopic = await addPlayerTopic(playerTopicData);
        console.log("Player topic added:", addedPlayerTopic);
      } catch (error) {
        console.error("Error processing final scores:", error);
      }
    };

    checkTopPlayer();
  }, [finalScore, playerName, topicName, score]);

  useEffect(() => {
    socket.on("playerLeft", ({ roomId, email, playerName }) => {
      setJustLeftPlayer(playerName);
    });

    return () => {
      socket.off("playerLeft");
    };
  }, []);

  useEffect(() => {
    // Handle browser back / forward navigation
    const handlePopState = (e) => {
      e.preventDefault();
      const confirmLeave = window.confirm("You are about to leave the quiz!");
      if (confirmLeave) {
        navigate("/");
      } else {
        // Prevent going back by pushing state again
        history.pushState(null, null, location.href);
      }
    };

    // Handle tab close or reload
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You are about to leave the quiz!";
    };

    history.pushState(null, null, location.href);

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  useEffect(() => {
    if (!justLeftPlayer) return;

    setShowMessageForPlayerLeft(true);

    const timer = setTimeout(() => {
      setShowMessageForPlayerLeft(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [justLeftPlayer]);

  const handleTimeout = () => {
    setAnswered(true);
    setShowCorrectAnswer(true);
  };

  const handleAnswerSelect = (optionText) => {
    if (answered || !currentQuestion) return;

    setSelectedAnswer(optionText);
    setAnswered(true);
    setShowCorrectAnswer(true);

    const isCorrect = optionText === currentQuestion.answer;
    if (isCorrect) {
      setShowCelebration(true);
      const points = Math.round(100 + timeLeft * 3);
      setScore((prev) => prev + points);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setShowWrongEffect(true);
      setTimeout(() => {
        setShowWrongEffect(false);
      }, 2000);
    }

    socket.emit("answerQuestion", {
      roomId: id,
      playerName,
      selectedOption: optionText,
    });
  };

  const getButtonStyle = (optionText) => {
    if (!showCorrectAnswer) {
      return selectedAnswer === optionText
        ? `${styles.button.answer} ${styles.button.answerSelected}`
        : styles.button.answer;
    }

    if (optionText === currentQuestion?.answer) {
      return `${styles.button.answer} ${styles.button.answerCorrect}`;
    }
    if (
      selectedAnswer === optionText &&
      optionText !== currentQuestion?.answer
    ) {
      return `${styles.button.answer} ${styles.button.answerWrong}`;
    }
    return styles.button.answer;
  };

  const getTimerColor = () => {
    if (timeLeft > 7) return "text-green-400";
    if (timeLeft > 3) return "text-yellow-400";
    return "text-red-400";
  };

  if (!currentQuestion && !quizEnded) {
    return (
      <div
        className={`min-h-screen ${styles.bg.primary} text-white flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-400">Waiting for quiz to start...</p>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div
        className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">
              Quiz <span className={styles.text.gradient}>Complete!</span>
            </h1>
            <p className={styles.text.muted}>
              Great job! Here are your results:
            </p>

            <div className={`${styles.card.base} mt-12`}>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {score}
              </div>
              <div className="text-slate-400 mb-6">Total Points</div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {correctAnswersCount}
                  </div>
                  <div className="text-xs text-slate-500">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {totalQuestions - correctAnswersCount}
                  </div>
                  <div className="text-xs text-slate-500">Wrong</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {totalQuestions > 0
                      ? Math.round((correctAnswersCount / totalQuestions) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-slate-500">Accuracy</div>
                </div>
              </div>
              {/* Leaderboard for final results of all the players*/}
              {leaderboard.length > 0 && (
                <div className="container mx-auto px-6 pb-3">
                  <div className={` p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-md tracking-wide font-semibold">
                        Leaderboard
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {finalScoreloader ? (
                        <div
                          className={`w-full ${styles.button.primary} flex items-center justify-center gap-2 mt-6`}>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        finalScore?.map((player, index) => {
                          if (!player.player) return;
                          const isCurrentPlayer = player.player === playerName;
                          const medalEmoji =
                            index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";

                          return (
                            <div
                              key={player.id || index}
                              className={`flex items-center justify-between p-2 rounded-lg transition-all mb-2 ${
                                isCurrentPlayer
                                  ? "bg-purple-500/30 border border-purple-500/50"
                                  : "bg-white/5 hover:bg-white/10"
                              }`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {medalEmoji}

                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <span
                                    className={`text-sm font-medium truncate ${
                                      isCurrentPlayer ? "text-purple-200" : ""
                                    }`}>
                                    {player?.player}
                                  </span>
                                  {isCurrentPlayer && (
                                    <span className="text-xs px-1.5 py-0.5 bg-purple-500/50 rounded-full flex-shrink-0">
                                      You
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div
                                  className={`text-sm font-bold ${
                                    index === 0
                                      ? "text-yellow-400"
                                      : index === 1
                                      ? "text-gray-300"
                                      : "text-orange-400"
                                  }`}>
                                  {player?.score || 0}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* {leaderboard.length > 3 && (
                        <div className="text-center text-xs text-slate-400 py-1">
                          {leaderboard.length - 3} more player
                          {leaderboard.length - 3 !== 1 ? "s" : ""}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => (window.location.href = "/")}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Celebration Effect */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  background: [
                    "#A855F7",
                    "#EC4899",
                    "#06B6D4",
                    "#F59E0B",
                    "#10B981",
                  ][i % 5],
                  top: "50%",
                  left: "50%",
                  animation: `celebration-${i} 1.5s ease-out`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
            <div className="relative">
              <div className="text-9xl animate-bounce">🎉</div>
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
            <div className="absolute top-1/4 left-1/4 text-6xl animate-spin">
              ⭐
            </div>
            <div
              className="absolute top-1/4 right-1/4 text-6xl animate-spin"
              style={{ animationDirection: "reverse" }}>
              ✨
            </div>
          </div>
        )}

        {/* Wrong Answer Effect */}
        {showWrongEffect && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div
              className="absolute inset-0 bg-red-500/20 animate-pulse"
              style={{ animation: "shake 0.5s ease-in-out" }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-9xl animate-bounce">😢</div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          ${[...Array(20)]
            .map(
              (_, i) => `
            @keyframes celebration-${i} {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(${
                Math.cos((i * 18 * Math.PI) / 180) * 300
              }px, ${
                Math.sin((i * 18 * Math.PI) / 180) * 300
              }px) scale(0); opacity: 0; }
            }
          `
            )
            .join("")}
        `}</style>

        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <span className={`text-2xl font-bold ${styles.text.gradient}`}>
                MindWars
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Your Score</div>
                <div className="text-2xl font-bold text-purple-400">
                  {score}
                </div>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
            </div>
          </div>
        </header>

        {/* Notification for the correct answer */}
        <div className="fixed top-20 right-6 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
                notification.isCurrentPlayer
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-blue-500/20 border border-blue-500/50"
              }`}
              style={{
                animation: "slideIn 0.3s ease-out",
              }}>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {notification.isCurrentPlayer
                    ? "You"
                    : notification.playerName}{" "}
                  answered correctly!
                </div>
                <div className="text-xs text-slate-300">
                  {notification.isCurrentPlayer
                    ? "Great job! 🎉"
                    : "Moving to next question..."}
                </div>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>

        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-400">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </div>
                <div
                  className={`flex items-center gap-2 text-2xl font-bold ${getTimerColor()}`}>
                  <Clock className="w-6 h-6" />
                  {timeLeft}s
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / totalQuestions) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
            {showMessageForPlayerLeft && justLeftPlayer && (
              <div className="fixed bottom-6 right-6 z-50 animate-toast-slide">
                <div
                  className="relative px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md 
                    border border-white/20 shadow-xl text-white w-72">
                  <div className="absolute inset-0 bg-purple-500/20 blur-2xl -z-10" />
                  <p className="font-semibold tracking-wide">
                    {justLeftPlayer} left the room!
                  </p>
                </div>
              </div>
            )}

            <div className={`${styles.card.base} `}>
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
                  <span className="text-sm text-purple-200">{topic}</span>
                </div>
                <h2 className="text-3xl font-bold leading-relaxed">
                  {currentQuestion?.question}
                </h2>
              </div>

              {/* {showCorrectAnswer && selectedAnswer === null && (
                <div
                  className={`mt-6 mb-6 p-4 rounded-xl ${"bg-yellow-500/10 border border-yellow-500/30"}`}>
                  <div className="font-semibold mb-1">{"⏰ Time's up!"}</div>
                  <div className="text-sm text-slate-300">
                    {`The correct answer was: ${currentQuestion?.answer}`}
                  </div>
                </div>
              )} */}

              <div className="space-y-4">
                {currentQuestion?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={answered}
                    className={`${getButtonStyle(option)} ${
                      answered ? "cursor-not-allowed" : "cursor-pointer"
                    } group`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                      {showCorrectAnswer && (
                        <div>
                          {option === currentQuestion?.answer && (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          )}
                          {selectedAnswer === option &&
                            option !== currentQuestion?.answer && (
                              <XCircle className="w-6 h-6 text-red-400" />
                            )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.card.base} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  Live Players ({playersList.length})
                </div>
                <div className="flex gap-2 flex-wrap">
                  {playersList.slice(0, 5).map((player, idx) => (
                    <div
                      key={player.id || idx}
                      className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg">
                      <span>👤</span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                  ))}
                  {playersList.length > 5 && (
                    <div className="flex items-center px-3 py-1 bg-white/5 rounded-lg">
                      <span className="text-sm">
                        +{playersList.length - 5} more
                      </span>
                    </div>
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
