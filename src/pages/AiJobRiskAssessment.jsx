import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const steps = [
  { name: 'Answer a short set of questions',   desc: "About a dozen questions on how your specific role actually works day to day — not your job title." },
  { name: 'Get a 0-100 AI risk score',          desc: "A single score, built from the same factors researchers use to study automation exposure, not a guess." },
  { name: 'See exactly what’s driving it', desc: "A breakdown of which factors are pulling your score up or down, so the result isn’t a black box." },
  { name: 'Get a protection plan',              desc: "Concrete next steps tied to your specific gaps, not generic career advice." },
];

const faqs = [
  {
    q: 'What is an AI job risk assessment?',
    a: "It's a structured way of scoring how exposed a specific role is to AI automation, based on factors like accountability, judgment, trust, and physical presence — rather than guessing from a job title alone.",
  },
  {
    q: 'How accurate is an AI job risk score?',
    a: "It's only as good as the factors it measures. A useful assessment looks at how your actual day-to-day work is structured, since two people with the same title can have very different AI risk.",
  },
  {
    q: 'Is this assessment free?',
    a: "Yes — the AI Job Watch assessment is free to take and gives you a full breakdown of your score, not just a number.",
  },
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function AiJobRiskAssessment() {
  return (
    <div className="page-wrap">
      <Helmet>
        <title>AI Job Risk Assessment | AI Job Watch</title>
        <meta name="description" content="Take a free AI job risk assessment and get a 0-100 score for how exposed your specific role is to automation, plus a breakdown of exactly why." />
        <link rel="canonical" href="https://aijobwatch.org/ai-job-risk-assessment" />
        <meta property="og:url" content="https://aijobwatch.org/ai-job-risk-assessment" />
        <meta property="og:title" content="AI Job Risk Assessment | AI Job Watch" />
        <meta property="og:description" content="Take a free AI job risk assessment and get a 0-100 score for how exposed your specific role is to automation, plus a breakdown of exactly why." />
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>
      <div className="about-page">
        <div className="about-hero">
          <h1>AI Job Risk Assessment</h1>
          <p className="about-lead">
            A free, structured way to find out how exposed your specific role is to AI —
            scored on the factors that actually predict automation risk, not just your job title.
          </p>
        </div>

        <div className="about-section">
          <h2>Why a Job Title Isn’t Enough</h2>
          <p>
            Most "will AI take my job" advice is written at the level of entire professions, but
            two people with the same title can have very different day-to-day work. A real risk
            assessment has to look at how your actual role is structured — how much of it
            depends on judgment, trust, accountability, and physical presence — not just what
            it’s called.
          </p>
        </div>

        <div className="about-section">
          <h2>How the Assessment Works</h2>
          <div className="category-table">
            {steps.map((s) => (
              <div key={s.name} className="category-table-row">
                <div className="cat-table-name">{s.name}</div>
                <div className="cat-table-desc">{s.desc}</div>
              </div>
            ))}
          </div>
          <p>
            <Link to="/about">See the full scoring methodology on our About page →</Link>
          </p>
        </div>

        <div className="about-section">
          <h2>A Few Common Questions</h2>
          {faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <div className="about-cta">
          <Link to="/assessment" className="btn-primary btn-lg">
            Take the Free Assessment →
          </Link>
        </div>
      </div>
    </div>
  );
}
