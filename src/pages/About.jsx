import { Link } from 'react-router-dom';
import heroPhoto from '../assets/hero.jpg';

const values = [
  {
    icon: '👷',
    title: 'Worker-First',
    desc: "This tool was built by a worker for workers — not to serve employers or consultants. We don't soften results, we don't take money from companies, and we don't have any interest in making automation sound better than it is.",
  },
  {
    icon: '📣',
    title: 'No Sugar-Coating',
    desc: 'High risk means high risk. Medium risk means something is worth paying attention to. We think workers are capable of handling honest information about their situation — and they deserve it.',
  },
  {
    icon: '🔓',
    title: 'Free, Always',
    desc: "Workers shouldn't have to pay to understand a risk that's being put on them by forces largely outside their control. AI Job Watch is free and will stay that way.",
  },
];

const categories = [
  { name: 'Accountability',        qs: 'Q13, Q21–Q23, Q25', desc: 'Whether others depend on your personal judgment and professional or legal accountability.' },
  { name: 'Trust & Relationships', qs: 'Q11, Q12, Q14',     desc: 'How central relationship-building and interpersonal trust are to your daily role.' },
  { name: 'Human Judgment',        qs: 'Q7, Q10, Q13, Q15', desc: 'How often you make nuanced calls that cannot be codified into simple rules.' },
  { name: 'Problem Solving',       qs: 'Q15, Q28',          desc: 'How frequently you tackle novel, unstructured problems without a predefined answer.' },
  { name: 'Physical Presence',     qs: 'Q9, Q18–Q20',       desc: 'How much your work requires a human body in a specific location.' },
  { name: 'Licensing',             qs: 'Q22, Q24, Q25',     desc: 'How much formal credentials, regulations, or licensing protect your position.' },
  { name: 'AI Exposure (penalty)', qs: 'Q6, Q8, Q16–Q19, Q23, Q24', desc: 'How deeply AI has already penetrated your workflows. Subtracted from your total score.' },
];

export default function About() {
  return (
    <div className="about">

      {/* Dark hero */}
      <section className="hero">
        <div className="hero-badge">Our Story</div>
        <h1 className="hero-title">
          Built for Workers,
          <br />
          <span className="gradient-text">Not Bosses.</span>
        </h1>
        <p className="hero-sub">
          AI Job Watch exists because workers deserve honest answers about automation — before their
          employer has already made the call. Built by a longshoreman who got tired of watching
          coworkers get blindsided.
        </p>
        <div className="hero-actions">
          <Link to="/assessment" className="btn-primary btn-lg">Take the Assessment →</Link>
          <a href="#how-it-scores" className="btn-ghost-dark btn-lg">How it scores</a>
        </div>
      </section>

      {/* Personal story — white */}
      <section className="features">
        <div className="features-inner">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            <div className="about-story">
              <div className="story-photo-wrap">
                <img src={heroPhoto} alt="Site founder" className="story-photo" />
              </div>
              <div className="story-content">
                <h2>Why I built this</h2>
                <p>
                  I work the docks. Automation has been part of my world for years — not in the
                  abstract way people talk about it in the news, but in the concrete, daily way where
                  a machine shows up and a job doesn't come back. I watched coworkers scramble to
                  figure out what was happening, usually too late to do much about it.
                </p>
                <p>
                  When I started asking around, most people had no real picture of where they stood.
                  They were waiting to find out rather than figuring it out. I wanted something that
                  could give a straight answer to a question a lot of workers are afraid to ask. So
                  I built it.
                </p>
                <p>
                  I started with the guys I work with on the docks and then realized workers in every
                  field could use the same thing. If you're wondering whether your job is safe, you
                  deserve a real answer — not a shrug.
                </p>
              </div>
            </div>

            <div className="about-section">
              <h2>The mission</h2>
              <p>
                Give every worker honest, free information about their automation risk — early
                enough to actually do something about it. Not to cause panic. Not to pretend the
                threat isn't real. Just to help people see clearly so they can make smart decisions
                about their careers before the decision gets made for them.
              </p>
              <p style={{ marginTop: '0.9rem', color: 'var(--text-secondary)' }}>
                The workers who get ahead of this won't be the ones who were lucky — they'll be the
                ones who looked at the situation clearly and started moving. That's what this tool is
                for.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Values — light gray */}
      <section className="risk-bands">
        <div className="risk-bands-inner">
          <h2 className="section-title">What we believe</h2>
          <p className="section-subtitle">
            These principles shaped every decision we made in building this tool.
          </p>
          <div className="features-grid">
            {values.map(v => (
              <div key={v.title} className="feature-card">
                <div className="feature-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical reference — white */}
      <section className="features" id="how-it-scores">
        <div className="features-inner">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            <div className="about-section">
              <h2>How the scoring works</h2>
              <p>
                Your answers are mapped to a score in six protection categories and one exposure
                penalty. Each category score is the rounded average of its contributing questions,
                clamped between 1 and 5. The AI Exposure Penalty is clamped between 0 and 5.
                Your final AI Resistance Score is:
              </p>
              <div className="formula-block">
                Accountability + Trust + Judgment + Problem Solving + Physical Presence + Licensing
                <br />
                <span className="formula-minus-inline">− AI Exposure Penalty</span>
                <br />
                <strong>= Your AI Resistance Score (max 30)</strong>
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
                {categories.map(c => (
                  <div key={c.name} className="category-table-row">
                    <div>
                      <div className="cat-table-name">{c.name}</div>
                      <div className="cat-table-qs">{c.qs}</div>
                    </div>
                    <div className="cat-table-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-section">
              <h2>Privacy</h2>
              <p>
                AI Job Watch does not collect or store any of your answers. Everything is processed
                in your browser and discarded when you close the tab. No account, no login, no
                tracking. A future version may introduce optional anonymous data collection to
                improve the scoring model, but you will always be informed before any data leaves
                your device.
              </p>
            </div>

            <div className="about-section">
              <h2>Disclaimer</h2>
              <p>
                This tool provides a structural analysis based on self-reported answers. It is not a
                guarantee of employment outcomes, and it is not a substitute for professional career
                advice. The scoring model reflects broad patterns in how AI affects job categories —
                individual roles vary significantly. Use this as one clear input among many when
                thinking about your career, not as the final word.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section className="cta-section">
        <h2>Ready to find out where you stand?</h2>
        <p>Free, anonymous, and takes less than 10 minutes.</p>
        <Link to="/assessment" className="btn-primary btn-lg">
          Take the Assessment →
        </Link>
      </section>

    </div>
  );
}
