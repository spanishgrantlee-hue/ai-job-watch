// Score lookup tables keyed by question id and answer text

const ACCOUNTABILITY_MAP = {
  Q13: { Rarely: 1, Sometimes: 2, Often: 3, 'Very often': 4, Constantly: 5 },
  Q21: { 'No not really': 1, Somewhat: 3, 'Yes significantly': 5 },
  Q22: { 'None required': 1, 'Some training': 2, 'Certification required': 4, 'Formal license required': 5 },
  Q23: { 'Very easy': 1, 'Somewhat easy': 2, Difficult: 4, 'Very difficult': 5 },
  Q25: { No: 1, 'Some parts': 3, 'Yes always': 5 },
};

const TRUST_MAP = {
  Q11: { Never: 1, Rarely: 2, Sometimes: 3, Often: 4, Daily: 5 },
  Q12: { 'Not at all': 1, 'A little': 2, Moderately: 3, 'A lot': 4, Entirely: 5 },
  Q14: { Never: 1, Rarely: 2, Sometimes: 3, Often: 4, Daily: 5 },
};

const JUDGMENT_MAP = {
  Q7: { Never: 1, Sometimes: 2, Often: 4, Daily: 5 },
  Q10: { Never: 1, Rarely: 2, Sometimes: 3, Often: 4, Always: 5 },
  Q13: { Rarely: 1, Sometimes: 2, Often: 3, 'Very often': 4, Constantly: 5 },
  Q15: { Never: 1, Rarely: 2, Sometimes: 3, Often: 4, Daily: 5 },
};

const PROBLEM_SOLVING_MAP = {
  Q15: { Never: 1, Rarely: 2, Sometimes: 3, Often: 4, Daily: 5 },
  Q28: { 'No unlikely': 1, Maybe: 3, 'Yes easily': 5 },
};

const PHYSICAL_PRESENCE_MAP = {
  Q9: { '0-20%': 1, '21-50%': 2, '51-80%': 4, '81-100%': 5 },
  Q18: { No: 5, Partially: 3, Fully: 1 },
  Q19: { No: 5, Partially: 3, Mostly: 2, Entirely: 1 },
  Q20: { None: 1, 'A little': 2, Some: 3, Most: 4, 'All of it': 5 },
};

const LICENSING_MAP = {
  Q22: { 'None required': 1, 'Some training': 2, 'Certification required': 4, 'Formal license required': 5 },
  Q24: { 'Less than 1 month': 1, '1-6 months': 2, '6 months-2 years': 4, '2+ years': 5 },
  Q25: { No: 1, 'Some parts': 3, 'Yes always': 5 },
};

const AI_EXPOSURE_MAP = {
  Q6: { '0-20%': 0, '21-50%': 1, '51-80%': 2, '81-100%': 3 },
  Q8: { '0-20%': 0, '21-50%': 1, '51-80%': 2, '81-100%': 3 },
  Q16: { 'Not at all': 0, Slightly: 1, Moderately: 2, Heavily: 3 },
  Q17: { 'Not at all': 0, Slightly: 1, Moderately: 2, Significantly: 3 },
  Q18: { No: 0, Partially: 1, Fully: 3 },
  Q19: { No: 0, Partially: 1, Mostly: 2, Entirely: 3 },
  Q23: { 'Very easy': 3, 'Somewhat easy': 2, Difficult: 1, 'Very difficult': 0 },
  Q24: { 'Less than 1 month': 3, '1-6 months': 2, '6 months-2 years': 1, '2+ years': 0 },
};

function categoryScore(map, answers, min = 1, max = 5) {
  const scores = Object.entries(map)
    .map(([qid, valueMap]) => {
      const answer = answers[qid];
      return answer !== undefined ? valueMap[answer] : undefined;
    })
    .filter((s) => s !== undefined);

  if (scores.length === 0) return min;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.min(max, Math.max(min, Math.round(avg)));
}

export function calculateScores(answers) {
  const accountability = categoryScore(ACCOUNTABILITY_MAP, answers);
  const trust = categoryScore(TRUST_MAP, answers);
  const judgment = categoryScore(JUDGMENT_MAP, answers);
  const problemSolving = categoryScore(PROBLEM_SOLVING_MAP, answers);
  const physicalPresence = categoryScore(PHYSICAL_PRESENCE_MAP, answers);
  const licensing = categoryScore(LICENSING_MAP, answers);
  const aiExposure = categoryScore(AI_EXPOSURE_MAP, answers, 0, 5);

  const total = accountability + trust + judgment + problemSolving + physicalPresence + licensing - aiExposure;

  let riskLevel;
  if (total >= 24) riskLevel = 'LOW';
  else if (total >= 16) riskLevel = 'MEDIUM';
  else riskLevel = 'HIGH';

  return {
    categories: {
      Accountability: accountability,
      Trust: trust,
      Judgment: judgment,
      'Problem Solving': problemSolving,
      'Physical Presence': physicalPresence,
      Licensing: licensing,
    },
    aiExposure,
    total,
    riskLevel,
  };
}
