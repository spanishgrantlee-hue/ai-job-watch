// ─── Career Playbook ──────────────────────────────────────────────────────────
// Per-category, per-level action content for the Results page Career Playbook.
// Levels are derived from the raw category score: low 1-2, mid 3, high 4-5.

export function playbookLevel(score) {
  if (score <= 2) return 'low';
  if (score === 3) return 'mid';
  return 'high';
}

export const PLAYBOOK = {
  accountability: {
    context: {
      low: "Your role doesn't put you in the decision seat very often — and that's the main thing holding this score down. The good news is accountability can be built deliberately, even before a promotion.",
      mid: "You carry real responsibility at work, but it's not yet the defining feature of your role. A focused push here makes a significant difference to your score — and your career trajectory.",
      high: "Accountability is already a genuine strength. The next step is making sure the right people can see it — and expanding the scope of what you're responsible for.",
    },
    days30: {
      low: "Find one decision you currently just report on and ask to own it instead. It doesn't have to be big — even a small call with your name on it starts building the habit and the record.",
      mid: "Start writing down the calls you already make, and why. 'I decided X because Y.' Making invisible accountability visible is the first step to getting more of it.",
      high: "Identify one area where your accountability is informal and make it official. Bring it up in your next review, get it into your job description, put it on record.",
    },
    days90: {
      low: "Volunteer to lead one small project, even informally. Your goal is simple: be the person people come to when something goes wrong — on at least one thing.",
      mid: "Step into a project lead role, even a minor one. The title matters less than the reality of being the go-to person when a decision needs to be made.",
      high: "Look for a team, budget, or outcome you can formally own. The more your name is attached to a result — good or bad — the stronger this protection becomes.",
    },
    year1: {
      low: "Target a role change or title update that gives you formal authority: signing off on something, managing people, or being the person legally responsible for an outcome. This is the single biggest lever in this category.",
      mid: "Build the case for expanded responsibility at your next review. Document what you've owned this year and make a clear ask — more accountability rarely comes without asking.",
      high: "Position yourself as the person responsible for a function, not just tasks. Even a small team under your name changes how automation can impact your role.",
    },
  },

  trust: {
    context: {
      low: "Your work is mostly transactional right now — there are limited sustained relationships where someone depends on you personally. Building even one strong professional relationship can shift this score significantly.",
      mid: "You have solid working relationships, but they're not the core of what makes you valuable yet. Going deeper with a few key people is the move.",
      high: "Trust is already a real protection. The goal now is to make it visible — and to build a small number of relationships that would genuinely advocate for you.",
    },
    days30: {
      low: "Identify one client, customer, or colleague you interact with regularly and go one level deeper. Remember something specific about them, follow up on something they mentioned — make one interaction personal instead of transactional.",
      mid: "Find one relationship that's currently just functional and invest in it this month. One real conversation where you're curious about them — not just the task — changes the dynamic.",
      high: "Ask someone who already trusts you for an introduction to someone you should know. Trust compounds — one strong relationship almost always leads to others.",
    },
    days90: {
      low: "Volunteer to be the main point of contact for one client or stakeholder. You don't need a title for this — just be the person who shows up consistently and follows through.",
      mid: "Identify two or three people who rely on you professionally and invest in those relationships deliberately over the next three months. These people become your references, advocates, and safety net.",
      high: "Build a small but strong network of people who would speak up for you in a room you're not in. Five real relationships beat fifty LinkedIn connections every time.",
    },
    year1: {
      low: "Set a concrete goal: by end of year, your name should come up when someone asks 'who should we call?' for at least one specific thing. That's the bar — be the trusted person for something.",
      mid: "Work toward a role where relationship management is explicit in what you do, even if it's not yet in your title. Client success, account management, or team lead — these roles signal that trust is your domain.",
      high: "Be known as someone clients or colleagues specifically request — not just accept. If someone would push back at losing you, that's genuine job protection.",
    },
  },

  judgment: {
    context: {
      low: "Most of your work follows a clear script right now — there's limited room for your own read on situations. The opportunity is to start making your judgment visible, even in small ways.",
      mid: "You use good judgment, but it's not what your role is known for yet. Getting your perspective into more decisions is the path forward.",
      high: "Judgment is already a real differentiator. The next step is formalizing that reputation so it's attached to your name, not just your current role.",
    },
    days30: {
      low: "Find one situation at work this week where the answer isn't in the manual, and write down how you'd approach it — your actual reasoning, not the policy answer. Start making your judgment visible, even just to yourself.",
      mid: "The next time a judgment call is being made in a meeting, put your read on the table. Even one sentence. Getting your perspective on record is how reputations for good judgment get built.",
      high: "Start mentoring someone more junior. Teaching judgment is one of the most powerful ways to deepen your own — and it signals expertise that's hard to dismiss.",
    },
    days90: {
      low: "Ask to sit in on a decision-making meeting, even as an observer at first. Watch how experienced people reason through ambiguous situations — and start contributing your own take when you have one.",
      mid: "Take ownership of one genuinely ambiguous problem — not a task with clear steps, but something where you have to figure it out. Document your reasoning, not just your answer.",
      high: "Build a reputation for a specific type of hard call — the one your team comes to you for when the situation doesn't fit the standard answer. The more specific, the stronger the protection.",
    },
    year1: {
      low: "Develop real expertise in one area that requires experience to navigate well — industry regulations, complex client situations, technical edge cases. AI can follow rules. You need to handle the exceptions.",
      mid: "Become the person people think of when something doesn't fit the playbook. Build toward that in your specific field, industry, or function.",
      high: "Formalize your expertise — write about it, teach it, or earn a title that reflects it. 'The person who knows what to do when it gets complicated' is one of the safest positions in any workplace.",
    },
  },

  problemSolving: {
    context: {
      low: "Your role deals mostly with situations that have established answers — not much room yet for tackling genuinely novel problems. That's what's keeping this score down, and it's something you can change from inside your current job.",
      mid: "You can handle complexity when it comes up, but problem-solving isn't the main expectation of your role yet. Moving toward that changes your position significantly.",
      high: "Problem solving is already a differentiator. Specializing in a type of hard problem — rather than just being broadly capable — makes it your signature.",
    },
    days30: {
      low: "Pick one recurring problem at work and go upstream — instead of fixing the symptom, try to understand why it keeps happening. Write up what you find. This is the core habit that builds this score.",
      mid: "Look for a problem your team has written off as 'just the way things are' and propose a fresh angle. It doesn't need to be a breakthrough — the instinct to question the default is what matters here.",
      high: "Take on a problem outside your normal domain and work on it anyway. Cross-domain problem solving is rare and genuinely hard to replicate.",
    },
    days90: {
      low: "Volunteer for a project that doesn't have a clear playbook — one where you're figuring it out as you go. The goal isn't to solve it perfectly. It's to build the habit of navigating uncertainty without a script.",
      mid: "Take on a stretch assignment where you're expected to create the approach, not just follow one. Document your process so it becomes repeatable — for you and for your team.",
      high: "Become the person your organization calls when something is broken and no one knows why. That reputation is worth more than any job title.",
    },
    year1: {
      low: "Build specific expertise in diagnosing a type of problem — operational failures, people issues, technical breakdowns — whatever fits your field. AI handles patterns well. It still struggles with genuine novelty. Be the one who handles novel.",
      mid: "A year from now, you want a track record of solving things others couldn't. Position yourself as a specialist in a specific kind of hard situation.",
      high: "Look for roles explicitly built around non-routine problem solving — strategy, operations, product, or anything where the job description shifts with the problem you're working on.",
    },
  },

  physicalPresence: {
    context: {
      low: "Most of what you do could theoretically happen remotely or digitally right now — that's what's holding this score down. Even a partial shift toward hands-on or on-site work makes a meaningful difference.",
      mid: "Physical presence is part of your role, but it's not yet central to how your value is defined. Leaning into the on-site, hands-on parts of your work is the move.",
      high: "Physical presence is already a real protection. The goal is to make it your signature — and to build skills that require your presence to use.",
    },
    days30: {
      low: "Map out which parts of your job could only happen in person or on-site. If that list is short, that's the information you needed — look for one way to expand it.",
      mid: "Take on at least one task this month that requires you to be physically present or hands-on. Make it a regular part of your role, not a one-time thing.",
      high: "Make consistency your edge — be the reliable on-site person who shows up and handles what needs handling. That reputation builds faster than most people think.",
    },
    days90: {
      low: "Find on-site, hands-on, or physically present aspects of your work you could own — inspections, site visits, in-person training, direct service delivery. Even shifting one responsibility in that direction starts changing your profile.",
      mid: "Formalize your on-site role. Volunteer for field work, client visits, or anything that requires you to be there in person. Make it part of your professional identity, not just a task you do occasionally.",
      high: "Build skills that require your physical presence to use — equipment operation, hands-on assessment, physical care, on-site work. The more specialized, the harder to replace.",
    },
    year1: {
      low: "Honestly assess whether a more inherently physical role is the right long-term move — field technician, on-site consultant, skilled trades, healthcare, direct service. These roles have natural protection that remote or digital work simply can't match.",
      mid: "Position yourself in a role where being on-site is non-negotiable and you're the recognized expert. Specialized physical roles are among the hardest to fully automate.",
      high: "Build toward a role where physical expertise is your primary value — where the work literally can't happen without you being there, in person, with your specific skills.",
    },
  },

  licensing: {
    context: {
      low: "You don't have formal credentials protecting your role right now — and that's one of the most direct, actionable protections you can build. It doesn't require a career change, just a commitment.",
      mid: "You have credentials, but there's a clear next step that would meaningfully strengthen your position. The gap between 'some credentials' and 'the right credential' is worth closing.",
      high: "Your credentials are solid. The next move is adding a specialized or higher-level credential that creates a regulatory barrier — the kind that slows automation down even when the technology is ready.",
    },
    days30: {
      low: "Research the two or three credentials most valued in your industry this week. Free options exist for almost every field — Google Career Certificates, IBM SkillsBuild, industry associations. Make a shortlist and pick one.",
      mid: "Identify the next certification level above where you are. Find out exactly what it takes — time, cost, prerequisites — and make a decision about whether to pursue it.",
      high: "Look into specialized credentials or licenses in your field that carry more regulatory weight than what you currently have. Stacking credentials in the right order compounds protection significantly.",
    },
    days90: {
      low: "Start one certification program — even one hour per week moves you forward. Pick based on job market demand in your area, not on what's easiest. Commit to finishing it.",
      mid: "Complete or significantly advance one credential. Halfway done doesn't count — employers and licensing bodies care about the finished credential. Prioritize finishing over starting something new.",
      high: "Add a second credential in a complementary area. Multi-credentialed specialists in adjacent domains are genuinely hard to replace — the combination is often what creates the moat.",
    },
    year1: {
      low: "Hold at least one recognized credential by end of year. If your field has a formal license — nursing, law, engineering, teaching, real estate — understand the full path and take the first concrete step toward it.",
      mid: "Be credentialed in your primary area and making real progress on a second. The goal is to have something on paper that took years to earn and can't be replicated quickly — that's the real protection.",
      high: "Pursue a license or credential with a legal or regulatory function — one that organizations must have a credentialed person to operate. That kind of barrier is the strongest protection in the system.",
    },
  },
};
