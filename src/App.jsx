import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import About from './pages/About';
import './index.css';

// Shared context — Assessment writes answers, Results reads them
export const AnswerContext = createContext(null);
export function useAnswers() { return useContext(AnswerContext); }

export default function App() {
  const [answers, setAnswers] = useState({});

  return (
    <AnswerContext.Provider value={{ answers, setAnswers }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results"    element={<Results />} />
          <Route path="/about"      element={<About />} />
        </Routes>
      </BrowserRouter>
    </AnswerContext.Provider>
  );
}
