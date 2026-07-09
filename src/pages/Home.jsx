import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Job Watch',
  url: 'https://aijobwatch.org',
  description: 'Free AI job risk assessment. Answer 30 questions and get a personalized AI Resistance Score showing how exposed or protected your job is from automation.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: 'AI Resistance Score, Category Breakdown, Automation Risk Assessment, Anonymous with no account required',
};

const features = [
  {
    icon: '🧠',
    title: 'AI Resistance Score',
    desc: 'Get a single number that captures how well-protected your role is against automation.',
  },
  {
    icon: '📊',
    title: 'Category Breakdown',
    desc: 'See exactly where you score on Accountability, Trust, Judgment, Licensing, and more.',
  },
  {
    icon: '⚠️',
    title: 'Risk Assessment',
    desc: 'Find out if your job is Low, Medium, or High risk based on real structural factors.',
  },
  {
    icon: '🔒',
    title: 'No Account Needed',
    desc: 'Your answers stay in your browser. No login, no tracking, no data stored.',
  },
];

export default function Home() {
  return (
    <div className="home">
      <Helmet>
        <title>Is Your Job Safe from AI? | AI Job Watch</title>
        <meta name="description" content="Free AI job risk assessment. Answer 30 questions about your role and get a personalized AI Resistance Score — find out exactly how exposed or protected your job is from automation." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      {/* Dark navy hero */}
      <section className="hero">
        <div className="hero-badge">AI Disruption Analysis Tool</div>
        <h1 className="hero-title">
          Is Your Job Safe
          <br />
          <span className="gradient-text">from AI?</span>
        </h1>
        <p className="hero-sub">
          Answer 30 questions about your role. Get a personalized AI Resistance Score and a clear
          breakdown of how exposed — or protected — your job really is.
        </p>
        <div className="hero-actions">
          <Link to="/assessment" className="btn-primary btn-lg">
            Start Free Assessment →
          </Link>
          <Link to="/about" className="btn-ghost-dark btn-lg">
            How it works
          </Link>
        </div>
        <div className="hero-meta">
          <span>~8 minutes</span>
          <span className="dot">·</span>
          <span>30 questions</span>
          <span className="dot">·</span>
          <span>Instant results</span>
        </div>
      </section>

      {/* White features section */}
      <section className="features">
        <div className="features-inner">
          <h2 className="section-title">What you'll find out</h2>
          <p className="section-subtitle">
            A structured, data-driven look at how AI-proof your career really is.
          </p>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Light-gray risk bands */}
      <section className="risk-bands">
        <div className="risk-bands-inner">
          <h2 className="section-title">Risk Levels Explained</h2>
          <p className="section-subtitle">
            Your final score determines which category you fall into.
          </p>
          <div className="bands-grid">
            <div className="band band-low">
              <div className="band-label">LOW RISK</div>
              <div className="band-score">Score 24+</div>
              <p>Your role has strong structural protection. Hard to automate, hard to replace.</p>
            </div>
            <div className="band band-medium">
              <div className="band-label">MEDIUM RISK</div>
              <div className="band-score">Score 16–23</div>
              <p>Some parts of your role are vulnerable. Proactive upskilling is recommended.</p>
            </div>
            <div className="band band-high">
              <div className="band-label">HIGH RISK</div>
              <div className="band-score">Score 15 or below</div>
              <p>Significant automation exposure. Now is the time to plan your next move.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark navy CTA */}
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
