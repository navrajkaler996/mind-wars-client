import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Clock,
  Trophy,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Home,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { quizGameStyles as styles } from "../styles";

import music from "../../assets/music.mp3";
import correctSound from "../../assets/correct.mp3";
import incorrectSound from "../../assets/incorrect.mp3";
import clock from "../../assets/clock.mp3";

export default function PracticeAloneQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { generatedQuestions } = location?.state || {};

  const audioRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const clockSoundRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    if (generatedQuestions && generatedQuestions.length > 0) {
      setQuestions(generatedQuestions);
      setTotalQuestions(generatedQuestions.length);
      setCurrentQuestion(generatedQuestions[0]);
    } else {
      // Redirect if no questions
      navigate("/");
    }
  }, [generatedQuestions, navigate]);

  useEffect(() => {
    if (quizEnded || !currentQuestion || answered) return;

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
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.loop = true;

      const playMusic = async () => {
        try {
          await audioRef.current.play();
          setIsMusicPlaying(true);
        } catch (error) {
          console.log("Autoplay blocked, waiting for user interaction");
        }
      };

      playMusic();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((error) => {
        console.log("Sound play failed:", error);
      });
    }
  };

  const stopSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (timeLeft <= 3 && timeLeft > 0 && !answered) {
      playSound(clockSoundRef);
    } else {
      stopSound(clockSoundRef);
    }
  }, [timeLeft, answered]);

  const handleTimeout = () => {
    setAnswered(true);
    setShowCorrectAnswer(true);

    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (optionText) => {
    if (answered || !currentQuestion) return;

    setSelectedAnswer(optionText);
    setAnswered(true);
    setShowCorrectAnswer(true);

    const isCorrect = optionText === currentQuestion.answer;
    if (isCorrect) {
      playSound(correctSoundRef);
      setShowCelebration(true);
      const points = Math.round(100 + timeLeft * 5);
      setScore((prev) => prev + points);
      setCorrectAnswersCount((prev) => prev + 1);

      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
    } else {
      playSound(incorrectSoundRef);
      setShowWrongEffect(true);
      setTimeout(() => {
        setShowWrongEffect(false);
      }, 2000);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setQuizEnded(true);
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setSelectedAnswer(null);
      setTimeLeft(15);
      setAnswered(false);
      setShowCorrectAnswer(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setScore(0);
    setQuizEnded(false);
    setAnswered(false);
    setShowCorrectAnswer(false);
    setCorrectAnswersCount(0);
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
    if (timeLeft > 10) return "text-green-400";
    if (timeLeft > 5) return "text-yellow-400";
    return "text-red-400";
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
    }
  };

  if (!currentQuestion && !quizEnded) {
    return (
      <div
        className={`min-h-screen ${styles.bg.primary} text-white flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-400">Loading practice quiz...</p>
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
              Practice <span className={styles.text.gradient}>Complete!</span>
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

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleRestart}
                  className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Practice Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <Home className="w-5 h-5" />
                  Back to Home
                </button>
              </div>
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
        <audio ref={audioRef} src={music} preload="auto" />
        <audio ref={correctSoundRef} src={correctSound} preload="auto" />
        <audio ref={incorrectSoundRef} src={incorrectSound} preload="auto" />
        <audio ref={clockSoundRef} src={clock} preload="auto" />

        {/* Music Control Button */}
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
          title={isMusicPlaying ? "Mute Music" : "Play Music"}>
          {isMusicPlaying ? (
            <Volume2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>

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
                MindWars Practice
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Your Score</div>
                <div className="text-2xl font-bold text-purple-400">
                  {score}
                </div>
              </div>
            </div>
          </div>
        </header>

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

            <div className={`${styles.card.base}`}>
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
                  {/* <span className="text-sm text-purple-200">{topic}</span> */}
                </div>
                <h2 className="text-3xl font-bold leading-relaxed">
                  {currentQuestion?.question}
                </h2>
              </div>

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

              {showCorrectAnswer && (
                <div
                  className={`mt-6 p-4 rounded-xl ${
                    selectedAnswer === currentQuestion?.answer
                      ? "bg-green-500/10 border border-green-500/30"
                      : selectedAnswer === null
                      ? "bg-yellow-500/10 border border-yellow-500/30"
                      : "bg-red-500/10 border border-red-500/30"
                  }`}>
                  <div className="font-semibold mb-1">
                    {selectedAnswer === currentQuestion?.answer
                      ? "🎉 Correct!"
                      : selectedAnswer === null
                      ? "⏰ Time's up!"
                      : "❌ Incorrect"}
                  </div>
                  <div className="text-sm text-slate-300">
                    {selectedAnswer === currentQuestion?.answer
                      ? `+${Math.round(100 + timeLeft * 5)} points!`
                      : `The correct answer was: ${currentQuestion?.answer}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
