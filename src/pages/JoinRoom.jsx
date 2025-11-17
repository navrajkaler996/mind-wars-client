
import React, { useState } from 'react';
import { Zap, ArrowLeft, Sparkles, Hash, User, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles';

export default function JoinRoom() {

    const navigate = useNavigate()

  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoomCodeChange = (e) => {
  
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setRoomCode(value.slice(0, 6));
    setError('');
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (roomCode.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if room exists in storage
      const roomData = localStorage.getItem(`room:${roomCode}`);
      
      if (!roomData) {
        setError('Room not found. Please check the code and try again.');
        setLoading(false);
        return;
      }

      const room = JSON.parse(roomData);

      // Check if room is full
      if (room.players && room.players.length >= 8) {
        setError('This room is full (8/8 players)');
        setLoading(false);
        return;
      }

      // Check if room has started
      if (room.status === 'playing') {
        setError('This quiz has already started');
        setLoading(false);
        return;
      }

      // Add player to room
      const newPlayer = {
        id: Date.now(),
        name: playerName,
        isHost: false,
        avatar: getRandomAvatar(),
        joinedAt: Date.now(),
      };

      room.players = room.players || [];
      room.players.push(newPlayer);

      localStorage.setItem(`room:${roomCode}`, JSON.stringify(room));


      navigate(`/waiting-room/${roomCode}`);
      
    } catch (error) {
      console.error('Failed to join room:', error);
      setError('Failed to join room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRandomAvatar = () => {
    const avatars = ['🎮', '🚀', '⚡', '🎯', '🔥', '⭐', '💎', '🎨', '🎭', '🎪'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const handleBack = () => {
    // In a real app: navigate back to landing page
    window.history.back();
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
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-cyan-200">Join the Battle</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                Enter the <span className={styles.text.gradient}>Arena</span>
              </h1>
              <p className={styles.text.muted}>
                Enter the room code shared by your friend and jump into the quiz battle!
              </p>
            </div>

            <div className={`${styles.card.base} space-y-6`}>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Hash className="w-4 h-4 text-purple-400" />
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  placeholder="e.g., A3X9K2"
                  className={`${styles.input.base} text-center text-2xl tracking-widest font-bold ${
                    roomCode.length === 6 ? 'border-green-500' : ''
                  }`}
                  maxLength={6}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Enter the 6-character code from your friend
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <User className="w-4 h-4 text-cyan-400" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your name"
                  className={styles.input.base}
                  maxLength={20}
                />
                <p className="text-xs text-slate-500 mt-2">
                  This is how you'll appear to other players
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-red-300 font-semibold text-sm mb-1">Unable to Join</div>
                    <div className="text-red-200 text-sm">{error}</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleJoinRoom}
                disabled={!roomCode.trim() || !playerName.trim() || loading || roomCode.length !== 6}
                className={`w-full ${styles.button.primary} flex items-center justify-center gap-2 mt-6`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Join Room
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  How to Join
                </h3>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">1.</span>
                    <span>Get the 6-character room code from the host</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">2.</span>
                    <span>Enter your name so others can see who you are</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-400 font-bold">3.</span>
                    <span>Click "Join Room" and wait for the quiz to start</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xl font-bold text-purple-400">AI</div>
                  <div className="text-xs text-slate-500">Questions</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xl font-bold text-cyan-400">Live</div>
                  <div className="text-xs text-slate-500">Scoring</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
                  <div className="text-xl font-bold text-pink-400">8</div>
                  <div className="text-xs text-slate-500">Max Players</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm mb-3">Don't have a room code?</p>
              <button 
                onClick={handleBack}
                className={styles.button.secondary}
              >
                Create Your Own Room
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}