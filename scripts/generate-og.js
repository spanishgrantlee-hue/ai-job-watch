// Generates OG images for all four variants: default, high, medium, low.
// Run with: node scripts/generate-og.js
// Output: public/og-default.png, public/og-high.png, public/og-medium.png, public/og-low.png
//
// Design tokens — match src/index.css exactly:
//   --clr-hero:   #0A2540   dark navy background
//   --accent:     #2563eb   blue accent
//   --clr-low:    #0A7A4B   green
//   --clr-medium: #9A5700   amber
//   --clr-high:   #C0392B   red

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC   = resolve(__dirname, '../public');

mkdirSync(PUBLIC, { recursive: true });

// ─── Shared layout helpers ────────────────────────────────────────────────────

function wrap(inner) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#0D2847"/>
      <stop offset="100%" stop-color="#081829"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  ${inner}

  <!-- Bottom divider -->
  <line x1="72" y1="535" x2="1128" y2="535" stroke="#1a3050" stroke-width="1"/>

  <!-- Footer: URL -->
  <text x="72" y="574" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="19" font-weight="500" fill="#2563eb">aijobwatch.org</text>
</svg>`;
}

function badge(text) {
  return `
  <rect x="72" y="142" width="${text.length * 9 + 28}" height="32" rx="6"
        fill="#2563eb" fill-opacity="0.18"/>
  <text x="86" y="163" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="13" font-weight="700" fill="#60a5fa" letter-spacing="1.2">${text}</text>`;
}

function riskBar() {
  return `
  <!-- Risk range bar -->
  <rect x="72" y="432" width="620" height="13" rx="6.5" fill="#0f2340"/>
  <rect x="72"  y="432" width="207" height="13" rx="6.5" fill="#C0392B" fill-opacity="0.85"/>
  <rect x="279" y="432" width="165" height="13"           fill="#9A5700" fill-opacity="0.85"/>
  <rect x="444" y="432" width="248" height="13" rx="6.5"  fill="#0A7A4B" fill-opacity="0.85"/>
  <text x="72"  y="457" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="12" fill="#52647a">HIGH RISK</text>
  <text x="362" y="457" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="12" fill="#52647a" text-anchor="middle">MEDIUM</text>
  <text x="692" y="457" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="12" fill="#52647a" text-anchor="end">LOW RISK</text>`;
}

// ─── B1: Default (generic / home page) ───────────────────────────────────────

const svgDefault = wrap(`
  <!-- Left accent bar -->
  <rect x="0" y="0" width="6" height="630" fill="#2563eb"/>

  ${badge('AI DISRUPTION TOOL')}

  <!-- Title -->
  <text x="72" y="258" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="74" font-weight="800" fill="#f8fafc" letter-spacing="-1">AI Job Watch</text>

  <!-- Tagline -->
  <text x="72" y="318" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="400" fill="#94a3b8">Is your job safe from AI?</text>

  <!-- Sub-description -->
  <text x="72" y="370" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="20" fill="#52647a">30 questions · instant score · no account needed</text>

  ${riskBar()}

  <!-- Right: score circle -->
  <circle cx="968" cy="272" r="148" fill="#0f2340" fill-opacity="0.6"/>
  <circle cx="968" cy="272" r="148" fill="none" stroke="#2563eb" stroke-opacity="0.18" stroke-width="1.5"/>
  <text x="968" y="228" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="18" fill="#52647a" text-anchor="middle" letter-spacing="2">YOUR SCORE</text>
  <text x="968" y="316" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="96" font-weight="800" fill="#2563eb" fill-opacity="0.25" text-anchor="middle">?</text>
  <text x="968" y="356" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="16" fill="#52647a" text-anchor="middle">out of 30</text>

  <!-- CTA button -->
  <rect x="820" y="548" width="308" height="48" rx="24" fill="#2563eb"/>
  <text x="974" y="579" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">Start Free Assessment</text>
`);

// ─── B2: High Risk ───────────────────────────────────────────────────────────

const svgHigh = wrap(`
  <!-- Left accent bar — red -->
  <rect x="0" y="0" width="6" height="630" fill="#C0392B"/>

  <!-- Badge -->
  <rect x="72" y="142" width="152" height="32" rx="6"
        fill="#C0392B" fill-opacity="0.18"/>
  <text x="86" y="163" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="13" font-weight="700" fill="#e87570" letter-spacing="1.2">HIGH RISK</text>

  <!-- Title -->
  <text x="72" y="258" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="74" font-weight="800" fill="#f8fafc" letter-spacing="-1">AI Job Watch</text>

  <!-- Tagline -->
  <text x="72" y="318" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="400" fill="#94a3b8">High Automation Risk Detected</text>

  <!-- Sub-description -->
  <text x="72" y="370" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="20" fill="#52647a">Your role has significant AI exposure. See your full breakdown.</text>

  ${riskBar()}

  <!-- Marker triangle over HIGH zone -->
  <polygon points="175,428 185,416 165,416" fill="#C0392B"/>

  <!-- Right: risk circle — red -->
  <circle cx="968" cy="272" r="148" fill="#C0392B" fill-opacity="0.08"/>
  <circle cx="968" cy="272" r="148" fill="none" stroke="#C0392B" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="968" y="234" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="80" font-weight="800" fill="#C0392B" fill-opacity="0.7" text-anchor="middle">HIGH</text>
  <text x="968" y="298" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="700" fill="#C0392B" fill-opacity="0.5" text-anchor="middle">RISK</text>
  <text x="968" y="348" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="15" fill="#52647a" text-anchor="middle">Score range: 0 – 15</text>

  <!-- CTA button — red -->
  <rect x="820" y="548" width="308" height="48" rx="24" fill="#C0392B"/>
  <text x="974" y="579" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">See Your Full Breakdown</text>
`);

// ─── B3: Medium Risk ─────────────────────────────────────────────────────────

const svgMedium = wrap(`
  <!-- Left accent bar — amber -->
  <rect x="0" y="0" width="6" height="630" fill="#9A5700"/>

  <!-- Badge -->
  <rect x="72" y="142" width="178" height="32" rx="6"
        fill="#9A5700" fill-opacity="0.18"/>
  <text x="86" y="163" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="13" font-weight="700" fill="#d4930a" letter-spacing="1.2">MEDIUM RISK</text>

  <!-- Title -->
  <text x="72" y="258" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="74" font-weight="800" fill="#f8fafc" letter-spacing="-1">AI Job Watch</text>

  <!-- Tagline -->
  <text x="72" y="318" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="400" fill="#94a3b8">Medium Automation Risk Detected</text>

  <!-- Sub-description -->
  <text x="72" y="370" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="20" fill="#52647a">Some parts of your role are vulnerable. See where to focus.</text>

  ${riskBar()}

  <!-- Marker triangle over MEDIUM zone — center x≈361 -->
  <polygon points="361,428 371,416 351,416" fill="#9A5700"/>

  <!-- Right: risk circle — amber -->
  <circle cx="968" cy="272" r="148" fill="#9A5700" fill-opacity="0.08"/>
  <circle cx="968" cy="272" r="148" fill="none" stroke="#9A5700" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="968" y="224" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="58" font-weight="800" fill="#9A5700" fill-opacity="0.7" text-anchor="middle">MEDIUM</text>
  <text x="968" y="298" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="700" fill="#9A5700" fill-opacity="0.5" text-anchor="middle">RISK</text>
  <text x="968" y="348" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="15" fill="#52647a" text-anchor="middle">Score range: 16 – 23</text>

  <!-- CTA button — amber -->
  <rect x="820" y="548" width="308" height="48" rx="24" fill="#9A5700"/>
  <text x="974" y="579" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">See Your Full Breakdown</text>
`);

// ─── B4: Low Risk ────────────────────────────────────────────────────────────

const svgLow = wrap(`
  <!-- Left accent bar — green -->
  <rect x="0" y="0" width="6" height="630" fill="#0A7A4B"/>

  <!-- Badge -->
  <rect x="72" y="142" width="148" height="32" rx="6"
        fill="#0A7A4B" fill-opacity="0.18"/>
  <text x="86" y="163" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="13" font-weight="700" fill="#34c984" letter-spacing="1.2">LOW RISK</text>

  <!-- Title -->
  <text x="72" y="258" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="74" font-weight="800" fill="#f8fafc" letter-spacing="-1">AI Job Watch</text>

  <!-- Tagline -->
  <text x="72" y="318" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="400" fill="#94a3b8">Strong AI Resistance Detected</text>

  <!-- Sub-description -->
  <text x="72" y="370" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="20" fill="#52647a">Your role has strong natural defenses. See your full breakdown.</text>

  ${riskBar()}

  <!-- Marker triangle over LOW zone — center x≈568 -->
  <polygon points="568,428 578,416 558,416" fill="#0A7A4B"/>

  <!-- Right: risk circle — green -->
  <circle cx="968" cy="272" r="148" fill="#0A7A4B" fill-opacity="0.08"/>
  <circle cx="968" cy="272" r="148" fill="none" stroke="#0A7A4B" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="968" y="234" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="80" font-weight="800" fill="#0A7A4B" fill-opacity="0.7" text-anchor="middle">LOW</text>
  <text x="968" y="298" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="32" font-weight="700" fill="#0A7A4B" fill-opacity="0.5" text-anchor="middle">RISK</text>
  <text x="968" y="348" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="15" fill="#52647a" text-anchor="middle">Score range: 24 – 30</text>

  <!-- CTA button — green -->
  <rect x="820" y="548" width="308" height="48" rx="24" fill="#0A7A4B"/>
  <text x="974" y="579" font-family="system-ui,-apple-system,Segoe UI,sans-serif"
        font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">See Your Full Breakdown</text>
`);

// ─── Render helper ────────────────────────────────────────────────────────────

function render(svg, filename) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'original' } });
  const png   = resvg.render().asPng();
  const path  = resolve(PUBLIC, filename);
  writeFileSync(path, png);
  console.log(`✓ public/${filename}  (${(png.length / 1024).toFixed(1)} KB)`);
}

render(svgDefault, 'og-default.png');
render(svgHigh,    'og-high.png');
render(svgMedium,  'og-medium.png');
render(svgLow,     'og-low.png');
