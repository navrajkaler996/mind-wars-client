import { Zap } from "lucide-react/dist/cjs/lucide-react";
import { styles } from "../styles";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [loggedInPlayer, setLoggedInPlayer] = useState();

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");

    if (storedPlayer) setLoggedInPlayer(JSON.parse(storedPlayer));
  }, []);

  return (
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
          onClick={() => navigate("/profile")}
          className={`px-6 py-2 ${styles.bg.glass} rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20`}>
          {loggedInPlayer?.name}
        </button>
      </div>
    </header>
  );
}
