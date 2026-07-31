// ─── Learning Plan resource library ────────────────────────────────────────────
// One skill per category, broken into a this-week / this-month / ongoing
// milestone structure (mirrors the Protection Plan's 30/90/365-day cadence).
// cost/format tags let Screen 6's personalization questions (time budget,
// cost preference) filter appropriately.

export const LEARNING_RESOURCES = {
  accountability: {
    skill: "Basic project planning",
    why: "visible, documented ownership is hard to quietly automate away",
    thisWeek: { text: "watch one free intro video on project-management basics", time: "~1 hr", cost: "free" },
    thisMonth: { text: "write a one-page plan (what/when/who) for something you're already doing", time: null, cost: "free" },
    ongoing: { text: "finish the full free course", time: "~4–6 hrs", cost: "free" },
  },

  trust: {
    skill: "Active listening",
    why: "software can respond to people, it can't build an actual track record with them",
    thisWeek: { text: "watch one free short video on active-listening techniques", time: "~20–30 min", cost: "free" },
    thisMonth: { text: "practice reflecting back what someone said before responding, in three real conversations", time: null, cost: "free" },
    ongoing: { text: "a short course on building professional relationships (free via library-card LinkedIn Learning)", time: "~2–3 hrs", cost: "free" },
  },

  judgment: {
    skill: "Structured decision-making",
    why: "explaining how you make a good call makes your judgment visible, not just felt",
    thisWeek: { text: "watch one free video on a simple decision-making framework", time: "~20 min", cost: "free" },
    thisMonth: { text: "use it on paper for one real decision you're facing", time: null, cost: "free" },
    ongoing: { text: "a full course on critical thinking/decision-making", time: "~3–5 hrs", cost: "free" },
  },

  problemSolving: {
    skill: "Structured problem-solving",
    why: "AI handles familiar patterns; a repeatable process for genuinely new problems is what sets you apart",
    thisWeek: { text: "watch a free intro video on design thinking or root-cause analysis", time: "~30 min", cost: "free" },
    thisMonth: { text: "apply the framework to one real, messy problem and write down the steps", time: null, cost: "free" },
    ongoing: { text: "a free design-thinking intro course", time: "~4 hrs", cost: "free" },
  },

  physicalPresence: {
    skill: "Broader hands-on certification",
    why: "the wider your certified hands-on range, the harder it is for one tool or machine to replace your whole role",
    thisWeek: { text: "look up one free OSHA outreach safety module for your industry", time: "~1 hr", cost: "free" },
    thisMonth: { text: "complete it, and ask about cross-training on a related task (see Workplace Moves)", time: null, cost: "free" },
    ongoing: { text: "Red Cross First Aid/CPR certification (in person)", time: "~1 day", cost: "low-cost" },
  },

  licensing: {
    skill: "Mapping your field's credential path",
    why: "a formal license/certification is one of the few protections regulation makes structurally hard to automate away",
    thisWeek: { text: "look up your state licensing board or field's certifying body and find the exact requirements for the closest credential", time: null, cost: "free" },
    thisMonth: { text: "request free practice materials and take one practice test", time: null, cost: "free" },
    ongoing: { text: "start the actual coursework (via IBM SkillsBuild)", time: "varies", cost: "free" },
  },
}
