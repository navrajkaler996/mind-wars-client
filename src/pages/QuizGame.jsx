import React, { useState, useEffect } from 'react';
import { Zap, Clock, Users, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { quizGameStyles as styles } from '../styles';


export default function QuizGame() {
  // Data not dynamic yet
  const [roomCode] = useState('A3X9K2');
  const [roomName] = useState('Epic Friday Quiz');
  const [topic] = useState('World History');
  const [numQuestions] = useState(10);
  

  const [players] = useState([
    { id: 1, name: 'You', score: 0, avatar: '👑' },
    { id: 2, name: 'Sarah', score: 0, avatar: '🎮' },
    { id: 3, name: 'Mike', score: 0, avatar: '🚀' },
  ]);

  // Demo questions 
  const [questions] = useState([
    {
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
      correctAnswer: 1
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2
    },
    {
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1
    },
    {
      question: "Which empire built Machu Picchu?",
      options: ["Aztec", "Maya", "Inca", "Olmec"],
      correctAnswer: 2
    },
    {
      question: "What year did the Titanic sink?",
      options: ["1910", "1911", "1912", "1913"],
      correctAnswer: 2
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Timer 
  useEffect(() => {
    if (quizEnded || answered) return;

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
  }, [currentQuestionIndex, quizEnded, answered]);

  const handleTimeout = () => {
    setAnswered(true);
    setShowCorrectAnswer(true);
    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (index) => {
    if (answered) return;
  
    setSelectedAnswer(index);
    setAnswered(true);
    setShowCorrectAnswer(true);
  
    // Check if correct
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) {
      // Show celebration animation
      setShowCelebration(true);
      
      // Points based on time left (faster = more points)
      const points = Math.round(100 + (timeLeft * 3));
      setScore(prev => prev + points);
    } else {
      // Show wrong answer effect
      setShowWrongEffect(true);
    }
  
    // Move to next question after 3 seconds
    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(10);
      setAnswered(false);
      setShowCorrectAnswer(false);
      setShowCelebration(false);
      setShowWrongEffect(false);  // Add this line
    } else {
      // Quiz ended
      setQuizEnded(true);
    }
  };

  const getButtonStyle = (index) => {
    if (!showCorrectAnswer) {
      return selectedAnswer === index 
        ? `${styles.button.answer} ${styles.button.answerSelected}`
        : styles.button.answer;
    }

    // Show correct/wrong answers
    if (index === currentQuestion.correctAnswer) {
      return `${styles.button.answer} ${styles.button.answerCorrect}`;
    }
    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return `${styles.button.answer} ${styles.button.answerWrong}`;
    }
    return styles.button.answer;
  };

  const getTimerColor = () => {
    if (timeLeft > 7) return 'text-green-400';
    if (timeLeft > 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (quizEnded) {
    return (
      <div className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>

     
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">
              Quiz <span className={styles.text.gradient}>Complete!</span>
            </h1>
            <p className={styles.text.muted}>Great job! Here are your results:</p>

            <div className={`${styles.card.base} mt-12`}>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {score}
              </div>
              <div className="text-slate-400 mb-6">Total Points</div>
              
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {questions.filter((q, i) => selectedAnswer === q.correctAnswer).length}
                  </div>
                  <div className="text-xs text-slate-500">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {questions.length - questions.filter((q, i) => selectedAnswer === q.correctAnswer).length}
                  </div>
                  <div className="text-xs text-slate-500">Wrong</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {Math.round((questions.filter((q, i) => selectedAnswer === q.correctAnswer).length / questions.length) * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">Accuracy</div>
                </div>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>
   
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>


      <div className="relative z-10">
        {/* Celebration Effect */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {/* Confetti-like elements */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  background: ['#A855F7', '#EC4899', '#06B6D4', '#F59E0B', '#10B981'][i % 5],
                  top: '50%',
                  left: '50%',
                  animation: `celebration-${i} 1.5s ease-out`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
            
            {/* Center burst */}
            <div className="relative">
              <div className="text-9xl animate-bounce">🎉</div>
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
            
            {/* Stars */}
            <div className="absolute top-1/4 left-1/4 text-6xl animate-spin">⭐</div>
            <div className="absolute top-1/4 right-1/4 text-6xl animate-spin" style={{animationDirection: 'reverse'}}>✨</div>
            <div className="absolute bottom-1/4 left-1/3 text-6xl animate-bounce">🌟</div>
            <div className="absolute bottom-1/4 right-1/3 text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>💫</div>
          </div>
        )}

        {/* Wrong Answer Effect */}
{showWrongEffect && (
  <div className="fixed inset-0 pointer-events-none z-50">

    <div 
      className="absolute inset-0 bg-red-500/20 animate-pulse"
      style={{
        animation: 'shake 0.5s ease-in-out'
      }}
    />
    

    <div className="absolute top-1/4 left-1/4 text-8xl text-red-500 animate-ping">❌</div>
    <div className="absolute top-1/4 right-1/4 text-8xl text-red-500 animate-ping" style={{animationDelay: '0.1s'}}>❌</div>
    

    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="text-9xl animate-bounce">😢</div>
    </div>
    

    <div className="absolute bottom-1/4 left-1/3 text-6xl text-red-400 animate-bounce">⬇️</div>
    <div className="absolute bottom-1/4 right-1/3 text-6xl text-red-400 animate-bounce" style={{animationDelay: '0.15s'}}>⬇️</div>
  </div>
)}


<style>{`
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
`}</style>
        

        <style>{`
          ${[...Array(20)].map((_, i) => `
            @keyframes celebration-${i} {
              0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(${Math.cos(i * 18 * Math.PI / 180) * 300}px, ${Math.sin(i * 18 * Math.PI / 180) * 300}px) scale(0);
                opacity: 0;
              }
            }
          `).join('')}
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
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400">Your Score</div>
                <div className="text-2xl font-bold text-purple-400">{score}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className={`flex items-center gap-2 text-2xl font-bold ${getTimerColor()}`}>
                  <Clock className="w-6 h-6" />
                  {timeLeft}s
                </div>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className={`${styles.card.base} mb-8`}>
              <div className="mb-8">
                <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
                  <span className="text-sm text-purple-200">{topic}</span>
                </div>
                <h2 className="text-3xl font-bold leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    className={`${getButtonStyle(index)} ${answered ? 'cursor-not-allowed' : 'cursor-pointer'} group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                      
                      {showCorrectAnswer && (
                        <div>
                          {index === currentQuestion.correctAnswer && (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          )}
                          {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showCorrectAnswer && (
                <div className={`mt-6 p-4 rounded-xl ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-500/10 border border-green-500/30'
                    : selectedAnswer === null
                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <div className="font-semibold mb-1">
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? '🎉 Correct!'
                      : selectedAnswer === null
                      ? '⏰ Time\'s up!'
                      : '❌ Incorrect'}
                  </div>
                  <div className="text-sm text-slate-300">
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? `+${Math.round(100 + (timeLeft * 3))} points! Moving to next question...`
                      : `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                  </div>
                </div>
              )}
            </div>

            <div className={`${styles.card.base} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  Live Players
                </div>
                <div className="flex gap-2">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg">
                      <span>{player.avatar}</span>
                      <span className="text-sm">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}