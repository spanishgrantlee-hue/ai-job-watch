import { useState, useCallback, useMemo } from 'react';
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
// Each screen's wrapper is individually memoized (useCallback) with only the
// dependencies it actually needs. This matters specifically for
// protectionPlan: it deliberately excludes hoursBudget/checklist, because
// Protection Plan is the WRITER of that state via stable setState setters,
// never a reader of the live value while it's the active screen. Including
// them as dependencies would recreate this closure on every one of
// Protection Plan's own interactions, which would hand RevealSequencer a new
// component reference for the currently-displayed screen -- React remounts
// it, wiping its local state (this is a real bug Q1 found and this fix
// addresses). learningPlan's wrapper DOES depend on hoursBudget, which is
// correct: Learning Plan needs the fresh value, and the user is never
// looking at it while Protection Plan updates that state, so recreating its
// closure there is invisible/harmless.
//
// initialChecklist passed to ProtectionPlanScreen is still a constant {}:
// nothing currently seeds it from anywhere real (no snapshot restore flow
// reaches /reveal). checklist itself IS now kept (not discarded) and threaded
// into roadmapReadyComponent, which passes it on to RoadmapReadyScreen's
// handleSave -- closing the save-time gap Q1 documented and Q3 confirmed
// live. roadmapReadyComponent safely depends on checklist (unlike
// protectionPlanComponent above) for the same reason learningPlanComponent
// safely depends on hoursBudget: the user is never looking at the closing
// screen while Protection Plan is writing this state.

const SCORED_IDS = ['Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q28'];

export default function RevealExperience() {
  const { answers } = useAnswers();
  const navigate = useNavigate();
  const [hoursBudget, setHoursBudget] = useState(null);
  const [checklist, setChecklist] = useState({});

  const hasAnswers = SCORED_IDS.some(id => answers[id] !== undefined);

  const results = useMemo(() => (hasAnswers ? calculateResults(answers) : null), [answers, hasAnswers]);
  const rankedCategories = useMemo(() => results?.rankedCategories ?? [], [results]);
  const weakestCategory = rankedCategories[rankedCategories.length - 1];
  const topProtector = results?.topProtectors?.[0] ?? rankedCategories[0];

  const welcomeComponent = useCallback((props) => <WelcomeScreen {...props} />, []);
  const scoreComponent = useCallback((props) => <ScoreScreen {...props} finalScore={results?.finalScore} riskKey={results?.riskKey} riskLabel={results?.riskLabel} />, [results]);
  const whyComponent = useCallback((props) => <WhyScreen {...props} topProtector={topProtector} />, [topProtector]);
  const strengthsComponent = useCallback((props) => <StrengthsScreen {...props} rankedCategories={rankedCategories} />, [rankedCategories]);
  const tasksChangingComponent = useCallback((props) => <TasksChangingScreen {...props} weakestCategory={weakestCategory} automationRisks={results?.automationRisks} riskKey={results?.riskKey} />, [weakestCategory, results]);
  const protectionPlanComponent = useCallback((props) => (
    <ProtectionPlanScreen
      {...props}
      rankedCategories={rankedCategories}
      onAnswerHours={setHoursBudget}
      initialChecklist={{}}
      onChecklistChange={setChecklist}
    />
  ), [rankedCategories]);
  const phaseMarkerComponent = useCallback((props) => <PhaseMarkerScreen {...props} />, []);
  const learningPlanComponent = useCallback((props) => <LearningPlanScreen {...props} weakestCategory={weakestCategory} hoursBudget={hoursBudget ?? 'mid'} />, [weakestCategory, hoursBudget]);
  const toolsComponent = useCallback((props) => <ToolsScreen {...props} weakestCategory={weakestCategory} />, [weakestCategory]);
  const workplaceMovesComponent = useCallback((props) => <WorkplaceMovesScreen {...props} weakestCategory={weakestCategory} />, [weakestCategory]);
  const certificationsComponent = useCallback((props) => <CertificationsScreen {...props} weakestCategory={weakestCategory} />, [weakestCategory]);
  const similarCareersComponent = useCallback((props) => <SimilarCareersScreen {...props} topProtector={topProtector} />, [topProtector]);
  const roadmapReadyComponent = useCallback((props) => <RoadmapReadyScreen {...props} weakestCategory={weakestCategory} results={results} checklist={checklist} />, [weakestCategory, results, checklist]);

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

  const screens = [
    { id: 'welcome', act: 1, background: 'hero', pacing: PACING.DELIBERATE, component: welcomeComponent },
    { id: 'score', act: 1, background: 'hero', pacing: PACING.DELIBERATE, component: scoreComponent },
    { id: 'why', act: 1, background: 'hero', pacing: PACING.INSTANT, component: whyComponent },
    { id: 'strengths', act: 1, background: 'hero', pacing: PACING.DELIBERATE, component: strengthsComponent },
    { id: 'tasksChanging', act: 1, background: 'hero', pacing: PACING.DELIBERATE, component: tasksChangingComponent },
    { id: 'protectionPlan', act: 2, background: 'light', pacing: PACING.DELIBERATE, component: protectionPlanComponent },
    { id: 'phaseMarker', act: 2, background: 'light', pacing: PACING.INSTANT, component: phaseMarkerComponent },
    { id: 'learningPlan', act: 2, background: 'light', pacing: PACING.DELIBERATE, component: learningPlanComponent },
    { id: 'tools', act: 2, background: 'light', pacing: PACING.DELIBERATE, component: toolsComponent },
    { id: 'workplaceMoves', act: 2, background: 'light', pacing: PACING.DELIBERATE, component: workplaceMovesComponent },
    { id: 'certifications', act: 2, background: 'light', pacing: PACING.DELIBERATE, component: certificationsComponent },
    { id: 'similarCareers', act: 3, background: 'light-distinct', pacing: PACING.DELIBERATE, component: similarCareersComponent },
    { id: 'roadmapReady', act: 3, background: 'hero', pacing: PACING.DELIBERATE, component: roadmapReadyComponent },
  ];

  return <RevealSequencer screens={screens} onComplete={() => navigate('/roadmap')} />;
}
