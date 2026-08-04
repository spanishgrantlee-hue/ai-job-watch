import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAnswers } from '../App';
import { calculateResults } from '../utils/scoring';
import RevealSequencer from '../components/roadmap/RevealSequencer.jsx';
import { PACING } from '../components/roadmap/pacing.js';

import WelcomeScreen from '../components/roadmap/screens/WelcomeScreen.jsx';
import ScoreScreen from '../components/roadmap/screens/ScoreScreen.jsx';
import WhyScreen from '../components/roadmap/screens/WhyScreen.jsx';
import StrengthsScreen from '../components/roadmap/screens/StrengthsScreen.jsx';
import TasksChangingScreen from '../components/roadmap/screens/TasksChangingScreen.jsx';
import PhaseMarkerScreen from '../components/roadmap/screens/PhaseMarkerScreen.jsx';
import ProtectionPlanScreen from '../components/roadmap/screens/ProtectionPlanScreen.jsx';
import LearningPlanScreen from '../components/roadmap/screens/LearningPlanScreen.jsx';
import ToolsScreen from '../components/roadmap/screens/ToolsScreen.jsx';
import WorkplaceMovesScreen from '../components/roadmap/screens/WorkplaceMovesScreen.jsx';
import CertificationsScreen from '../components/roadmap/screens/CertificationsScreen.jsx';
import SimilarCareersScreen from '../components/roadmap/screens/SimilarCareersScreen.jsx';
import RoadmapReadyScreen from '../components/roadmap/screens/RoadmapReadyScreen.jsx';

// ─── Reveal Experience — the missing assembly layer ────────────────────────────
// Wires RevealSequencer (K1) + all 13 screen components (L1-N2) into a live,
// navigable route with real user data -- this integration was never a named
// task anywhere in Groups K-N, so nothing previously assembled them. Every
// screen component itself is read-only here: this file only computes shared
// data once and threads it into each screen via a small wrapper closure,
// the same "closure supplies data, component stays pure" pattern used
// conceptually since L2/L3. No changes to RevealSequencer.jsx, any screen
// component, scoring.js, playbook.js, share.js, or any roadmap/*.js file.
//
// Pacing: DELIBERATE/INSTANT were explicitly specified when three screens
// were designed (Welcome: deliberate: L1; Why: instant, per L2's note about
// the transition into Screen 2; the phase-marker beat: instant, per K4).
// Every other screen defaults to DELIBERATE -- a judgment call, not a
// previously-decided requirement, since pacing was never assigned to them.
//
// hoursBudget and the Protection Plan checklist (P5) are the two pieces of
// state that must persist ACROSS screens (Protection Plan sets hoursBudget,
// Learning Plan reads it) -- owned here, same as CareerRoadmap.jsx already
// owns them for its own rendering.

const SCORED_IDS = ['Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q28'];

export default function RevealExperience() {
  const { answers } = useAnswers();
  const navigate = useNavigate();
  const [hoursBudget, setHoursBudget] = useState(null);
  const [checklist, setChecklist] = useState({});

  const hasAnswers = SCORED_IDS.some(id => answers[id] !== undefined);

  if (!hasAnswers) {
    return (
      <div className="results-page">
        <div className="results-empty-page">
          <div className="container">
            <h1>No Results Yet</h1>
            <p>Complete the assessment first to get your AI Resistance Score.</p>
            <Link to="/assessment" className="btn-primary">Take the Assessment</Link>
          </div>
        </div>
      </div>
    );
  }

  const results = calculateResults(answers);
  const { finalScore, riskKey, riskLabel, rankedCategories, automationRisks, topProtectors } = results;
  const weakestCategory = rankedCategories[rankedCategories.length - 1];
  const topProtector = topProtectors[0] ?? rankedCategories[0];

  const screens = [
    { id: 'welcome', act: 1, background: 'hero', pacing: PACING.DELIBERATE,
      component: (props) => <WelcomeScreen {...props} /> },
    { id: 'score', act: 1, background: 'hero', pacing: PACING.DELIBERATE,
      component: (props) => <ScoreScreen {...props} finalScore={finalScore} riskKey={riskKey} riskLabel={riskLabel} /> },
    { id: 'why', act: 1, background: 'hero', pacing: PACING.INSTANT,
      component: (props) => <WhyScreen {...props} topProtector={topProtector} /> },
    { id: 'strengths', act: 1, background: 'hero', pacing: PACING.DELIBERATE,
      component: (props) => <StrengthsScreen {...props} rankedCategories={rankedCategories} /> },
    { id: 'tasksChanging', act: 1, background: 'hero', pacing: PACING.DELIBERATE,
      component: (props) => <TasksChangingScreen {...props} weakestCategory={weakestCategory} automationRisks={automationRisks} riskKey={riskKey} /> },
    { id: 'protectionPlan', act: 2, background: 'light', pacing: PACING.DELIBERATE,
      component: (props) => (
        <ProtectionPlanScreen
          {...props}
          rankedCategories={rankedCategories}
          onAnswerHours={setHoursBudget}
          initialChecklist={checklist}
          onChecklistChange={setChecklist}
        />
      ) },
    { id: 'phaseMarker', act: 2, background: 'light', pacing: PACING.INSTANT,
      component: (props) => <PhaseMarkerScreen {...props} /> },
    { id: 'learningPlan', act: 2, background: 'light', pacing: PACING.DELIBERATE,
      component: (props) => <LearningPlanScreen {...props} weakestCategory={weakestCategory} hoursBudget={hoursBudget ?? 'mid'} /> },
    { id: 'tools', act: 2, background: 'light', pacing: PACING.DELIBERATE,
      component: (props) => <ToolsScreen {...props} weakestCategory={weakestCategory} /> },
    { id: 'workplaceMoves', act: 2, background: 'light', pacing: PACING.DELIBERATE,
      component: (props) => <WorkplaceMovesScreen {...props} weakestCategory={weakestCategory} /> },
    { id: 'certifications', act: 2, background: 'light', pacing: PACING.DELIBERATE,
      component: (props) => <CertificationsScreen {...props} weakestCategory={weakestCategory} /> },
    { id: 'similarCareers', act: 3, background: 'light-distinct', pacing: PACING.DELIBERATE,
      component: (props) => <SimilarCareersScreen {...props} topProtector={topProtector} /> },
    { id: 'roadmapReady', act: 3, background: 'hero', pacing: PACING.DELIBERATE,
      component: (props) => <RoadmapReadyScreen {...props} weakestCategory={weakestCategory} results={results} /> },
  ];

  return <RevealSequencer screens={screens} onComplete={() => navigate('/roadmap')} />;
}
