// Day 4 SEO pilot: static, always-indexable editorial content for select
// /jobs/:slug pages, keyed by the same slug format as job_titles.slug
// (src/utils/jobTitleMatch.js's slugify()). Deliberately separate from that
// file so this stays pure content data, not matching/normalization logic.
//
// A slug with an entry here gets this content rendered on JobStats.jsx
// regardless of whether live aggregate stats have cleared the sample-size
// gate yet (see netlify/functions/get-job-stats.js's MIN_SAMPLE_SIZE) --
// the live stats block still renders separately, whenever data exists.
// A slug with no entry here falls back to JobStats.jsx's existing
// data-only behavior, unchanged.
//
// Scoped to a single pilot job (Customer Service Representative) for Day 4.
// Do not add more entries without a deliberate decision to extend the
// pattern -- see the Day 4 plan for why this started as a single-job pilot.
export const JOB_PAGE_CONTENT = {
  'customer-service-representative': {
    jobLabel: 'Customer Service Representative',
    title: 'Will AI Replace Customer Service Jobs? | AI Job Watch',
    h1: 'Will AI Replace Customer Service Jobs?',
    metaDescription:
      "See how AI is already automating customer service work and how Customer Service Representative roles score on AI Job Watch's automation risk framework.",
    intro: [
      'Customer service is one of the first roles where AI automation is already visible in the real world, not just theoretical — chatbots and AI assistants are already handling a growing share of routine support conversations.',
      "That doesn't mean every customer service job is at equal risk. What matters is how much of a specific role is repetitive, rules-based ticket handling versus judgment-heavy problem solving, relationship building, and escalations that require a human to be personally accountable for the outcome.",
    ],
    factors: [
      { name: 'Accountability', desc: 'Routine ticket resolution rarely requires anyone to be personally on the hook — but escalations, refunds, and exceptions to policy usually do.' },
      { name: 'Trust',            desc: 'Most support interactions are with strangers, not long-term relationships, which offers less protection than trust-heavy roles.' },
      { name: 'Judgment',         desc: 'Scripted, FAQ-style answers are easy to automate; open-ended judgment calls on unusual situations are not.' },
      { name: 'Problem Solving',  desc: 'Novel problems that don’t match a known pattern still tend to get routed to a human.' },
      { name: 'Physical Presence', desc: 'Almost none of this work requires a human body to be physically present, which removes one of the strongest protective factors.' },
      { name: 'Licensing',        desc: 'Customer service typically carries no formal licensing or legal liability requirement that would shield it from automation.' },
    ],
    faqs: [
      {
        q: 'Will AI replace all customer service jobs?',
        a: 'Unlikely in full. AI is best at repetitive, scripted interactions. Escalations, complex complaints, and situations requiring empathy or judgment still tend to need a human.',
      },
      {
        q: 'Which parts of customer service are most at risk?',
        a: 'Routine, rules-based tasks — order status, FAQ answers, simple returns — are the most automatable today. Work that requires judgment calls or relationship-building is more protected.',
      },
      {
        q: 'What customer service skills are safest from AI?',
        a: 'Handling escalations, de-escalating frustrated customers, and making judgment calls on exceptions to policy are all harder for AI to fully take over than scripted responses.',
      },
    ],
  },
};
