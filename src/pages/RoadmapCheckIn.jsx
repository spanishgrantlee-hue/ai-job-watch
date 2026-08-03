import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAnswers } from '../App';
import { calculateResults } from '../utils/scoring';
import { decodeRoadmapSnapshot } from '../utils/share';
import { getQuestion } from '../utils/questions';

// ─── Roadmap Check-In (P3) ──────────────────────────────────────────────────────
// A short 8-question re-check-in instead of the full 30-question assessment.
// Reuses questions.js's own question/choice objects verbatim (no new
// questions invented, no changes to that file) and calculateResults()
// unmodified -- this only ever merges fresh answers into a COPY of the
// existing stored answers and recomputes, the same scoring engine every
// other page already uses.
//
// Question choice: covers accountability/judgment/problemSolving/AI-exposure
// (Q6, Q8, Q13, Q15, Q16, Q17, Q23, Q28) -- factors tied to workplace AI
// adoption and role-scope changes, which shift on a timescale of months.
// Deliberately does NOT re-ask anything feeding trust/physicalPresence/
// licensing, since those are stable traits of a job (relationship demands,
// physical nature of the work, regulatory requirements) that don't shift in
// a short re-check-in window.
//
// Requires the original answers to still be in this browser's localStorage
// (via AnswerContext) -- there's no raw-answer baseline to merge into
// otherwise, since P1's saved snapshot deliberately stores only category
// scores, not the original 30 raw answers. A user arriving without local
// answers (different device, cleared storage) gets directed to /assessment
// instead of a broken partial-answer computation.

const SCORED_IDS = ['Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q28'];
const CHECKIN_QUESTION_IDS = ['Q6', 'Q8', 'Q13', 'Q15', 'Q16', 'Q17', 'Q23', 'Q28'];

export default function RoadmapCheckIn() {
  const { answers, setAnswers } = useAnswers();
  const [searchParams] = useSearchParams();
  const hasAnswers = SCORED_IDS.some(id => answers[id] !== undefined);

  const [draftAnswers, setDraftAnswers] = useState(() =>
    Object.fromEntries(CHECKIN_QUESTION_IDS.map(id => [id, answers[id]]))
  );
  const [comparison, setComparison] = useState(null);

  if (!hasAnswers) {
    return (
      <div className="results-page">
        <div className="results-empty-page">
          <div className="container">
            <h1>No Assessment Found</h1>
            <p>Take the full assessment first, then come back to check in on what&rsquo;s changed.</p>
            <Link to="/assessment" className="btn-primary">Take the Assessment</Link>
          </div>
        </div>
      </div>
    );
  }

  function handleSelect(questionId, index) {
    setDraftAnswers(prev => ({ ...prev, [questionId]: index }));
  }

  function handleSubmit() {
    const snapshotParam = searchParams.get('snapshot');
    const snapshotData = snapshotParam ? decodeRoadmapSnapshot(snapshotParam) : null;
    const before = snapshotData ?? calculateResults(answers);

    const mergedAnswers = { ...answers, ...draftAnswers };
    const after = calculateResults(mergedAnswers);

    setAnswers(mergedAnswers);
    setComparison({ before, after });
  }

  if (comparison) {
    const { before, after } = comparison;
    const delta = after.finalScore - before.finalScore;
    const deltaText =
      delta > 0 ? `Your score moved up ${delta} point${delta === 1 ? '' : 's'} since your last check.`
      : delta < 0 ? `Your score moved down ${Math.abs(delta)} point${Math.abs(delta) === 1 ? '' : 's'} since your last check.`
      : "Your score hasn't changed since your last check.";

    return (
      <div className="results-page">
        <section className="results-hero">
          <div className="container">
            <p className="results-eyebrow">Your Updated Score</p>
            <div className="checkin-comparison">
              <div className="checkin-comparison-side">
                <span className="checkin-comparison-label">Before</span>
                <span className="checkin-comparison-score">{before.finalScore}<span className="results-score-denom">/30</span></span>
              </div>
              <div className="checkin-comparison-arrow" aria-hidden="true">&rarr;</div>
              <div className="checkin-comparison-side">
                <span className="checkin-comparison-label">Now</span>
                <span className="checkin-comparison-score">{after.finalScore}<span className="results-score-denom">/30</span></span>
              </div>
            </div>
            <p className="why-line">{deltaText}</p>
            <Link to="/roadmap" className="btn-ghost-dark">See Your Full Roadmap</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="results-page">
      <section className="results-section">
        <div className="container results-container">
          <div className="results-section-hdr">
            <div className="section-label">Quick Check-In</div>
            <h1 className="results-section-title">What&rsquo;s changed since you last checked?</h1>
            <p className="results-section-desc">
              Just {CHECKIN_QUESTION_IDS.length} questions &mdash; the ones most likely to have shifted. Everything else stays the same as your original assessment.
            </p>
          </div>

          {CHECKIN_QUESTION_IDS.map((id, i) => {
            const question = getQuestion(id);
            return (
              <div className="question-block" key={id}>
                <div className="question-label-row">
                  <span className="question-label">{i + 1}. {question.text}</span>
                </div>
                <div className="choice-list" role="radiogroup" aria-label={question.text}>
                  {question.choices.map((choice, ci) => {
                    const selected = draftAnswers[id] === ci;
                    return (
                      <button
                        type="button"
                        key={ci}
                        role="radio"
                        aria-checked={selected}
                        className={`choice-btn${selected ? ' choice-btn--selected' : ''}`}
                        onClick={() => handleSelect(id, ci)}
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
              </div>
            );
          })}

          <button type="button" className="btn-primary checkin-submit" onClick={handleSubmit}>
            See My Updated Score
          </button>
        </div>
      </section>
    </div>
  );
}
