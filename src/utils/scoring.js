// AI Job Watch — Scoring Engine V1
// answers: { Q6: 2, Q7: 0, Q13: 3, ... } — value is the choice INDEX, not label text.
// Free-text answers are strings and do not affect scoring.

import { getQuestion } from './questions.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getScore(answers, questionId, category) {
  const q = getQuestion(questionId)
  if (!q || answers[questionId] === undefined || answers[questionId] === null) return null
  const choice = q.choices?.[answers[questionId]]
  const val = choice?.scores?.[category]
  return val !== undefined ? val : null
}

function roundAvg(values) {
  const valid = values.filter(v => v !== null && v !== undefined)
  if (valid.length === 0) return 0
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

// ─── Category formulas ────────────────────────────────────────────────────────

function calcAccountability(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q13', 'accountability'),
    getScore(answers, 'Q21', 'accountability'),
    getScore(answers, 'Q22', 'accountability'),
    getScore(answers, 'Q23', 'accountability'),
    getScore(answers, 'Q25', 'accountability'),
  ]), 1, 5)
}

function calcTrust(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q11', 'trust'),
    getScore(answers, 'Q12', 'trust'),
    getScore(answers, 'Q14', 'trust'),
  ]), 1, 5)
}

function calcJudgment(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q7',  'judgment'),
    getScore(answers, 'Q10', 'judgment'),
    getScore(answers, 'Q13', 'judgment'),
    getScore(answers, 'Q15', 'judgment'),
  ]), 1, 5)
}

function calcProblemSolving(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q15', 'problemSolving'),
    getScore(answers, 'Q28', 'problemSolving'),
  ]), 1, 5)
}

function calcPhysicalPresence(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q9',  'physicalPresence'),
    getScore(answers, 'Q18', 'physicalPresence'),
    getScore(answers, 'Q19', 'physicalPresence'),
    getScore(answers, 'Q20', 'physicalPresence'),
  ]), 1, 5)
}

function calcLicensing(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q22', 'licensing'),
    getScore(answers, 'Q24', 'licensing'),
    getScore(answers, 'Q25', 'licensing'),
  ]), 1, 5)
}

function calcAiExposurePenalty(answers) {
  return clamp(roundAvg([
    getScore(answers, 'Q6',  'aiExposure'),
    getScore(answers, 'Q8',  'aiExposure'),
    getScore(answers, 'Q16', 'aiExposure'),
    getScore(answers, 'Q17', 'aiExposure'),
    getScore(answers, 'Q18', 'aiExposure'),
    getScore(answers, 'Q19', 'aiExposure'),
    getScore(answers, 'Q23', 'aiExposure'),
    getScore(answers, 'Q24', 'aiExposure'),
  ]), 0, 5)
}

// ─── Risk thresholds ──────────────────────────────────────────────────────────

export const RISK_THRESHOLDS = {
  LOW:    { min: 24, label: 'Low Risk',    color: 'low' },
  MEDIUM: { min: 16, label: 'Medium Risk', color: 'medium' },
  HIGH:   { min: 0,  label: 'High Risk',   color: 'high' },
}

function getRiskLevel(finalScore) {
  if (finalScore >= 24) return 'LOW'
  if (finalScore >= 16) return 'MEDIUM'
  return 'HIGH'
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_META = {
  accountability: {
    label: 'Accountability',
    protectsJobWhy: 'When people rely on you personally — and regulations or employers demand a human be responsible — AI cannot step in.',
    exampleTasks: ['Decision-making authority', 'Legal or regulatory sign-off', 'Team leadership'],
  },
  trust: {
    label: 'Trust & Relationships',
    protectsJobWhy: 'Clients, patients, and colleagues build trust with a person, not a tool. Relationships are hard to automate.',
    exampleTasks: ['Client management', 'Team collaboration', 'Negotiation', 'Conflict resolution'],
  },
  judgment: {
    label: 'Human Judgment',
    protectsJobWhy: "Nuanced, context-dependent decisions that require experience and intuition remain beyond AI's reliable reach.",
    exampleTasks: ['Creative problem solving', 'Ethical decision-making', 'Ambiguous situations'],
  },
  problemSolving: {
    label: 'Problem Solving',
    protectsJobWhy: 'Novel problems with no clear playbook require human adaptability. AI handles patterns, not true novelty.',
    exampleTasks: ['Diagnosing unusual issues', 'Adapting to new conditions', 'Strategic thinking'],
  },
  physicalPresence: {
    label: 'Physical Presence',
    protectsJobWhy: 'Work that requires hands, mobility, or being physically on-site is difficult and expensive to automate fully.',
    exampleTasks: ['On-site work', 'Physical installation or repair', 'Patient care', 'Field work'],
  },
  licensing: {
    label: 'Licensing & Credentials',
    protectsJobWhy: "Formal licenses and certifications create regulatory barriers that slow down automation even when it's technically possible.",
    exampleTasks: ['Licensed professions', 'Specialized certifications', 'Legally mandated roles'],
  },
}

// ─── Automation signals ───────────────────────────────────────────────────────

export const AUTOMATION_SIGNALS = [
  {
    key: 'routine',
    label: 'Routine & Repetitive Tasks',
    description: 'A high percentage of your day follows the same process — exactly the kind of structured workflow AI handles first.',
    triggeredBy: (answers) => {
      const q6 = answers['Q6']
      return q6 !== undefined && q6 >= 2  // 51–80% or 81–100%
    },
  },
  {
    key: 'dataEntry',
    label: 'Data Entry & Reporting',
    description: 'Repetitive data entry and report generation are among the most automated tasks across every industry.',
    triggeredBy: (answers) => {
      const q8 = answers['Q8']
      return q8 !== undefined && q8 >= 2  // 51–80% or 81–100%
    },
  },
  {
    key: 'aiAlreadyHere',
    label: 'Tasks AI Is Already Replacing',
    description: 'AI tools have already arrived in your workplace, suggesting active automation pressure on your current duties.',
    triggeredBy: (answers) => {
      const q16 = answers['Q16']
      const q17 = answers['Q17']
      return (q16 !== undefined && q16 >= 2) || (q17 !== undefined && q17 >= 2)
    },
  },
  {
    key: 'remoteInfo',
    label: 'Information-Based Work',
    description: 'Work that can be done entirely through a computer using information and knowledge is highly automatable by AI systems.',
    triggeredBy: (answers) => {
      const q18 = answers['Q18']
      const q19 = answers['Q19']
      return (q18 !== undefined && q18 === 2) || (q19 !== undefined && q19 >= 2)
    },
  },
  {
    key: 'replaceability',
    label: 'Easily Transferable Tasks',
    description: 'Tasks that can be quickly learned by a new person can also be learned by an AI system.',
    triggeredBy: (answers) => {
      const q23 = answers['Q23']
      const q24 = answers['Q24']
      return (q23 !== undefined && q23 <= 1) || (q24 !== undefined && q24 <= 1)
    },
  },
]

// ─── Risk summaries ───────────────────────────────────────────────────────────

export const RISK_SUMMARIES = {
  LOW: {
    headline: 'Your job has strong natural defenses against automation.',
    body: "Your role relies heavily on the factors that are hardest for AI to replicate: human judgment, earned trust, physical presence, or formal credentials. That doesn't mean automation won't touch your work — it already is in many fields — but your core value is rooted in things AI currently can't replace. The best move now is to understand which parts of your job are most protected and lean into them.",
  },
  MEDIUM: {
    headline: 'Your job has real strengths, but some areas are worth watching.',
    body: "Your role combines tasks that AI handles easily with others that require genuine human skill. Some of your work may already be shifting, or could shift in the next few years. The good news: you have time to prepare. Focus on building the skills in your strongest categories — judgment, relationships, problem solving — and look for ways to move away from the most routine parts of your role.",
  },
  HIGH: {
    headline: 'Your current role has significant automation exposure.',
    body: "Several key factors — high routine work, low credential requirements, or work that can be done entirely through software — put your role in a vulnerable position. This doesn't mean your job disappears overnight, but it does mean action is worth taking now. Consider what unique human skills you can develop, whether there are higher-responsibility paths in your field, and whether credentials or specialization could increase your protection.",
  },
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function calculateResults(answers) {
  const accountability    = calcAccountability(answers)
  const trust             = calcTrust(answers)
  const judgment          = calcJudgment(answers)
  const problemSolving    = calcProblemSolving(answers)
  const physicalPresence  = calcPhysicalPresence(answers)
  const licensing         = calcLicensing(answers)
  const aiExposurePenalty = calcAiExposurePenalty(answers)

  const finalScore = accountability + trust + judgment + problemSolving + physicalPresence + licensing - aiExposurePenalty
  const riskKey    = getRiskLevel(finalScore)
  const categories = { accountability, trust, judgment, problemSolving, physicalPresence, licensing }

  const rankedCategories = Object.entries(categories)
    .map(([key, score]) => ({ key, score, ...CATEGORY_META[key] }))
    .sort((a, b) => b.score - a.score)

  const automationRisks = AUTOMATION_SIGNALS.filter(signal => signal.triggeredBy(answers))

  return {
    categories,
    rankedCategories,
    aiExposurePenalty,
    finalScore,
    riskKey,
    riskLabel:      RISK_THRESHOLDS[riskKey].label,
    riskColor:      RISK_THRESHOLDS[riskKey].color,
    summary:        RISK_SUMMARIES[riskKey],
    automationRisks,
    topProtectors:  rankedCategories.filter(c => c.score >= 3).slice(0, 3),
  }
}
