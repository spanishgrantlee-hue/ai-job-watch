import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// index.html's data-static-seo tags are brand-only fallbacks for crawlers and
// link previews that don't run JS. Remove them before rendering so
// react-helmet-async's per-page tags are the only title/description once the
// app runs (React 19 adds its own tags instead of reusing static ones).
document.querySelectorAll('[data-static-seo]').forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
