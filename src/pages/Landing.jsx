import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, ArrowRight } from 'lucide-react';
import { styles } from '../styles';

export default function Landing() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${styles.bg.primary} text-white overflow-hidden relative`}>

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

            <button className={`px-6 py-2 ${styles.bg.glass} rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20`}>

              About

            </button>

          </div>

        </header>

        <main className="container mx-auto px-6 py-20">

          <div className="max-w-4xl mx-auto text-center">

            <div className={`${styles.badge.base} ${styles.badge.purple} mb-8`}>

              <Sparkles className="w-4 h-4 text-purple-300" />

              <span className="text-sm">AI-Powered Real-Time Competition</span>

            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">

              Battle Your Friends

              <br />

              <span className={styles.text.gradient}>

                In Epic Quizzes

              </span>

            </h1>

            <p className={`text-xl ${styles.text.muted} mb-12 max-w-2xl mx-auto`}>

              Create custom quiz rooms on any topic. Challenge friends in real-time. 

              Climb the leaderboard and prove you're the ultimate quiz champion.

            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">

              <button 

                className={`group ${styles.button.primary} text-lg flex items-center justify-center gap-2`}

                onMouseEnter={() => setIsHovered(true)}

                onMouseLeave={() => setIsHovered(false)}

                onClick={() => navigate('/create-room')}

              >

                Create Room

                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />

              </button>

              <button onClick={() => navigate(`/join-room`)} className={`${styles.button.secondary} text-lg`}>

                Join Room

              </button>

            </div>

          </div>

        </main>

        <footer className="container mx-auto px-6 py-8 mt-20 border-t border-white/10">

          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${styles.text.muted}`}>

          </div>

        </footer>

      </div>

    </div>
  );
}

