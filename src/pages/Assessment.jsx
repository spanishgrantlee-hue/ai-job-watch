import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAnswers } from '../App';
import { sections, getQuestionsForSection } from '../utils/questions';

const TOTAL_SECTIONS = sections.length;

// Lightweight snapshot of the values that matter for the mobile scroll debug overlay.
function captureScrollState() {
  return {
    winY:      Math.round(window.scrollY),
    docElTop:  Math.round(document.documentElement.scrollTop),
    bodyTop:   Math.round(document.body.scrollTop),
  };
}

export default function Assessment() {
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState({});
  const [scrollDebug, setScrollDebug] = useState(null);
  const [scrollTimeline, setScrollTimeline] = useState([]);
  const { answers, setAnswers } = useAnswers();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const scrollLogRef = useRef([]);
  const sectionT0Ref = useRef(performance.now());
  const logRef = useRef(null);

  // Updated every render so prototype patches always call the latest closure.
  logRef.current = (msg, isRed = false) => {
    const t = `+${Math.round(performance.now() - sectionT0Ref.current)}ms`;
    const ae = document.activeElement;
    const aeStr = ae
      ? `${ae.tagName}${ae.className ? '.' + String(ae.className).split(' ')[0] : ''}${ae.id ? '#' + ae.id : ''}`
      : 'none';
    const entry = { t, y: Math.round(window.scrollY), ae: aeStr, msg, isRed };
    scrollLogRef.current = [...scrollLogRef.current, entry].slice(-10);
    setScrollTimeline([...scrollLogRef.current]);
  };

  const sectionData = sections.find(s => s.id === currentSection);
  const sectionQuestions = getQuestionsForSection(currentSection);
  const isLastSection   = currentSection === TOTAL_SECTIONS;
  const answeredCount   = sectionQuestions.filter(q => q.type === 'choice' && answers[q.id] !== undefined).length;
  const requiredCount   = sectionQuestions.filter(q => q.type === 'choice').length;

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

  // Disable browser scroll restoration while the assessment is mounted so
  // the browser doesn't fight our explicit resets on section transitions.
  useEffect(() => {
    const prev = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = prev; };
  }, []);

  // Reset every scroll container on section change.
  // iOS Safari can restore scroll position AFTER useLayoutEffect runs, so we
  // repeat the reset inside requestAnimationFrame (before next paint) and again
  // inside a short setTimeout (after layout settles). The desktop path is
  // unaffected — extra no-op resets on an already-zero scroll position are harmless.
  useLayoutEffect(() => {
    function resetScroll() {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;

      // Also zero out any ancestor of .assessment-page with a non-zero scrollTop.
      const pageEl = document.querySelector('.assessment-page');
      let node = pageEl?.parentElement;
      while (node) {
        if (node.scrollTop > 0) node.scrollTop = 0;
        if (node === document.documentElement) break;
        node = node.parentElement;
      }

      // Move focus to the section heading so the Next/Back button loses its
      // focus context. preventScroll ensures this focus call doesn't scroll.
      headerRef.current?.focus({ preventScroll: true });

      setScrollDebug(captureScrollState());
    }

    resetScroll();
    const raf   = requestAnimationFrame(resetScroll);
    const timer = setTimeout(resetScroll, 80);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [currentSection]);

  // Keep overlay live as the user scrolls manually within a section.
  useEffect(() => {
    const update = () => setScrollDebug(captureScrollState());
    update();
    document.addEventListener('scroll', update, { passive: true, capture: true });
    return () => document.removeEventListener('scroll', update, { capture: true });
  }, []);

  // Patch scrollIntoView and focus once so every call is captured in the trace.
  useEffect(() => {
    const origSIV = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(opts) {
      const cls = String(this.className || '').split(' ')[0] || this.tagName;
      logRef.current?.(`scrollIntoView .${cls}`, true);
      return origSIV.call(this, opts);
    };

    const origFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function(opts) {
      const id = this.id || String(this.className || '').split(' ')[0] || this.tagName;
      const label = opts?.preventScroll ? `focus(pS) .${id}` : `FOCUS .${id}`;
      logRef.current?.(label, !opts?.preventScroll);
      return origFocus.call(this, opts);
    };

    return () => {
      Element.prototype.scrollIntoView = origSIV;
      HTMLElement.prototype.focus = origFocus;
    };
  }, []);

  // Sample scrollY every animation frame for 700ms after each section change.
  useEffect(() => {
    scrollLogRef.current = [];
    setScrollTimeline([]);
    let prevY = Math.round(window.scrollY);
    let rafId;

    function sample() {
      const y = Math.round(window.scrollY);
      if (y !== prevY) {
        logRef.current?.(`SCROLL ${prevY}→${y}`, true);
        prevY = y;
      }
      if (Math.round(performance.now() - sectionT0Ref.current) < 700) {
        rafId = requestAnimationFrame(sample);
      }
    }

    rafId = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(rafId);
  }, [currentSection]);

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
      document.activeElement?.blur();
      sectionT0Ref.current = performance.now();
      setCurrentSection(s => s + 1);
      setErrors({});
    }
  }

  function handleBack() {
    document.activeElement?.blur();
    sectionT0Ref.current = performance.now();
    setCurrentSection(s => s - 1);
    setErrors({});
  }

  return (
    <div className="assessment-page">

      {/* ── TEMPORARY MOBILE DEBUG PANEL — remove before ship ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '50vh',
        zIndex: 99999, background: 'rgba(0,0,0,0.95)', color: '#00ff88',
        fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.55',
        padding: '10px 12px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: '4px',
        pointerEvents: 'none',
      }}>
        {/* Header row */}
        <div style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: '17px', flexShrink: 0 }}>
          SCROLL DEBUG — §{currentSection} — Y:{scrollDebug?.winY ?? '…'} docEl:{scrollDebug?.docElTop ?? '…'}
        </div>

        {/* Event log */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {scrollTimeline.length === 0
            ? <div style={{ color: '#555' }}>no events yet (last 10 shown)</div>
            : scrollTimeline.map((e, i) => (
              <div key={i} style={{
                color: e.isRed ? '#ff5555' : '#888888',
                wordBreak: 'break-all',
              }}>
                {e.t} Y:{e.y} [{e.ae}] {e.msg}
              </div>
            ))
          }
        </div>

        {/* Copy button — needs pointer events */}
        <button
          onClick={() => {
            const lines = [
              `Section:${currentSection} scrollY:${scrollDebug?.winY ?? '?'} docEl:${scrollDebug?.docElTop ?? '?'}`,
              '---',
              ...scrollTimeline.map(e => `${e.t} Y:${e.y} [${e.ae}] ${e.msg}`),
            ];
            navigator.clipboard?.writeText(lines.join('\n')).catch(() => {});
          }}
          style={{
            pointerEvents: 'auto', flexShrink: 0, alignSelf: 'flex-start',
            padding: '10px 22px', background: '#ffcc00', color: '#000',
            border: 'none', borderRadius: '6px', fontSize: '16px',
            fontWeight: 'bold', cursor: 'pointer',
          }}
        >
          Copy Trace
        </button>
      </div>
      {/* ── END DEBUG PANEL ── */}

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
            <span className="progress-pct">{answeredCount}/{requiredCount} answered</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={currentSection} aria-valuemin={1} aria-valuemax={TOTAL_SECTIONS} aria-label="Assessment progress">
            {sections.map(s => (
              <div
                key={s.id}
                className={
                  s.id < currentSection  ? 'progress-segment progress-segment--done'   :
                  s.id === currentSection ? 'progress-segment progress-segment--active' :
                                            'progress-segment'
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dark section header — tabIndex="-1" lets us focus it programmatically
          to clear the Next button's focus context without entering the tab order */}
      <div className="assessment-header" ref={headerRef} tabIndex="-1" style={{ outline: 'none' }}>
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
  const isOptional    = question.type === 'freeText';
  const choiceRefs    = useRef([]);
  const prevAnswerRef = useRef(answer); // tracks previous answer value
  const hasMountedRef = useRef(false);  // skips auto-scroll on initial mount

  // WAI-ARIA radio group: only the selected (or first) option is in the tab sequence.
  // Arrow keys move focus + selection; clicking always selects.
  const focusableIdx = answer !== undefined ? answer : 0;

  // On mobile only: smooth-scroll to the next question 300ms after the user
  // answers a choice question for the first time. Re-selecting/changing an
  // existing answer does not trigger a scroll (prev !== undefined guard).
  // hasMountedRef ensures this never fires during section mount/unmount —
  // only genuine user interactions (answer changing after mount) trigger it.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      prevAnswerRef.current = answer;
      return;
    }

    const prev = prevAnswerRef.current;
    prevAnswerRef.current = answer;

    if (
      answer === undefined ||   // question is unanswered
      prev !== undefined ||     // user is changing an existing answer
      window.innerWidth >= 768  // desktop: no auto-scroll
    ) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(question.id);
      const nextEl = el?.nextElementSibling;
      if (nextEl?.classList.contains('question-block')) {
        nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [answer, question.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChoiceKeyDown(e, i) {
    const last = question.choices.length - 1;
    let next = null;
    if      (e.key === 'ArrowDown'  || e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowUp'    || e.key === 'ArrowLeft')  next = i === 0 ? last : i - 1;
    else if (e.key === 'Home')                                  next = 0;
    else if (e.key === 'End')                                   next = last;
    if (next !== null) {
      e.preventDefault();
      onChange(next);
      choiceRefs.current[next]?.focus();
    }
  }

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
                tabIndex={i === focusableIdx ? 0 : -1}
                className={`choice-btn${selected ? ' choice-btn--selected' : ''}`}
                onClick={() => onChange(i)}
                onKeyDown={e => handleChoiceKeyDown(e, i)}
                ref={el => { choiceRefs.current[i] = el; }}
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
