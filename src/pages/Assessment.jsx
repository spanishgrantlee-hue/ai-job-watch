import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAnswers } from '../App';
import { sections, getQuestionsForSection } from '../utils/questions';

const TOTAL_SECTIONS = sections.length;

export default function Assessment() {
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState({});
  const { answers, setAnswers } = useAnswers();
  const navigate = useNavigate();

  const sectionData = sections.find(s => s.id === currentSection);
  const sectionQuestions = getQuestionsForSection(currentSection);
  const isLastSection = currentSection === TOTAL_SECTIONS;
  const progressPct = Math.round((currentSection / TOTAL_SECTIONS) * 100);

  function handleAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }

  function validate() {
    const newErrors = {};
    sectionQuestions.forEach(q => {
      if (q.type === 'choice' && answers[q.id] === undefined) {
        newErrors[q.id] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate()) {
      const firstErrorId = sectionQuestions.find(
        q => q.type === 'choice' && answers[q.id] === undefined
      )?.id;
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (isLastSection) {
      navigate('/results');
    } else {
      setCurrentSection(s => s + 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    setCurrentSection(s => s - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="assessment-page">
      <Helmet>
        <title>AI Job Risk Assessment | AI Job Watch</title>
        <meta name="description" content="Take the free AI Job Watch assessment. Answer 30 questions about your role and get an instant AI Resistance Score across six categories — no account required." />
      </Helmet>

      {/* Sticky progress bar */}
      <div className="assessment-progress-bar">
        <div className="container">
          <div className="progress-meta">
            <span className="progress-section-label">
              Section {currentSection} of {TOTAL_SECTIONS} &mdash; <strong>{sectionData.title}</strong>
            </span>
            <span className="progress-pct">{progressPct}% complete</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Dark section header */}
      <div className="assessment-header">
        <div className="container">
          <p className="assessment-section-tag">Section {currentSection} of {TOTAL_SECTIONS}</p>
          <h1 className="assessment-title">{sectionData.title}</h1>
          <p className="assessment-desc">{sectionData.description}</p>
        </div>
      </div>

      {/* Questions */}
      <div className="assessment-body">
        <div className="container">
          {sectionQuestions.map((q, idx) => (
            <QuestionBlock
              key={q.id}
              question={q}
              number={idx + 1}
              answer={answers[q.id]}
              hasError={!!errors[q.id]}
              onChange={val => handleAnswer(q.id, val)}
            />
          ))}

          <div className="assessment-nav">
            {currentSection > 1 && (
              <button className="btn-secondary" onClick={handleBack} type="button">
                &larr; Back
              </button>
            )}
            <button className="btn-primary" onClick={handleNext} type="button">
              {isLastSection ? 'See My Results →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function QuestionBlock({ question, number, answer, hasError, onChange }) {
  const isOptional = question.type === 'freeText';

  return (
    <div
      id={question.id}
      className={`question-block${hasError ? ' question-block--error' : ''}`}
    >
      <div className="question-label-row">
        <span className="question-label">
          {number}. {question.text}
        </span>
        {isOptional && <span className="question-optional">Optional</span>}
      </div>

      {hasError && (
        <p className="question-error-msg">Please select an answer to continue.</p>
      )}

      {question.type === 'freeText' && !question.multiLine && (
        <input
          type="text"
          className="question-input"
          placeholder={question.placeholder}
          value={answer || ''}
          onChange={e => onChange(e.target.value)}
          aria-label={question.text}
        />
      )}

      {question.type === 'freeText' && question.multiLine && (
        <textarea
          className="question-textarea"
          placeholder={question.placeholder}
          value={answer || ''}
          onChange={e => onChange(e.target.value)}
          rows={6}
          aria-label={question.text}
        />
      )}

      {question.type === 'choice' && (
        <div className="choice-list" role="radiogroup" aria-label={question.text}>
          {question.choices.map((choice, i) => {
            const selected = answer === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`choice-btn${selected ? ' choice-btn--selected' : ''}`}
                onClick={() => onChange(i)}
              >
                <span className="choice-indicator" aria-hidden="true">
                  {selected ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="9" cy="9" r="4" fill="currentColor"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="8" stroke="#C8D4E3" strokeWidth="2"/>
                    </svg>
                  )}
                </span>
                <span className="choice-label">{choice.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
