export const styles = {
  bg: {
    primary: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    glass: "bg-white/10 backdrop-blur-sm border border-white/20",
  },
  button: {
    primary:
      "px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    secondary:
      "px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20",
  },
  card: {
    base: "bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10",
  },
  text: {
    gradient:
      "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent",
    muted: "text-slate-400",
  },
  input: {
    base: "w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors",
  },
  badge: {
    base: "inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-200",
  },
};

export const quizGameStyles = {
  bg: {
    primary: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
  },
  text: {
    gradient:
      "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent",
    muted: "text-slate-400",
  },
  card: {
    base: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl",
  },
  button: {
    answer:
      "w-full text-left p-5 rounded-xl border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]",
    answerSelected: "border-purple-500 bg-purple-500/20",
    answerCorrect: "border-green-500 bg-green-500/20",
    answerWrong: "border-red-500 bg-red-500/20",
  },
};
