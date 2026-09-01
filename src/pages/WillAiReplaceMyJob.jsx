import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const factors = [
  { name: 'Accountability',    desc: "Does someone need to be personally on the hook when a decision goes wrong? AI can suggest an answer, but it usually can't own the consequences." },
  { name: 'Trust',              desc: 'How much of your job depends on relationships people choose to have with you specifically, not just with "a company"?' },
  { name: 'Judgment',           desc: "How often do you make a call that doesn't have one clean, rule-based answer?" },
  { name: 'Problem Solving',    desc: "How often are you handed a genuinely new problem, not a variation of one you've solved a hundred times?" },
  { name: 'Physical Presence',  desc: 'Does the work require a human body to actually be somewhere, doing something hands-on?' },
  { name: 'Licensing',          desc: "Are you protected by formal credentials, regulation, or legal liability that a model can't hold?" },
];

const faqs = [
  {
    q: 'Which jobs are safest from AI?',
    a: "Roles that combine several protective factors at once tend to hold up best — for example, work where someone must be personally accountable for outcomes, where trust is built over years, and where physical presence is required.",
  },
  {
    q: 'How soon could AI replace jobs?',
    a: "It's already reshaping how many jobs get done — automating specific tasks inside a role — well before it fully replaces entire jobs. The bigger near-term risk for most workers is a shrinking need for people in roles built mostly around tasks AI already does well, not a sudden full replacement.",
  },
  {
    q: 'Can I do anything to protect my job from AI?',
    a: "Yes — the roles that hold up best usually didn't get that way by accident. Understanding exactly where your own role is exposed is the first step toward closing those gaps intentionally.",
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

export default function WillAiReplaceMyJob() {
  return (
    <div className="page-wrap">
      <Helmet>
        <title>Will AI Replace My Job? | AI Job Watch</title>
        <meta name="description" content="Will AI replace your job? AI Job Watch breaks down the six factors that actually predict AI risk — not your job title, but how your role is structured." />
        <link rel="canonical" href="https://aijobwatch.org/will-ai-replace-my-job" />
        <meta property="og:url" content="https://aijobwatch.org/will-ai-replace-my-job" />
        <meta property="og:title" content="Will AI Replace My Job? | AI Job Watch" />
        <meta property="og:description" content="Will AI replace your job? AI Job Watch breaks down the six factors that actually predict AI risk — not your job title, but how your role is structured." />
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>
      <div className="about-page">
        <div className="about-hero">
          <h1>Will AI Replace My Job?</h1>
          <p className="about-lead">
            AI Job Watch breaks down what actually determines AI risk — not your job title, but
            how your role is structured.
          </p>
        </div>

        <div className="about-section">
          <h2>The Short Answer</h2>
          <p>
            For most people, not entirely — and not soon. AI is very good at specific tasks:
            drafting text, summarizing documents, spotting patterns in data. But most jobs are a
            bundle of dozens of different tasks, and replacing a job means automating the whole
            bundle, not just the easy parts of it.
          </p>
          <p>
            What actually predicts your risk isn't your job title or your industry. It's how much
            of your role depends on judgment calls that can't be reduced to a rule, trust that
            takes years to build, accountability when something goes wrong, or being physically
            present to do the work. Two people with the same job title can have very different AI
            risk, depending on how their specific role is structured.
          </p>
        </div>

        <div className="about-section">
          <h2>What Actually Determines AI Risk</h2>
          <p>
            Research and real-world automation patterns point to the same handful of factors,
            again and again:
          </p>
          <div className="category-table">
            {factors.map((f) => (
              <div key={f.name} className="category-table-row">
                <div className="cat-table-name">{f.name}</div>
                <div className="cat-table-desc">{f.desc}</div>
              </div>
            ))}
          </div>
          <p>
            <Link to="/about">See the full scoring methodology on our About page →</Link>
          </p>
        </div>

        <div className="about-section">
          <h2>Jobs More at Risk vs. Jobs More Protected</h2>
          <p>
            No job title is automatically safe or automatically doomed, but some patterns show up
            consistently:
          </p>
          <div className="bands-grid">
            <div className="band band-high">
              <div className="band-label">MORE AT RISK</div>
              <div className="band-score">Repetitive & rules-based</div>
              <p>
                Work that's mostly single-task, follows a predictable process, and doesn't require
                anyone to be personally accountable for the outcome.
              </p>
            </div>
            <div className="band band-low">
              <div className="band-label">MORE PROTECTED</div>
              <div className="band-score">Judgment & trust-heavy</div>
              <p>
                Work that requires nuanced judgment calls, relationships built over time, physical
                presence, or accountability that can't be handed to a model.
              </p>
            </div>
          </div>
          <p>
            <Link to="/explore">See real, anonymous AI risk data by job title →</Link>
          </p>
        </div>

        <div className="about-section">
          <h2>How to Know for Your Specific Job</h2>
          <p>
            Generic advice about "safe" and "unsafe" jobs only goes so far — plenty of specific
            roles buck the trend of their broader title or industry. The only way to get a real
            answer is to look at how your actual day-to-day work breaks down across these factors.
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
