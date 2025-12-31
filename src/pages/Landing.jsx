import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Sparkles, ArrowRight, Users, Target } from "lucide-react";
import { styles } from "../styles";
import Header from "../others/Header";

export default function Landing() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>

        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`${styles.badge.base} ${styles.badge.purple} mb-8`}>
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm">AI-Powered Real-Time Competition</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Battle Your Friends
              <br />
              <span className={styles.text.gradient}>In Epic Quizzes</span>
            </h1>

            <p
              className={`text-xl ${styles.text.muted} mb-12 max-w-2xl mx-auto`}>
              Create custom quiz rooms on any topic. Challenge friends in
              real-time. Climb the leaderboard and prove you're the ultimate
              quiz champion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                className={`group ${styles.button.primary} text-lg flex items-center justify-center gap-2`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate("/create-room")}>
                <Users className="w-5 h-5" />
                Create Room
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => navigate(`/join-room`)}
                className={`${styles.button.secondary} text-lg`}>
                Join Room
              </button>
            </div>

            {/* Practice Alone Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"></div>
              <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold">Practice Alone</h2>
                </div>
                <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                  Sharpen your skills in solo mode. No pressure, just you vs the
                  questions. Perfect for learning and improvement.
                </p>
                <button
                  onClick={() =>
                    navigate("/create-room", {
                      state: { practiceAlone: true },
                    })
                  }
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
                  <Target className="w-5 h-5" />
                  Start Practice
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-6 py-8 mt-20 border-t border-white/10">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${styles.text.muted}`}></div>
        </footer>
      </div>
    </div>
  );
}
