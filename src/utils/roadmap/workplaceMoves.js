// ─── Workplace Moves ────────────────────────────────────────────────────────────
// Replaces V1's risk-tier-keyed RESOURCES.tips (see src/pages/Results.jsx) with a
// category-keyed dataset — two moves per category, manager-framed by default
// with a union-framed variant where it genuinely applies.

export const WORKPLACE_MOVES = {
  accountability: [
    {
      text: "This week, ask your supervisor if you can own one small process start to finish — restocking, scheduling, a specific type of customer issue, whatever's realistic. Owning one thing completely matters more than helping with ten things partway.",
      unionVariant: "If you're in a union role, check with your rep first — new responsibility can sometimes affect job classification or pay grade.",
    },
    {
      text: "This week, pick one recurring annoyance or inefficiency in your day-to-day work, and bring your supervisor not just the problem but one specific idea to fix it.",
    },
  ],

  trust: [
    {
      text: "This week, tell your manager directly about one piece of positive feedback you've gotten recently from a coworker, client, or vendor — even something small and informal. Don't wait for a review to bring it up.",
    },
    {
      text: "This week, check in with one coworker, client, or vendor you deal with regularly about something other than work — just once. Real trust is built in the moments that aren't about the task.",
    },
  ],

  judgment: [
    {
      text: "Starting today, keep a running one-line note every time you make a judgment call at work — what you decided and why. In a few months, that's real, written proof of the judgment you use every day.",
    },
    {
      text: "This week, think back over the last month and pick one good call you made that wasn't obvious from the outside. Mention it to your supervisor in one sentence — no big deal, just so it's on the record.",
    },
  ],

  problemSolving: [
    {
      text: "This week, ask your supervisor directly: \"Is there anything that keeps coming up that nobody's found a good fix for?\" Then take a shot at it.",
    },
    {
      text: "This week, think of one thing you've figured out how to do better or faster than the official way, and write it down in a sentence or two. That's the start of a track record.",
    },
  ],

  physicalPresence: [
    {
      text: "This week, ask your supervisor about cross-training on one specific piece of equipment or task outside your normal role.",
    },
    {
      text: "This week, ask your supervisor if there's a hands-on project or task coming up that needs an extra set of hands, and volunteer before they finish asking.",
    },
  ],

  licensing: [
    {
      text: "This month, look up the one most common license or certification in your field and find out exactly what it requires. You don't have to start it — just know what's involved.",
    },
    {
      text: "If you're already working toward a license or certification, mention it to your supervisor this month — it's the kind of thing that gets remembered when responsibilities, or promotions, come up.",
    },
  ],
}
