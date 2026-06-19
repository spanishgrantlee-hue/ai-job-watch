import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sections } from '../utils/questions';
import { calculateScores } from '../utils/scoring';

const TOTAL_SECTIONS = sections.length;

export default function Assessment() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const section = sections[currentSection];
  const progress = Math.round(((currentSection) / TOTAL_SECTIONS) * 100);

  function handleAnswer(qid, value) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setErrors((prev) => ({ ...prev, [qid]: false }));
  }

  function validateSection() {
    const newErrors = {};
    let valid = true;
    section.questions.forEach((q) => {
      if (q.type !== 'textarea' && !answers[q.id]) {
        newErrors[q.id] = true;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  }

  function handleNext() {
    if (!validateSection()) return;
    if (currentSection < TOTAL_SECTIONS - 1) {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const scores = calculateScores(answers);
      navigate('/results', { state: { scores, answers } });
    }
  }

  function handleBack() {
    setCurrentSection((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="page-wrap">
    <div className="assessment-page">
      <div className="assessment-header">
        <div className="progress-info">
          <span className="progress-label">
            Section {currentSection + 1} of {TOTAL_SECTIONS}
          </span>
          <span className="progress-pct">{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="section-steps">
          {sections.map((s, i) => (
            <div
              key={s.id}
              className={`step ${i < currentSection ? 'done' : ''} ${i === currentSection ? 'active' : ''}`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      <div className="assessment-body">
        <div className="section-intro">
          <span className="section-tag">Section {section.id}</span>
          <h2 className="section-heading">{section.title}</h2>
          <p className="section-desc">{section.description}</p>
        </div>

        <div className="questions-list">
          {section.questions.map((q, qi) => (
            <div key={q.id} className={`question-card ${errors[q.id] ? 'question-error' : ''}`}>
              <div className="question-label">
                <span className="q-number">Q{q.id.replace('Q', '')}</span>
                <span className="q-text">{q.label}</span>
              </div>

              {q.type === 'text' && (
                <input
                  type="text"
                  className="text-input"
                  placeholder={q.placeholder}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  className="textarea-input"
                  placeholder={q.placeholder}
                  rows={6}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'select' && (
                <select
                  className="select-input"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                >
                  <option value="" disabled>
                    Select an option…
                  </option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {q.type === 'radio' && (
                <div className="radio-group">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`radio-option ${answers[q.id] === opt ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleAnswer(q.id, opt)}
                      />
                      <span className="radio-check" />
                      <span className="radio-label">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {errors[q.id] && (
                <p className="error-msg">Please select an answer to continue.</p>
              )}
            </div>
          ))}
        </div>

        <div className="assessment-nav">
          {currentSection > 0 && (
            <button className="btn-ghost" onClick={handleBack}>
              ← Back
            </button>
          )}
          <button className="btn-primary" onClick={handleNext}>
            {currentSection < TOTAL_SECTIONS - 1 ? 'Next Section →' : 'See My Results →'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
