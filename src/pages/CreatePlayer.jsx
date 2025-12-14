import React, { useState } from "react";
import {
  Zap,
  ArrowLeft,
  Sparkles,
  User,
  Mail,
  Lock,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { createPlayer } from "../apis/playerApis";

export default function CreatePlayer() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePlayer = async (e) => {
    e.preventDefault();

    if (!playerName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const player = {
      name: playerName.trim(),
      email: email.trim(),
      password,
    };

    try {
      setLoading(true);

      const createdPlayer = await createPlayer(player);

      if (createdPlayer?.player) {
        // alert("Player created successfully! Use your email and password")

        navigate("/login", {
          state: {
            playerCreated: true,
          },
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to create a player:", error);
      alert("Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/create-room");
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
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-200">Join MindWars</span>
              </div>
            </div>

            <form
              onSubmit={handleCreatePlayer}
              className={`${styles.card.base} space-y-6`}>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <User className="w-4 h-4 text-purple-400" />
                  Player Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Choose your warrior name"
                  className={styles.input.base}
                  maxLength={30}
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  This is how other players will see you
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className={styles.input.base}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Lock className="w-4 h-4 text-pink-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={styles.input.base}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Lock className="w-4 h-4 text-pink-400" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={styles.input.base}
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !playerName.trim() ||
                  !email.trim() ||
                  !password.trim() ||
                  !confirmPassword.trim()
                }
                className={`w-full ${styles.button.primary} flex items-center justify-center gap-2 mt-6`}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
