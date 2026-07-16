// ─── Career Playbook ──────────────────────────────────────────────────────────
// Action content for the Results page Career Playbook.
// Written at an 8th-grade reading level, in a coach/mentor voice.
// Levels: low (score 1–2), mid (score 3), high (score 4–5)

export function playbookLevel(score) {
  if (score <= 2) return 'low';
  if (score === 3) return 'mid';
  return 'high';
}

export const PLAYBOOK = {
  accountability: {
    context: {
      low: "Right now, most decisions at your job are made by someone above you. That's what's pulling this score down. The good news is you don't need a promotion to fix it — just one thing you can own, starting now.",
      mid: "You already make real decisions at work, but it's not the main part of your job yet. A focused push here moves your score up fast.",
      high: "People count on you to make the call — and that protects your job. The next step is widening that responsibility so it's even harder to cut.",
    },
    days30: {
      low: "Ask your supervisor if you can be responsible for one small thing at work. Maybe it's tracking supplies, or being the first call when something breaks on your shift. It doesn't have to be big. AI can complete tasks. It can't be held responsible for what happens.",
      mid: "Write down the decisions you already make at work, and why you made them. \"I chose to do X because Y.\" You're already making these calls. Writing them down makes that visible — and visible accountability leads to more of it.",
      high: "Find one place where you're already making decisions informally and make it official. Mention it at your next review or ask to have it added to your job description.",
    },
    days90: {
      low: "Step up for a small responsibility at work, even an informal one. Help train a new hire. Be the point person on one task. Organize part of your team's workflow. You don't need a title — just show that you can be trusted with something.",
      mid: "Volunteer to lead a task or project, even a minor one. When something goes wrong, be the person who handles it — not the one waiting to be told what to do. That's the position that's hardest to cut.",
      high: "Look for a team, a budget, or a project you can fully own — where your name is connected to the result, not just the work. That kind of accountability is what makes a role hard to eliminate.",
    },
    year1: {
      low: "Work toward a role where you have formal authority over something. That might mean managing a small team, signing off on decisions, or being the person responsible for a process — like a lead technician, a charge nurse, or a shift foreman. AI can do the work. It can't be held accountable for the outcome.",
      mid: "At your next review, ask for more responsibility — not just a raise. Bring examples of decisions you've owned. Accountability in your role is worth more than most pay bumps when it comes to long-term job security.",
      high: "Work toward running a function or a team — not just doing tasks inside one. Even a small team under your name changes how replaceable you are.",
    },
  },

  trust: {
    context: {
      low: "Your work is mostly transactional right now — you complete a task, hand it off, and move on. There's not a lot of personal connection in your day-to-day. Building even one strong professional relationship can move this score significantly.",
      mid: "You have solid relationships at work, but they're not yet the core of what makes you valuable. Going a little deeper with a few people is the fastest path to improving this.",
      high: "People trust you — and that's real job protection. The goal now is to make sure the right people see it and to keep building on it.",
    },
    days30: {
      low: "Pick one person you interact with regularly — a customer, a client, a coworker — and connect with them as a real person, not just a task. Remember one thing about them. Follow up on something they mentioned last time. AI can send a message. It can't build real trust.",
      mid: "Find one working relationship that's mostly professional right now and invest in it this month. One genuine conversation — where you're actually curious about the person, not just the work — changes the dynamic more than you'd think.",
      high: "Ask someone who already trusts you to introduce you to one person you should know. Trust compounds — one good relationship almost always leads to others.",
    },
    days90: {
      low: "Volunteer to be the main contact for one client, customer, or team member. You don't need a title. Just be the person who shows up, follows through, and makes people feel taken care of. Think of a nurse all the patients ask for by name — that's what you're working toward.",
      mid: "Identify two or three people who rely on you professionally and invest in those relationships over the next few months. These are the people who will speak up for you when your name comes up in a meeting you're not in.",
      high: "Build a small group — five or six people — who would honestly vouch for you. Five real relationships where there's genuine trust beat fifty casual contacts every time.",
    },
    year1: {
      low: "By the end of the year, when someone at work needs help with something specific, your name should come up. Like a contractor clients always call back. Or a cashier that regular customers wait in line for. That level of trust protects a job.",
      mid: "Look for roles where building relationships is part of the job — client services, account management, shift lead, team supervisor. These roles are hard to automate because the value is in the person, not the process.",
      high: "Work toward a point where clients or coworkers specifically request you — not just accept whoever gets assigned. If someone would push back at losing you, that's genuine job protection.",
    },
  },

  judgment: {
    context: {
      low: "Most situations you handle at work have a clear answer — a rule, a process, a script. That's what's keeping this score low. AI is very good at following clear rules. You want to get into situations where your experience and instincts matter more than the manual.",
      mid: "You use good judgment at work, but it's not yet what your role is known for. Getting your thinking into more decisions around you is the path forward.",
      high: "Your ability to read situations and make smart calls is real job protection. The next step is making sure others recognize it too.",
    },
    days30: {
      low: "Find one situation at work this week where the answer isn't obvious and write down how you'd approach it — your real thinking, not just the policy answer. You don't need to be right. You just need to start exercising that muscle. AI follows rules. It can't reason through a brand-new situation the way you can.",
      mid: "The next time a tough call is being made at work, share your take on it. Even one sentence. Getting your opinion on record is how you build a reputation for good judgment over time.",
      high: "Help someone newer than you think through a difficult situation — without just handing them the answer. Teaching someone else to reason through a problem sharpens your own judgment and signals a level of expertise that's hard to replace.",
    },
    days90: {
      low: "Ask to sit in on a meeting where real decisions are being made. Even just to observe at first. Watch how more experienced people think through hard situations — and start contributing your own take when you're ready.",
      mid: "Take ownership of one problem that doesn't have an obvious answer. A tricky customer situation. A broken process nobody's fixed. Work through it and write down your reasoning. That's exactly the kind of thinking AI still can't replicate.",
      high: "Become the go-to person for one type of hard call. A mechanic who can diagnose problems no code reader catches. A nurse who spots something the charts missed. A dispatcher who knows when to override the system. That's the target.",
    },
    year1: {
      low: "Spend the next year building real experience in one area that requires judgment to navigate — handling difficult customers, troubleshooting equipment that acts up unpredictably, or making calls on a job site when conditions change. AI can follow a checklist. It can't replace someone who has genuinely been there before.",
      mid: "Work toward being the person people think of when something doesn't fit the usual process. A foreman who knows the job site better than anyone. A technician who can diagnose what no manual covers. That kind of experience is what makes someone hard to replace.",
      high: "Consider writing down what you know — a training document, a how-to guide for your team — or officially mentoring newer workers. Putting your expertise on record makes it recognized and tied to your name.",
    },
  },

  problemSolving: {
    context: {
      low: "Right now, most situations you run into at work have a standard answer. That's what's holding this score down. The goal is to get more comfortable with the situations where no one has the answer written down yet.",
      mid: "You can handle tough situations when they come up, but problem-solving isn't the main expectation of your role yet. Pushing in that direction changes how valuable you are.",
      high: "You're already the person people turn to when something is broken. Specializing in a type of hard problem — rather than just being broadly capable — makes it your signature.",
    },
    days30: {
      low: "Pick one problem at work that keeps coming back and try to figure out why it keeps happening — not just how to fix it this time. Write down what you find. A mechanic who understands why a vehicle keeps failing is worth more than one who just patches it each time. That's the habit you're building.",
      mid: "Look for one issue at work that people have accepted as \"just how things are\" and suggest a different way to approach it. It doesn't need to be a breakthrough. The instinct to question and improve is what separates good workers from great ones.",
      high: "Take on a problem that's outside your normal area. A welder learning to troubleshoot a new robotic welding setup. A warehouse worker figuring out why the inventory software keeps giving bad results. Solving problems outside your lane is a skill most people don't have.",
    },
    days90: {
      low: "Volunteer for something at work that doesn't have a clear set of steps — where you have to figure it out as you go. A longshoreman helping figure out a new automated crane system. A truck driver rerouting when the logistics software fails. The goal isn't to be perfect. It's to get comfortable working through uncertainty.",
      mid: "Take on something where you're expected to create the solution, not just follow one. Write down your approach. That process becomes something your team can use too — which makes you more valuable, not less.",
      high: "Work toward being the person your workplace calls when something is really broken and no one knows why. A field tech who can figure out what the diagnostic software missed. An operator who can troubleshoot a machine on the fly. That reputation is hard to automate away.",
    },
    year1: {
      low: "Over the next year, build specific knowledge about a type of problem that's common in your field — not just how to fix it, but why it happens and how to catch it early. AI can look things up. It can't replace someone who has genuinely learned a problem from real experience.",
      mid: "A year from now, you want people to think of you when one specific kind of problem comes up. Build toward that in your field.",
      high: "Look for roles built around non-routine problem solving — quality control, field troubleshooting, operations, or anything where the situation changes and the right answer is rarely the same twice. Those roles are among the hardest to automate.",
    },
  },

  physicalPresence: {
    context: {
      low: "Most of what you do could happen without you being physically there — someone else could do it remotely, or software could handle it. That's what's holding this score down. Even shifting one part of your job toward hands-on work makes a real difference.",
      mid: "You show up in person for part of your job, but it's not yet the core of what makes you valuable. Leaning harder into the physical, hands-on parts of your work is the move.",
      high: "Your job requires you to be there in person — and that's real job protection. The goal is to make that presence even harder to replace.",
    },
    days30: {
      low: "Make a list of everything in your job that absolutely has to be done in person. If that list is short, that tells you something. Look for one task this week you could shift toward hands-on or on-site work. Physical presence is hard to outsource to software.",
      mid: "Pick the most hands-on part of your job and fully own it. Be the most reliable and skilled person for that task. A home health aide that patients specifically trust with their care. A technician known for hands-on precision. That's the kind of presence that protects a job.",
      high: "Show up consistently for the parts of your job that require you to be there. Being the reliable, on-site expert is a reputation that builds fast — and it's one no AI can claim.",
    },
    days90: {
      low: "Look for opportunities to take on more hands-on or on-site work. Site visits. Physical inspections. In-person training. Even a small shift in this direction changes your professional profile.",
      mid: "Make your physical role more official. Volunteer for field work, client visits, or anything that requires you to show up in person. A plumber who becomes the go-to for tricky on-site jobs. A warehouse worker trained on specialized equipment. These are positions that stick.",
      high: "Learn a skill that requires your physical presence to use. Operating a specific piece of equipment. Performing a type of hands-on inspection. Delivering a service that needs real training and real hands. The more specialized the skill, the harder you are to replace.",
    },
    year1: {
      low: "Seriously think about whether a more hands-on career is the right long-term direction. Electricians, plumbers, welders, and mechanics are in high demand right now — and they're naturally protected from automation. Healthcare workers, field technicians, and skilled tradespeople are in the same position. These jobs need a human body and experienced hands. AI doesn't have those.",
      mid: "Work toward a role where showing up in person is the whole point — and where your physical skill and experience is the main reason you're there. That's one of the safest places to be.",
      high: "Build toward a role where your physical expertise is what clients or employers are paying for — where the job simply can't be done without you being there, with your specific skills and your hands.",
    },
  },

  licensing: {
    context: {
      low: "You don't have a formal license or certification in your field right now. That's one of the most direct protections you can build — and you don't need to quit your job or go back to school full-time to do it.",
      mid: "You already have some credentials, which is good. But there's a clear next step that would make a real difference. The gap between \"some credentials\" and \"the right credential\" is worth closing.",
      high: "Your credentials are solid. Adding another one — especially a more specialized one — creates the kind of protection that slows automation down even when the technology is ready.",
    },
    days30: {
      low: "Look up the two or three certifications most valued in your field this week. Many are free or low-cost — Google Career Certificates, IBM SkillsBuild, and most trade associations offer training anyone can start. Make a short list and pick one to seriously look into.",
      mid: "Find out what the next certification level up looks like in your field. How long does it take? What does it cost? What are the steps? Getting that information takes less than an hour — and it's the first real move.",
      high: "Look into whether there's a more advanced or specialized license in your field that carries real weight. A nurse practitioner license. A master electrician's license. A certified welding inspector credential. Adding the right credential builds a stronger position.",
    },
    days90: {
      low: "Start one certification or training program. Even one hour a week gets you there. Pick based on what employers in your area actually pay more for — not what's easiest. A truck driver getting certified in logistics software. A healthcare worker completing a CNA program. That level of commitment moves the needle.",
      mid: "Finish the credential you're working toward — or start and finish one if you haven't yet. Halfway through doesn't protect your job. The completed credential does. Focus on finishing, not starting something new.",
      high: "Add a second certification in a related area. A master plumber who's also certified in green building systems. An electrician who's also licensed to work on solar installations. That combination is genuinely hard to replace — and employers know it.",
    },
    year1: {
      low: "Hold at least one recognized credential in your field by the end of the year. If your industry has a formal license — nursing, electrical, welding, teaching, real estate — understand the full path to getting it and take a real first step. Employers need someone who holds that license. AI doesn't qualify.",
      mid: "Work toward being credentialed in your main area and making real progress on a second. The goal is to have something on paper that took time to earn and can't be quickly copied. That's what creates lasting protection.",
      high: "Work toward a license or certification that employers are legally required to have on staff. A licensed electrician. A certified pesticide applicator. A licensed practical nurse. These aren't just credentials — they're legal requirements. Even when automation is technically possible, regulations slow it down. That's your protection.",
    },
  },
};
