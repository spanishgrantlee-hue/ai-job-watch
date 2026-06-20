import { Link } from 'react-router-dom';
import heroPhoto from '../assets/hero.jpg';

const categories = [
  { name: 'Accountability',       desc: 'Whether others depend on your personal judgment and legal/professional accountability.' },
  { name: 'Trust',                desc: 'How central relationship-building and interpersonal trust are to your daily role.' },
  { name: 'Judgment',             desc: 'How often you make nuanced calls that cannot be codified into simple rules.' },
  { name: 'Problem Solving',      desc: 'How frequently you tackle novel, unstructured problems without a predefined answer.' },
  { name: 'Physical Presence',    desc: 'How much your work requires a human body in a specific location.' },
  { name: 'Licensing',            desc: 'How much formal credentials, regulations, or licensing protect your position.' },
  { name: 'AI Exposure (penalty)', desc: 'How deeply AI has already penetrated your workflows. Subtracted from the total.' },
];

export default function About() {
  return (
    <div className="page-wrap">
    <div className="about-page">
      <div className="about-hero">
        <h1>About AI Job Watch</h1>
        <p className="about-lead">
          AI Job Watch is a free, anonymous tool that helps you understand how exposed — or
          protected — your job is from AI-driven automation. Built to give workers a clear,
          structured way to think about a question that too many are afraid to ask.
        </p>
      </div>

      {/* Personal story */}
      <div className="about-story">
        <div className="story-photo-wrap">
          <img src={heroPhoto} alt="Site founder" className="story-photo" />
        </div>
        <div className="story-content">
          <h2>Why I built this</h2>
          <p>
            I'm a longshoreman, and automation has been changing my industry for years. I built this
            to help myself and the guys I work with figure out where we stand — and realized workers
            in other industries could use the same thing. I figured why not put it out there and
            hopefully help a few people keep their jobs.
          </p>
          <p>
            AI Job Watch isn't about fear. It's about knowing where you stand so you can make smart
            decisions about your career. Every worker deserves that clarity — whether you're on the
            docks, in an office, or anywhere in between.
          </p>
        </div>
      </div>

      <div className="about-section">
        <h2>How the scoring works</h2>
        <p>
          Your answers are mapped to a score in six protection categories and one exposure penalty.
          Each category score is the rounded average of its questions, capped between 1 and 5. The
          AI Exposure Penalty is capped between 0 and 5. Your final AI Resistance Score is:
        </p>
        <div className="formula-block">
          Accountability + Trust + Judgment + Problem Solving + Physical Presence + Licensing
          <br />
          <span className="formula-minus-inline">− AI Exposure Penalty</span>
          <br />
          <strong>= Final AI Resistance Score (max 30)</strong>
        </div>
        <div className="threshold-table">
          <div className="threshold-row threshold-low">
            <span className="threshold-score">24 or above</span>
            <span className="threshold-label">LOW RISK</span>
          </div>
          <div className="threshold-row threshold-medium">
            <span className="threshold-score">16 – 23</span>
            <span className="threshold-label">MEDIUM RISK</span>
          </div>
          <div className="threshold-row threshold-high">
            <span className="threshold-score">15 or below</span>
            <span className="threshold-label">HIGH RISK</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>What each category measures</h2>
        <div className="category-table">
          {categories.map((c) => (
            <div key={c.name} className="category-table-row">
              <div className="cat-table-name">{c.name}</div>
              <div className="cat-table-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>Privacy</h2>
        <p>
          AI Job Watch automatically saves your assessment answers and final score to help us
          understand which jobs and industries are most affected by AI — and to improve this tool
          over time. We do not collect your name, email, location, or any other personal
          information. Your responses are anonymous, but your input helps us learn and build a
          better site to help more people.
        </p>
      </div>

      <div className="about-section">
        <h2>Disclaimer</h2>
        <p>
          This tool provides a structural analysis based on self-reported answers. It is not a
          guarantee of employment outcomes, nor a substitute for professional career advice. The
          model reflects broad patterns in how AI affects job categories — individual roles will
          vary. Use this as one input among many when thinking about your career.
        </p>
      </div>

      <div className="about-cta">
        <Link to="/assessment" className="btn-primary btn-lg">
          Take the Assessment →
        </Link>
      </div>
    </div>
    </div>
  );
}
