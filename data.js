// data.js — All script content lives here. Edit freely.
// Double-click any card in the app to edit inline too.

const SCRIPT_DATA = {
  steps: [
    {
      id: 'intent',
      label: 'Intentionality',
      section: 'Fast filter',
      cards: [
        { type: 'ask', text: '[name], what made you apply for this role specifically — what caught your attention?' },
        { type: 'note', text: 'Listening for two things: did [name] mention <b>public adjusting or this specific role by name</b>, and can they explain <b>why this direction</b> rather than something else.' },
        { type: 'listen', text: '<b>Intentional:</b> Names the company, the role, or the field. Knows what a public adjuster does. Applied to <b>similar roles in the same space</b> — still counts.<br><b>Spray and pray:</b> "I\'ve been applying to a lot of things" — <b>can\'t say why this over others</b>.' },
      ],
      choices: [
        { key: 'intent', question: 'How did they answer?', options: [{ val: 'intentional', label: 'Intentional', color: 'green' }, { val: 'spray', label: 'Spray and pray', color: 'red' }] },
      ],
      exits: {
        spray: '[name], we\'re specifically looking for people who\'ve researched this space and are moving toward it with a clear reason — it makes a big difference in how people handle the role long-term. I don\'t think this is the right timing.',
      }
    },
    {
      id: 'background',
      label: 'Background read',
      section: 'Fast filter',
      cards: [
        { type: 'ask', text: '[name], walk me through your most recent role — what you were doing day to day and how long you were there.' },
        { type: 'ask', text: 'What did you enjoy most about it?' },
        { type: 'ask', text: 'What parts did you find most challenging?' },
        { type: 'ask', text: 'And what eventually led you to move on?' },
        { type: 'listen', text: '<b>Applicable:</b> field work, roofing, inspection, insurance, property-related, client-facing outdoors.<br><b>Red flags:</b> <b>blame-heavy</b>, vague with no ownership, <b>dismissive of former team or manager</b>. How [name] talks about people tells you more than the role itself.' },
      ],
      choices: [
        { key: 'exp', question: 'Applicable experience?', options: [{ val: 'yes', label: 'Field / inspection / roofing', color: 'green' }, { val: 'partial', label: 'Partial — some transferable', color: 'amber' }, { val: 'no', label: 'No relevant background', color: 'red' }] },
      ],
      exits: {
        no: '[name], this role requires you to be field-ready from day one — rooftops, ladders, inspections under pressure. Without a background that gets you close to that, the ramp-up is too steep for where we are right now. I don\'t want to set you up for a tough situation.',
      },
      partialNote: 'Partial track: Continue — but pay closer attention in <b>Field Readiness</b> (how physical are they really?) and <b>Learning Speed</b> (can they close the gap fast without hand-holding?). Those two sections carry more weight for [name].'
    },
    {
      id: 'gap',
      label: 'Gap & motivation',
      section: 'Fast filter',
      cards: [
        { type: 'ask', text: '[name], what\'s not working anymore — what actually made you start looking?' },
        { type: 'rule', text: 'Mirror back exactly what [name] said. <b>Repeat their key words — don\'t paraphrase.</b> This prompts them to go deeper on their own.' },
      ],
      choices: [
        { key: 'gap', question: 'Is the pain clear and specific?', options: [{ val: 'clear', label: 'Clear — real specific pain', color: 'green' }, { val: 'vague', label: 'Vague — nothing urgent', color: 'amber' }] },
      ],
      vagueFollowup: {
        choices: [{ key: 'leavingReason', question: 'What\'s driving the move?', options: [{ val: 'financial', label: 'Financial', color: 'blue' }, { val: 'growth', label: 'Growth', color: 'blue' }, { val: 'environment', label: 'Environment / challenge', color: 'blue' }, { val: 'unclear', label: 'No real reason', color: 'red' }] }],
        exits: { unclear: '[name], if you can\'t name what\'s not working yet, this role is going to feel like a gamble — and that\'s not fair to you. Take some time to get clear on what you\'re actually moving toward. If that becomes clear, feel free to reach back out.' },
        financial: {
          cards: [
            { type: 'ask', text: '[name], what specifically about your income right now isn\'t working?' },
            { type: 'listen', text: 'You know pain when you hear it. <b>Real pain = specific.</b> Vague = not hungry enough yet.' },
          ],
          choices: [{ key: 'finPain', question: 'Can they name it specifically?', options: [{ val: 'yes', label: 'Yes — specific', color: 'green' }, { val: 'no', label: 'No — vague', color: 'red' }] }],
          exits: { no: '[name], if the urgency isn\'t there yet, this role is going to feel optional — and optional doesn\'t work here. Let\'s pause for now.' },
          urgency: {
            cards: [{ type: 'ask', text: 'Does this need to change now — or is next month okay?' }],
            choices: [{ key: 'urgency', question: 'Urgency?', options: [{ val: 'now', label: 'Needs to change now', color: 'green' }, { val: 'later', label: 'Eventually / not urgent', color: 'red' }] }],
            exits: { later: '[name], if the timing isn\'t urgent, this role is going to be hard to stay committed to when things get tough. I\'d rather you come back when it matters. Let\'s pause here.' }
          }
        },
        growth: {
          cards: [
            { type: 'ask', text: '[name], how did you realize you weren\'t growing in your current role?' },
            { type: 'ask', text: 'What is it specifically that you want to learn or develop moving forward?' },
            { type: 'ask', text: 'And why is that important to you — for your career long term?' },
            { type: 'listen', text: '<b>Real ceiling = specific moment or realization.</b> "I just feel like I could do more" = aspirational, not structural. You need a <b>named gap</b> and a <b>named direction</b>.' },
          ]
        },
        environment: {
          cards: [
            { type: 'ask', text: '[name], what about your current role feels too easy or not really pushing you anymore?' },
            { type: 'ask', text: 'When was the last time you put yourself into something uncomfortable — not because you had to, but because you chose to?' },
            { type: 'listen', text: '<b>Boredom = passive</b> (stopped engaging). <b>Outgrown = active</b> (pushed as far as the role allows and hit the wall). Very different people.' },
          ]
        }
      }
    },
    {
      id: 'personality',
      label: 'Personality screen',
      section: 'Fast filter',
      rated: true,
      cards: [
        { type: 'note', text: '<b>How to introduce this section:</b> "This position is very relationship-driven — you\'re meeting homeowners and insurance adjusters, inspecting properties, and advocating for the client. So I\'m going to throw a few situations at you just to understand your natural communication style."<br><br>Don\'t lead with "you\'ll deal with difficult adjusters who deny you and you\'ll have to fight them" — that just sounds miserable. Frame it as people skills + problem-solving + advocacy, because that\'s actually what you\'re screening for.' },
        { type: 'say', text: 'You don\'t need experience in insurance to answer these. I\'m more interested in how you naturally communicate and handle different personalities.' },
        { type: 'ask', text: '[name], you\'re meeting someone for the first time and you know you\'ll need to work together to accomplish something. How do you normally approach that person?' },
        { type: 'listen', text: '<b>Rapport:</b> Are they naturally personable? Do they build relationships easily — or are they very transactional?' },
        { type: 'note', text: 'Give context before the next one — say this first: "A big part of this role is advocating for the homeowner. There may be times when you see something differently from the insurance adjuster."' },
        { type: 'ask', text: 'If someone you\'re working with tells you no, but you genuinely believe you have a strong case, how do you usually handle that, [name]?' },
        { type: 'rule', text: 'Then casually push back: <i>"What if they\'re pretty firm about their answer?"</i> This is testing persistence and assertiveness — no insurance knowledge required. <b>This is the most important scenario in the screen.</b>' },
        { type: 'listen', text: '<b>Pushback:</b> Watch whether they hold their position calmly under the second push, or fold the moment there\'s resistance — versus getting defensive or aggressive.' },
        { type: 'ask', text: 'Let\'s say you\'re working with someone who\'s very short with you and clearly doesn\'t want much conversation. You\'re naturally trying to build a working relationship with them. How would you approach that personality, [name]?' },
        { type: 'listen', text: '<b>Reading people / adaptability:</b> Can they read people? Do they adapt — or expect everyone to communicate the way they do?' },
        { type: 'ask', text: 'Let\'s say you\'re feeling pretty confident about how you handled something, but afterward your manager tells you they want you to approach it completely differently next time. How would you take that?' },
        { type: 'listen', text: '<b>Coachability:</b> Watching for humility, defensiveness, curiosity, and willingness to change.' },
        { type: 'note', text: 'Don\'t fully sanitize the difficulty — a little self-selection is good. If [name] hears "sometimes you\'ll need to respectfully stand your ground when an adjuster disagrees with you" and immediately thinks "I don\'t want to do that," that\'s useful information, not a bad outcome.' },
      ],
      expCards: [
        { type: 'ask', text: 'For experienced candidates — push one step further on whichever scenario landed hardest: "Tell me about an actual time this happened with an adjuster or homeowner — walk me through it."' },
      ],
      noExpCards: [
        { type: 'note', text: 'For candidates without adjusting experience — same competency, hypothetical framing only. Keep it as "How would you handle that?" rather than asking for a real example.' },
      ],
      exitScript: '[name], this role means holding your ground diplomatically when someone pushes back — homeowners and adjusters both. Based on what came up here, I don\'t think this is the right stage for you to take that on.'
    },
    {
      id: 'roleexplain',
      label: 'Role explanation',
      section: 'Vetting',
      noExpCards: [
        { type: 'context', text: '<b>The problem:</b> When a homeowner experiences storm damage — hail, wind, weather — they file a claim. The insurance company sends their own adjuster to inspect the property and decide what gets approved.<br><br>Here\'s the issue: <b>adjusters manage hundreds of claims.</b> They move fast. Legitimate damage gets missed — not always on purpose, but it happens constantly.<br><br><b>Who we are:</b> Proliance is a public adjusting company. We work for the homeowner — not the insurance company.<br><br><b>What you\'d actually do:</b> You arrive at the property before the adjuster. You inspect the roof and all exterior areas, take detailed photos and notes, and then you walk the property with the adjuster — making sure everything gets properly reviewed and documented before a decision is made.<br><br><b>The goal isn\'t to argue.</b> It\'s to make sure the inspection is thorough and accurate. Most homeowners have no idea what storm damage looks like or what to ask for. You\'re the person who bridges that gap and protects their interests.' },
      ],
      expCards: [
        { type: 'context', text: '<b>The problem:</b> Adjusters handle high claim volumes. Inspections move quickly — and legitimate damage gets missed or underdocumented. Homeowners don\'t know what they\'re entitled to.<br><br><b>Proliance works for the homeowner.</b> We\'re on their side of the table — not the carrier\'s.<br><br><b>Your role:</b> You\'re on the property before the adjuster arrives. You document everything. Then you walk it with them — making sure nothing gets missed or minimized before the decision is made. <b>You\'re not arguing. You\'re ensuring accuracy.</b>' },
      ]
    },
    {
      id: 'rolefit',
      label: 'Role fit',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], when you hear that — accurate, thorough, but also able to stand your ground professionally when someone disagrees — how does that land for you?' },
        { type: 'listen', text: '<b>Strong:</b> Balanced and grounded — comfortable with the tension between being firm and professional.<br><b>Caution:</b> <b>Aggressive framing</b> — ego risk.<br><b>Exit:</b> <b>Passive framing</b> — won\'t hold ground when pushed.' },
      ],
      exitScript: '[name], this role sits right in the middle — not passive, not aggressive. Not everyone enjoys that balance, and I think it may not be the right fit.'
    },
    {
      id: 'pressure',
      label: 'Pressure test',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], you\'re walking a property with an adjuster. You point something out and they say: "No, that\'s just wear and tear." How do you handle that?' },
        { type: 'rule', text: 'While [name] is <b>mid-answer</b> — interrupt: <i>"Yeah but I\'ve seen hundreds of these — that\'s not storm damage."</i> Then <b>stop. Say nothing.</b> Watch what happens. <b>This is the single most important signal in the entire interview.</b>' },
        { type: 'listen', text: '<b>Strong:</b> Stays calm, structured, guides — doesn\'t fight or fold.<br><b>Caution:</b> Starts well but escalates when interrupted.<br><b>Exit:</b> Goes aggressive immediately, OR folds and drops it completely.' },
      ],
      expCards: [
        { type: 'branch', label: 'EXPERIENCED TRACK — adjuster roleplay', text: '<b>Context to set:</b> "Our role is to make sure nothing gets missed. Adjusters handle high volumes — sometimes damage gets interpreted differently or overlooked. We walk the property with them and make sure everything is fully considered before a decision is made."' },
        { type: 'ask', text: 'You\'ve been on the adjuster side making the call. If you were now on the other side — walking the property with the adjuster — and you saw something you believed warranted a full replacement, but the adjuster was leaning toward a repair… what would you do?' },
        { type: 'ask', text: 'In that situation — do you stay in the conversation and walk them through it, or do you note it and let the adjuster make the final call?' },
        { type: 'ask', text: 'Tell me about a real time in your adjuster role where someone disagreed with your assessment — what did they say, and how did you respond?' },
        { type: 'ask', text: 'Did they change their decision — or did it stay the same?' },
        { type: 'ask', text: 'What did you say that influenced that outcome?' },
      ],
      exitScript: 'Aggressive: "[name], this role needs more composure than force — you\'d be representing a homeowner, and escalating kills credibility. I don\'t think it\'s the right fit." / Passive: "[name], this role requires holding your ground consistently — the adjuster won\'t always push back gently. I don\'t think it\'s the right fit."'
    },
    {
      id: 'conviction',
      label: 'Conviction',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], what makes you confident enough to stand your ground — especially when someone more experienced is disagreeing with you?' },
        { type: 'listen', text: '<b>Strong:</b> Confidence rooted in <b>observation, evidence, or methodology</b> — not personality.<br><b>Exit:</b> "I\'m just confident" with <b>no substance behind it</b>. Confidence without understanding breaks down under real pushback.' },
      ],
      expCards: [
        { type: 'ask', text: 'When you see something wrong on a claim, [name] — do you try to change the outcome, or do you document it and move on? Which one do you actually do most of the time?' },
        { type: 'ask', text: 'Walk me through a real example — step by step. What did you say, what did they do, and what happened?' },
        { type: 'note', text: 'This is your <b>influence vs. report filter.</b> Candidates who only report without influencing are <b>not right for this role.</b> You need someone who stays in the conversation.' },
      ],
      exitScript: '[name], confidence here comes from understanding the damage — not from personality alone. Without that foundation, the role gets really hard really fast. I think there\'s a gap there.'
    },
    {
      id: 'field',
      label: 'Field readiness',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'note', text: '<b>Disclaimer:</b> This job requires being comfortable working on steep residential roofs — that\'s non-negotiable for the role. This section is about getting an honest, unprompted read on [name], not steering them toward the "right" answer.' },
        { type: 'ask', text: '[name], tell me about your experience working on residential roofs. What were you doing up there?' },
        { type: 'note', text: 'Don\'t mention steep roofs yet — see what [name] volunteers on their own.' },
        { type: 'ask', text: 'What roof pitches have you personally worked on?' },
        { type: 'note', text: 'Someone experienced may answer with things like 6/12, 8/12, 10/12. If [name] doesn\'t understand the question, that\'s useful information — you can explain what you mean rather than automatically rejecting them.' },
        { type: 'ask', text: 'At what roof pitch would you personally stop free-walking the roof and use additional equipment or protection?' },
        { type: 'listen', text: 'You\'re looking for <b>safety judgment</b>, not a magic number. Someone bragging that they\'ll walk anything isn\'t necessarily a strong candidate.' },
        { type: 'ask', text: 'What\'s the tallest extension ladder you\'ve personally set up and used, and approximately how high were you working?' },
        { type: 'note', text: 'This helps distinguish "I\'m fine with heights" from "I\'ve actually done this."' },
        { type: 'ask', text: 'Optional deeper probe: "What\'s the steepest roof you\'ve personally worked on? Can you describe the pitch and what you used to work on it safely?"' },
        { type: 'rule', text: '<b>Don\'t educate before testing.</b> Let [name] answer in their own words first — explaining pitch terminology upfront gives away the test.' },
        { type: 'listen', text: '🟢 <b>Experienced:</b> Gives specific pitches/heights, explains previous roof work, can describe equipment/safety practices, has substantial ladder experience.<br>🟡 <b>Unproven but potentially trainable:</b> Says they\'re comfortable but has little/no actual roof experience. Don\'t treat their "yes" as evidence — they proceed only if you\'re hiring people who can be trained.<br>🔴 <b>Concern:</b> Claims extensive roof experience but can\'t explain pitch, equipment, ladder setup, or what they actually did on the roof; or demonstrates unsafe attitudes.' },
      ],
      exitScript: '[name], this role puts you on steep residential roofs regularly — that\'s core to the job, not an edge case. Based on what you\'ve shared, I\'m not confident that\'s a safe or sustainable fit right now.'
    },
    {
      id: 'selfdirection',
      label: 'Self-direction',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], walk me through how you typically organize your day — what does your structure look like?' },
        { type: 'ask', text: 'Tell me about a time you had to lead yourself through a pinch situation — something went sideways and there was no one to turn to. What happened and what did you do?' },
        { type: 'listen', text: '<b>Strong:</b> Has a real system. Pinch story shows <b>composure, a clear decision, and follow-through.</b><br><b>Caution:</b> Day structure is loose but pinch story is solid.<br><b>Exit:</b> <b>No structure, no story</b> — relies on being managed.' },
      ],
      exitScript: ''
    },
    {
      id: 'learning',
      label: 'Learning speed',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], tell me about the last time you had to get up to speed on something complex quickly. What did you do, and how long did it take before you felt genuinely competent?' },
        { type: 'note', text: '<b>"I\'m a fast learner" is not an answer.</b> You need a real example with a method, a timeline, and a measure of progress.' },
        { type: 'ask', text: 'What\'s something you\'ve taught yourself — a skill, a tool, a process — without being formally trained on it?' },
      ],
      expCards: [
        { type: 'ask', text: 'Based on your background and experience — what do you think you still need to learn and master to be genuinely great in this specific role?' },
        { type: 'listen', text: '<b>Strong experienced:</b> Can <b>honestly identify their own gaps</b> — damage types, documentation standards, adjuster dynamics. Self-awareness = coachability.<br><b>Caution:</b> Says "not much" — may be overconfident.<br><b>Exit:</b> Can\'t name anything. Thinks they already know it all.' },
      ],
      noExpCards: [
        { type: 'listen', text: '<b>Strong no-exp:</b> Real example with <b>method, timeline, how they measured progress.</b><br><b>Exit:</b> Can\'t name a real example — <b>waited to be taught every step.</b> In a field role without supervision, this is a liability.' },
      ],
      exitScript: ''
    },
    {
      id: 'docs',
      label: 'Documentation',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'note', text: '<b>Pay is tied to documentation.</b> You need someone who treats this as <b>non-negotiable</b> — not someone who says they\'d do it but has no real system.' },
      ],
      expCards: [
        { type: 'ask', text: '[name], walk me through your documentation process — what were the best practices that actually made you consistent and successful?' },
      ],
      noExpCards: [
        { type: 'ask', text: '[name], you just finished your 6th adjuster meeting of the day. It\'s 6pm, you\'re tired, and you still have photos and notes to upload. Walk me through exactly what you do.' },
      ],
      sharedListenCards: [
        { type: 'listen', text: '<b>Strong:</b> Step-by-step, specific system, <b>consistent regardless of energy level.</b><br><b>Exit:</b> Vague — "I\'d figure it out" — <b>no real process described.</b>' },
      ],
      exitScript: '[name], documentation in this role is directly tied to your pay — it\'s not optional and it\'s not flexible. If there\'s no structured process already in place, it becomes a real problem fast. I think there\'s a gap here that I\'m not confident we can close quickly enough.'
    },
    {
      id: 'resilience',
      label: 'Resilience',
      section: 'Vetting',
      rated: true,
      expCards: [
        { type: 'ask', text: '[name], if you had a stretch of several meetings that all resulted in denials, how would you evaluate what happened — and what would you change?' },
      ],
      noExpCards: [
        { type: 'ask', text: '[name], tell me about a time you faced repeated setbacks or failures at work. What did you do to keep improving?' },
      ],
      cards: [
        { type: 'listen', text: '<b>Strong:</b> <b>Self-reviews performance</b> — asks "what can I do differently?" Has a real process for adjusting.<br><b>Caution:</b> Accepts setbacks but <b>no real method to adapt.</b><br><b>Exit:</b> <b>Blames</b> the adjuster, the homeowner, the process, or luck.' },
      ],
      exitScript: ''
    },
    {
      id: 'homeowner',
      label: 'Homeowner comms',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], walk me through how you\'d introduce yourself and explain your role to a homeowner who has no idea why you\'re there before the adjuster arrives.' },
        { type: 'ask', text: 'What would you do if that homeowner started venting about how long the process is taking — or got emotional about the damage to their home?' },
        { type: 'listen', text: '<b>Strong:</b> Clear, warm, professional — <b>explains simply without overselling.</b> Stays grounded when things get emotional.<br><b>Caution:</b> Handles intro fine but <b>gets awkward with the emotional scenario.</b><br><b>Exit:</b> <b>Transactional, robotic</b>, or dismissive.' },
      ],
      exitScript: '[name], this role puts you in someone\'s home on one of their harder days. The ability to be professional and human at the same time isn\'t optional here. I\'m not seeing that confidence come through.'
    },
    {
      id: 'humility',
      label: 'Humility & coachability',
      section: 'Vetting',
      rated: true,
      cards: [
        { type: 'ask', text: '[name], tell me about a time you were completely sure you were right — and later found out you weren\'t. What did you do?' },
        { type: 'ask', text: 'Some people shut down when their work gets challenged. How do you usually respond when someone pushes back on your assessment, [name]?' },
        { type: 'listen', text: '<b>Strong:</b> Owns the mistake — <b>adjusted, learned, moved forward.</b> Calm under challenge.<br><b>Caution:</b> <b>Defensive</b> about original position but stays professional.<br><b>Exit:</b> <b>Deflects blame</b>, minimizes, or shuts down.' },
      ],
      exitScript: '[name], this role requires flexibility — you\'ll be right sometimes and wrong sometimes. The ability to receive feedback and adjust is what keeps you improving. I\'m concerned about the fit there.'
    },
    {
      id: 'payexplain',
      label: 'Pay explanation',
      section: 'Pay',
      cards: [
        { type: 'say', text: 'The easiest way to understand it, [name], is: you have <b>guaranteed weekly pay</b>, then you earn extra money based on the results of each adjuster meeting.' },
        { type: 'note', text: '<b>1. Guaranteed base pay</b><br>You receive <b>$900/week</b> normally, or <b>$1,000/week</b> if you have 40-foot ladder + steep-roof tool expertise.<br><br>That salary is guaranteed regardless of whether a meeting results in a denial, partial approval, or full approval.<br><br>The base also covers the smaller tasks you\'re expected to run — ITEL appointments, tarps, photo pulls, check pickups, paperwork signatures. <b>You don\'t get paid extra per task</b> for those.' },
        { type: 'note', text: '<b>2. Then you earn extra for every adjuster meeting</b><br>
          <table class="comp-table">
            <tr><th>Meeting Result</th><th>Extra Pay</th></tr>
            <tr><td>Denial</td><td>$0</td></tr>
            <tr><td>Partial Approval</td><td class="up">+$50</td></tr>
            <tr><td>Full Approval</td><td class="up">+$125</td></tr>
          </table>
          So on the $900 base, a week with <b>3 full approvals and 2 partial approvals</b> looks like: $900 + (3 × $125 = $375) + (2 × $50 = $100) = <b>$1,375 for the week</b>.<br><br>
          Important: the performance payout only lands once the <b>estimate is received by the office</b>, and you submit all required photos and documentation. Skip the documentation and you <b>lose the performance payout for that appointment</b> — but never your $900/$1,000 base.' },
        { type: 'note', text: '<b>3. Big properties pay a little more</b><br>
          If the property is <b>35+ squares</b>, you get an additional $20 when you achieve an approval:
          <table class="comp-table">
            <tr><th>35+ Square Property</th><th>Total Extra Pay</th></tr>
            <tr><td>Denial</td><td>$0</td></tr>
            <tr><td>Partial Approval</td><td class="up">$50 + $20 = $70</td></tr>
            <tr><td>Full Approval</td><td class="up">$125 + $20 = $145</td></tr>
          </table>
          That $20 is a <b>premium on top of the normal performance payout</b> — not $20 by itself.' },
        { type: 'note', text: '<b>4. Two other ways to earn bonuses</b><br>
          For the smaller/additional appointments — complete <b>20 of them within one calendar month</b> and you get a <b>$100 monthly bonus</b>. 19 = no bonus; 20+ = $100. You\'re responsible for tracking and submitting them.<br><br>
          You can also generate your own leads by door knocking. Bring in a qualified PA contract that gets filed and <b>isn\'t canceled within 2 weeks</b>, and you get <b>+$100 per contract</b>.<br><br>
          You also get priority to run the adjuster meeting for a claim you generated yourself. So one self-generated account could produce <b>$100 lead-gen bonus + $125 full-approval payout = $225 extra</b> — or <b>$245</b> if it\'s also a 35+ square property.' },
        { type: 'note', text: '<b>The bigger picture</b><br>
          Think of the compensation as: <b>Guaranteed Salary + Meeting Performance Pay + Large Property Premiums + Monthly Task Bonus + Self-Generated Lead Bonuses.</b><br><br>
          For example, a hypothetical month on the standard base: $900 × 4 weeks = $3,600 base, 10 full approvals × $125 = $1,250, 5 partial approvals × $50 = $250, 3 large-property premiums × $20 = $60, 20 additional tasks = $100 bonus, 2 self-generated contracts × $100 = $200. <b>Total = $5,460 for that month.</b>' },
        { type: 'listen', text: '<b>Recruiter note:</b> $900/week is the floor. Upside depends heavily on how many adjuster meetings [name] runs and their approval percentage. KPI expectation is <b>42% approval</b> — the structure is designed to reward turning meetings into approvals, not just showing up to appointments.' },
      ]
    },
    {
      id: 'final',
      label: 'Final alignment',
      section: 'Close',
      cards: [
        { type: 'say', text: 'So now that you\'ve seen the role, [name] — it requires detail, conviction, and the ability to stand your ground professionally while still keeping homeowners comfortable.' },
        { type: 'ask', text: 'Does this feel like how you naturally operate — or does it feel like a stretch?' },
        { type: 'ask', text: 'And — now that you have the full picture of the role and what we\'re looking for — are you still excited about moving forward?' },
      ],
      exitScript: '[name], I\'d rather you have clarity now than figure it out two weeks in. I think we\'re not quite aligned — and that\'s okay.'
    },
    {
      id: 'debrief',
      label: 'Debrief & verdict',
      section: 'Debrief',
      questions: [
        { key: 'gut', text: 'When you picture [name] in the field on day 30 — do you see it working?', opts: [{ v: 'g', l: 'Yes, I can see it' }, { v: 'a', l: 'Maybe, with the right support' }, { v: 'r', l: 'Honestly, no' }] },
        { key: 'pressure', text: 'How did [name] handle the live interruption mid-answer?', opts: [{ v: 'g', l: 'Stayed grounded — didn\'t fold' }, { v: 'a', l: 'Wobbled but recovered' }, { v: 'r', l: 'Escalated or collapsed' }] },
        { key: 'learning', text: 'Do you believe [name] can self-teach this role without hand-holding?', opts: [{ v: 'g', l: 'Yes — gave real evidence' }, { v: 'a', l: 'Possibly — vague but hopeful' }, { v: 'r', l: 'No — needs to be taught everything' }] },
        { key: 'pattern', text: 'Was there a consistent pattern in how [name] showed up across the call?', opts: [{ v: 'g', l: 'Consistent and grounded' }, { v: 'a', l: 'Mixed — some strong, some weak' }, { v: 'r', l: 'Inconsistent or performing' }] },
        { key: 'risk', text: 'If you move [name] forward and it doesn\'t work — most likely reason?', opts: [{ v: 'g', l: 'No obvious failure point' }, { v: 'a', l: 'The learning curve' }, { v: 'r', l: 'Composure under real pushback' }] },
      ]
    }
  ],

  users: ['Ressa', 'Sheen', 'Felize'],
};
