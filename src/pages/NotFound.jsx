import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Reached only via the router's catch-all "*" route (see App.jsx), which in
// turn is only ever hit through netlify.toml's final /* -> /index.html
// fallback (status 404). Every real route has its own higher-priority
// redirect rule in netlify.toml, so this never renders for a valid path.
export default function NotFound() {
  return (
    <div className="page-wrap">
      <Helmet>
        <title>Page Not Found | AI Job Watch</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="about-page">
        <div className="about-hero">
          <h1>Page Not Found</h1>
          <p className="about-lead">
            We couldn't find the page you were looking for. It may have moved, or the link may be
            out of date.
          </p>
        </div>
        <div className="about-section">
          <p>
            <Link to="/">Go back to the homepage →</Link>
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
