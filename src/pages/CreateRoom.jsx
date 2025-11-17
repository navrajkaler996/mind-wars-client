import React, { useState } from 'react';
import { Zap, ArrowLeft, Sparkles, Hash, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

export default function CreateRoom() {


  const navigate = useNavigate()

  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);

  const questionOptions = [5, 10, 15, 20];

  //Generating room code
  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !topic.trim()) return;

    const code = generateRoomCode();
    const room = {
      code,
      name: roomName,
      topic,
      numQuestions,
      createdAt: Date.now(),
      host: 'You',
      players: [],
      status: 'waiting',
    };

    //Store room code in storage
    try {
      localStorage.setItem(`room:${code}`, JSON.stringify(room));
      
      navigate(`/waiting-room/${code}`)
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  const handleBack = () => {


  };

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
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-200">Create Your Quiz Room</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                Setup Your <span className={styles.text.gradient}>Battle Arena</span>
              </h1>
              <p className={styles.text.muted}>
                Choose your topic and settings. Your friends will join using a unique room code.
              </p>
            </div>


            <div className={`${styles.card.base} space-y-6`}>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Users className="w-4 h-4 text-purple-400" />
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g., Epic Friday Quiz"
                  className={styles.input.base}
                  maxLength={30}
                />
              </div>


              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Quiz Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., World History, Science, Movies, Sports..."
                  className={styles.input.base}
                  maxLength={50}
                />
                <p className="text-xs text-slate-500 mt-2">
                  AI will generate questions based on your topic
                </p>
              </div>


              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Hash className="w-4 h-4 text-pink-400" />
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {questionOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`py-3 rounded-lg font-semibold transition-all duration-300 ${
                        numQuestions === num
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                          : 'bg-white/5 border border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={!roomName.trim() || !topic.trim()}
                className={`w-full ${styles.button.primary} mt-6`}
              >
                Create Room
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}