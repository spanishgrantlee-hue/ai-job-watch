import { createContext, useContext } from 'react';

// Shared context — Assessment writes answers, Results reads them.
// Lives outside App.jsx so App.jsx only exports components (keeps Vite fast
// refresh working) and pages don't import from App, which imports them.
export const AnswerContext = createContext(null);
export function useAnswers() { return useContext(AnswerContext); }
