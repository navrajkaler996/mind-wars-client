import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateRoom from "./pages/CreateRoom";
import WaitingRoom from "./pages/WaitingRoom";
import JoinRoom from "./pages/JoinRoom";
import QuizGame from "./pages/QuizGame";
import CreatePlayer from "./pages/CreatePlayer";
import Login from "./pages/Login";
import { AuthProvider } from "./AuthContext";
import PublicRoute from "./others/PublicRoute";
import Profile from "./pages/Profile";
import PracticeAloneQuiz from "./pages/Practice";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/waiting-room/:code/:id" element={<WaitingRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/quiz-game/:code" element={<QuizGame />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/practice" element={<PracticeAloneQuiz />} />

          <Route
            path="/create-player"
            element={
              <PublicRoute>
                <CreatePlayer />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
