import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CreateRoom from './pages/CreateRoom';
import WaitingRoom from './pages/WaitingRoom';
import JoinRoom from './pages/JoinRoom';
import QuizGame from './pages/QuizGame';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/waiting-room/:code" element={<WaitingRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/quiz-game/:code" element={<QuizGame />} />
      </Routes>
    </BrowserRouter>
  );
}

