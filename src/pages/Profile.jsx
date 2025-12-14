import React, { useState, useEffect } from "react";
import {
  Zap,
  ArrowLeft,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Star,
  Flame,
  Crown,
  ShieldCheck,
  Puzzle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { getPlayer } from "../apis/playerApis";

export default function Profile() {
  const navigate = useNavigate();

  // Mock data for now
  const [playerData, setPlayerData] = useState({
    name: "",
    email: "",
    totalScore: 0,
    totalBattlesWon: 0,
    totalBattles: 0,
    winRate: 0,
    currentStreak: 0,
    bestTopics: [
      { topic: "World History", score: 2850, accuracy: 92, battles: 12 },
      { topic: "Science & Technology", score: 2640, accuracy: 88, battles: 15 },
      {
        topic: "Movies & Entertainment",
        score: 2120,
        accuracy: 85,
        battles: 10,
      },
      { topic: "Sports", score: 1890, accuracy: 81, battles: 9 },
      { topic: "Geography", score: 1650, accuracy: 78, battles: 8 },
    ],
  });

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");

    if (storedPlayer) {
      const parsedStoredPlayer = JSON.parse(storedPlayer);

      setPlayerData((prev) => ({
        ...prev,
        name: parsedStoredPlayer.name,
        email: parsedStoredPlayer.email,
        totalScore: parsedStoredPlayer.totalScore,
        totalBattles: parsedStoredPlayer.totalBattles,
        totalBattlesWon: parsedStoredPlayer.totalBattlesWon,
      }));
    }
  }, []);

  useEffect(() => {
    if (!playerData?.email) return; // don't call API if no email

    const fetchPlayer = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPlayer(playerData?.email);
        setPlayer(data.player || data); // adjust if API returns {player: {...}}
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerData]);

  const handleBack = () => {
    navigate("/");
  };

  console.log(player, error);

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
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-2">
                <span className={styles.text.gradient}>{playerData.name}</span>
              </h1>
              <p className="text-slate-400">{playerData.email}</p>
            </div>

            {loading ? (
              <div className="w- flex justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                      <Trophy className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                      <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                        <Flame className="w-6 h-6 text-purple-300" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {player?.totalScore.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      Total Score
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                      <Award className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <div className="w-12 h-12 bg-cyan-500/30 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-cyan-300" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {player?.totalBattlesWon}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      Battles Won
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                      <ShieldCheck className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                      <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                        <Puzzle className="w-6 h-6 text-purple-300" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {playerData.totalBattles}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      Total Battles
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                      <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-300" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                      {playerData.winRate}%
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      Win Rate
                    </div>
                  </div>
                </div>

                <div className={`${styles.card.base} p-8`}>
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-3xl font-bold">Best Topics</h2>
                  </div>
                  <div className="space-y-4">
                    {playerData.bestTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                index === 0
                                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                                  : index === 1
                                  ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800"
                                  : index === 2
                                  ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                  : "bg-white/10 text-slate-400"
                              }`}>
                              #{index + 1}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold group-hover:text-purple-300 transition-colors">
                                {topic.topic}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {topic.battles} battles played
                              </p>
                            </div>
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {topic.score.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-slate-400">Accuracy</span>
                              <span className="font-semibold text-cyan-400">
                                {topic.accuracy}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                                style={{ width: `${topic.accuracy}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
