// All questions, answer choices, and point values for the AI Job Watch assessment.
// Scores are embedded in each answer choice — the scoring engine reads choice index,
// not text, so labels can be changed here without breaking scoring.

export const sections = [
  { id: 1, title: 'About Your Job',       description: 'Tell us a little about your work. This section is not scored — it helps personalize your results.' },
  { id: 2, title: 'Task Analysis',        description: 'How your day-to-day work is structured.' },
  { id: 3, title: 'Human Interaction',    description: 'The people-driven parts of your job.' },
  { id: 4, title: 'Technology Exposure',  description: 'How much technology has already entered your work.' },
  { id: 5, title: 'Market Demand',        description: 'How hard it would be to replace what you do.' },
  { id: 6, title: 'Future Readiness',     description: 'Your adaptability and openness to change.' },
  { id: 7, title: 'In Your Own Words',    description: 'One final open question about your role.' },
]

export const questions = [

  // ─── Section 1: About Your Job (free text, not scored) ───────────────────────
  {
    id: 'Q1', section: 1, type: 'freeText',
    text: 'What is your job title?',
    placeholder: 'e.g. Registered Nurse, Project Manager, Warehouse Associate',
  },
  {
    id: 'Q2', section: 1, type: 'freeText',
    text: 'What industry do you work in?',
    placeholder: 'e.g. Healthcare, Finance, Construction, Education',
  },
  {
    id: 'Q3', section: 1, type: 'freeText',
    text: 'How many years have you worked in this field?',
    placeholder: 'e.g. 3, 12, 25',
  },
  {
    id: 'Q4', section: 1, type: 'freeText',
    text: 'What is your approximate annual income?',
    placeholder: 'e.g. $45,000',
  },
  {
    id: 'Q5', section: 1, type: 'choice',
    text: 'What level are you?',
    choices: [
      { label: 'Entry Level', scores: {} },
      { label: 'Mid-Level',   scores: {} },
      { label: 'Senior',      scores: {} },
      { label: 'Management',  scores: {} },
      { label: 'Executive',   scores: {} },
    ],
  },

  // ─── Section 2: Task Analysis ────────────────────────────────────────────────
  {
    id: 'Q6', section: 2, type: 'choice',
    text: 'How much of your job follows the same process every day?',
    choices: [
      { label: '0–20%',   scores: { aiExposure: 0 } },
      { label: '21–50%',  scores: { aiExposure: 1 } },
      { label: '51–80%',  scores: { aiExposure: 2 } },
      { label: '81–100%', scores: { aiExposure: 3 } },
    ],
  },
  {
    id: 'Q7', section: 2, type: 'choice',
    text: 'How often do you make decisions using judgment instead of rules?',
    choices: [
      { label: 'Never',     scores: { judgment: 1 } },
      { label: 'Sometimes', scores: { judgment: 2 } },
      { label: 'Often',     scores: { judgment: 4 } },
      { label: 'Daily',     scores: { judgment: 5 } },
    ],
  },
  {
    id: 'Q8', section: 2, type: 'choice',
    text: 'How much of your work involves repetitive data entry?',
    choices: [
      { label: '0–20%',   scores: { aiExposure: 0 } },
      { label: '21–50%',  scores: { aiExposure: 1 } },
      { label: '51–80%',  scores: { aiExposure: 2 } },
      { label: '81–100%', scores: { aiExposure: 3 } },
    ],
  },
  {
    id: 'Q9', section: 2, type: 'choice',
    text: 'How much of your work involves physical labor?',
    choices: [
      { label: '0–20%',   scores: { physicalPresence: 1 } },
      { label: '21–50%',  scores: { physicalPresence: 2 } },
      { label: '51–80%',  scores: { physicalPresence: 4 } },
      { label: '81–100%', scores: { physicalPresence: 5 } },
    ],
  },
  {
    id: 'Q10', section: 2, type: 'choice',
    text: 'How much of your work requires creativity?',
    choices: [
      { label: 'Never',     scores: { judgment: 1 } },
      { label: 'Rarely',    scores: { judgment: 2 } },
      { label: 'Sometimes', scores: { judgment: 3 } },
      { label: 'Often',     scores: { judgment: 4 } },
      { label: 'Always',    scores: { judgment: 5 } },
    ],
  },

  // ─── Section 3: Human Interaction ────────────────────────────────────────────
  {
    id: 'Q11', section: 3, type: 'choice',
    text: 'How much of your job requires face-to-face interaction?',
    choices: [
      { label: 'Never',     scores: { trust: 1 } },
      { label: 'Rarely',    scores: { trust: 2 } },
      { label: 'Sometimes', scores: { trust: 3 } },
      { label: 'Often',     scores: { trust: 4 } },
      { label: 'Daily',     scores: { trust: 5 } },
    ],
  },
  {
    id: 'Q12', section: 3, type: 'choice',
    text: 'How important is trust and relationship building in your job?',
    choices: [
      { label: 'Not at all', scores: { trust: 1 } },
      { label: 'A little',   scores: { trust: 2 } },
      { label: 'Moderately', scores: { trust: 3 } },
      { label: 'A lot',      scores: { trust: 4 } },
      { label: 'Entirely',   scores: { trust: 5 } },
    ],
  },
  {
    id: 'Q13', section: 3, type: 'choice',
    text: 'Do people rely on your expertise and judgment?',
    choices: [
      { label: 'Rarely',     scores: { accountability: 1, judgment: 1 } },
      { label: 'Sometimes',  scores: { accountability: 2, judgment: 2 } },
      { label: 'Often',      scores: { accountability: 3, judgment: 3 } },
      { label: 'Very often', scores: { accountability: 4, judgment: 4 } },
      { label: 'Constantly', scores: { accountability: 5, judgment: 5 } },
    ],
  },
  {
    id: 'Q14', section: 3, type: 'choice',
    text: 'How much negotiation is involved in your job?',
    choices: [
      { label: 'Never',     scores: { trust: 1 } },
      { label: 'Rarely',    scores: { trust: 2 } },
      { label: 'Sometimes', scores: { trust: 3 } },
      { label: 'Often',     scores: { trust: 4 } },
      { label: 'Daily',     scores: { trust: 5 } },
    ],
  },
  {
    id: 'Q15', section: 3, type: 'choice',
    text: "How often do you solve unique problems that don't have a clear answer?",
    choices: [
      { label: 'Never',     scores: { judgment: 1, problemSolving: 1 } },
      { label: 'Rarely',    scores: { judgment: 2, problemSolving: 2 } },
      { label: 'Sometimes', scores: { judgment: 3, problemSolving: 3 } },
      { label: 'Often',     scores: { judgment: 4, problemSolving: 4 } },
      { label: 'Daily',     scores: { judgment: 5, problemSolving: 5 } },
    ],
  },

  // ─── Section 4: Technology Exposure ──────────────────────────────────────────
  {
    id: 'Q16', section: 4, type: 'choice',
    text: 'Has AI already been introduced into your workplace?',
    choices: [
      { label: 'Not at all',  scores: { aiExposure: 0 } },
      { label: 'Slightly',    scores: { aiExposure: 1 } },
      { label: 'Moderately',  scores: { aiExposure: 2 } },
      { label: 'Heavily',     scores: { aiExposure: 3 } },
    ],
  },
  {
    id: 'Q17', section: 4, type: 'choice',
    text: 'Are software systems currently replacing parts of your work?',
    choices: [
      { label: 'Not at all',    scores: { aiExposure: 0 } },
      { label: 'Slightly',      scores: { aiExposure: 1 } },
      { label: 'Moderately',    scores: { aiExposure: 2 } },
      { label: 'Significantly', scores: { aiExposure: 3 } },
    ],
  },
  {
    id: 'Q18', section: 4, type: 'choice',
    text: 'Could your work be done remotely through a computer?',
    choices: [
      { label: 'No',        scores: { physicalPresence: 5, aiExposure: 0 } },
      { label: 'Partially', scores: { physicalPresence: 3, aiExposure: 1 } },
      { label: 'Fully',     scores: { physicalPresence: 1, aiExposure: 3 } },
    ],
  },
  {
    id: 'Q19', section: 4, type: 'choice',
    text: 'Could your work be completed using only information and knowledge?',
    choices: [
      { label: 'No',        scores: { physicalPresence: 5, aiExposure: 0 } },
      { label: 'Partially', scores: { physicalPresence: 3, aiExposure: 1 } },
      { label: 'Mostly',    scores: { physicalPresence: 2, aiExposure: 2 } },
      { label: 'Entirely',  scores: { physicalPresence: 1, aiExposure: 3 } },
    ],
  },
  {
    id: 'Q20', section: 4, type: 'choice',
    text: 'How much of your work requires physically being present?',
    choices: [
      { label: 'None',      scores: { physicalPresence: 1 } },
      { label: 'A little',  scores: { physicalPresence: 2 } },
      { label: 'Some',      scores: { physicalPresence: 3 } },
      { label: 'Most',      scores: { physicalPresence: 4 } },
      { label: 'All of it', scores: { physicalPresence: 5 } },
    ],
  },

  // ─── Section 5: Market Demand ─────────────────────────────────────────────────
  {
    id: 'Q21', section: 5, type: 'choice',
    text: 'Are employers currently struggling to find workers in your field?',
    choices: [
      { label: 'No, not really',     scores: { accountability: 1 } },
      { label: 'Somewhat',           scores: { accountability: 3 } },
      { label: 'Yes, significantly', scores: { accountability: 5 } },
    ],
  },
  {
    id: 'Q22', section: 5, type: 'choice',
    text: 'Do you need licenses, certifications, or specialized training?',
    choices: [
      { label: 'None required',          scores: { accountability: 1, licensing: 1 } },
      { label: 'Some training',          scores: { accountability: 2, licensing: 2 } },
      { label: 'Certification required', scores: { accountability: 4, licensing: 4 } },
      { label: 'Formal license required',scores: { accountability: 5, licensing: 5 } },
    ],
  },
  {
    id: 'Q23', section: 5, type: 'choice',
    text: 'How difficult would it be to replace you with a new employee?',
    choices: [
      { label: 'Very easy',      scores: { accountability: 1, aiExposure: 3 } },
      { label: 'Somewhat easy',  scores: { accountability: 2, aiExposure: 2 } },
      { label: 'Difficult',      scores: { accountability: 4, aiExposure: 1 } },
      { label: 'Very difficult', scores: { accountability: 5, aiExposure: 0 } },
    ],
  },
  {
    id: 'Q24', section: 5, type: 'choice',
    text: 'How long would it take to train a replacement?',
    choices: [
      { label: 'Less than 1 month', scores: { licensing: 1, aiExposure: 3 } },
      { label: '1–6 months',        scores: { licensing: 2, aiExposure: 2 } },
      { label: '6 months–2 years',  scores: { licensing: 4, aiExposure: 1 } },
      { label: '2+ years',          scores: { licensing: 5, aiExposure: 0 } },
    ],
  },
  {
    id: 'Q25', section: 5, type: 'choice',
    text: 'Do regulations require a human to perform critical parts of your job?',
    choices: [
      { label: 'No',          scores: { accountability: 1, licensing: 1 } },
      { label: 'Some parts',  scores: { accountability: 3, licensing: 3 } },
      { label: 'Yes, always', scores: { accountability: 5, licensing: 5 } },
    ],
  },

  // ─── Section 6: Future Readiness ─────────────────────────────────────────────
  // Q26, Q27, Q29, Q30 collected for future features — not scored in V1
  // Q28 is scored (Problem Solving)
  {
    id: 'Q26', section: 6, type: 'choice',
    text: 'How often do you actively learn new skills?',
    choices: [
      { label: 'Never',     scores: {} },
      { label: 'Rarely',    scores: {} },
      { label: 'Sometimes', scores: {} },
      { label: 'Often',     scores: {} },
      { label: 'Always',    scores: {} },
    ],
  },
  {
    id: 'Q27', section: 6, type: 'choice',
    text: 'How comfortable are you using AI tools?',
    choices: [
      { label: 'Not at all comfortable', scores: {} },
      { label: 'Slightly comfortable',   scores: {} },
      { label: 'Somewhat comfortable',   scores: {} },
      { label: 'Comfortable',            scores: {} },
      { label: 'Very comfortable',       scores: {} },
    ],
  },
  {
    id: 'Q28', section: 6, type: 'choice',
    text: 'Would you adapt your duties if technology changed your role?',
    choices: [
      { label: 'No, unlikely', scores: { problemSolving: 1 } },
      { label: 'Maybe',        scores: { problemSolving: 3 } },
      { label: 'Yes, easily',  scores: { problemSolving: 5 } },
    ],
  },
  {
    id: 'Q29', section: 6, type: 'choice',
    text: 'Would you be willing to learn a new skill for higher pay?',
    choices: [
      { label: 'Definitely not', scores: {} },
      { label: 'Probably not',   scores: {} },
      { label: 'Maybe',          scores: {} },
      { label: 'Probably yes',   scores: {} },
      { label: 'Definitely yes', scores: {} },
    ],
  },
  {
    id: 'Q30', section: 6, type: 'choice',
    text: 'Would you be willing to switch careers if necessary?',
    choices: [
      { label: 'Definitely not', scores: {} },
      { label: 'Probably not',   scores: {} },
      { label: 'Maybe',          scores: {} },
      { label: 'Probably yes',   scores: {} },
      { label: 'Definitely yes', scores: {} },
    ],
  },

  // ─── Section 7: Final Question (free text — saved for future narrative feature) ──
  {
    id: 'Q31', section: 7, type: 'freeText', multiLine: true,
    text: 'Describe your job in your own words.',
    placeholder: 'What do you do each day? What responsibilities do you have? What problems do you solve? What makes someone good at your job?',
  },
]

export function getQuestion(id) {
  return questions.find(q => q.id === id)
}

export function getQuestionsForSection(sectionId) {
  return questions.filter(q => q.section === sectionId)
}
