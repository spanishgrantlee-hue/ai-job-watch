import { createContext, useContext, useState, useEffect } from 'react';
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

// localStorage key for in-progress assessment answers, so a refresh or
// closed tab doesn't lose the user's progress.
const ANSWERS_STORAGE_KEY = 'aijobwatch_answers';

function loadSavedAnswers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ANSWERS_STORAGE_KEY));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [answers, setAnswers] = useState(loadSavedAnswers);

  useEffect(() => {
    try {
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) — safe to ignore
    }
  }, [answers]);

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
