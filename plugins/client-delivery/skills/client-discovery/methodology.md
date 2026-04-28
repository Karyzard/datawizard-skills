# Discovery-to-Design Methodology

A replicable framework for AI-assisted client discovery, process formalization, and product design. Extracted from real-world practice — tested on multi-stakeholder projects where domain experts, business owners, and AI collaborate to go from raw operational knowledge to implementable product specifications.

---

## Overview

The methodology has **7 phases** organized in a progressive formalization pipeline:

```
Raw dictation → Structured notes → Process definition → Design → Prototype
```

Each phase has a specific AI role, defined inputs/outputs, and a clear transition signal. Phases can loop back when new information surfaces.

```
Phase 1: Template Prep ──→ Phase 2: Guided Interview ──→ Phase 3: Formalization
                                        ↑                        │
                                        │                        ▼
                           Phase 4: Gap-filling Q&A ←──── TODO list
                                        │
                                        ▼
                           Phase 5: Business Advisory
                                        │
                                        ▼
                           Phase 6: Cross-reference
                                        │
                                        ▼
                           Phase 7: Design & Prototype
```

---

## Phase 1: Template Preparation

**Who:** PM / Project Owner (with optional AI help)
**AI role:** Template Author (optional)
**Duration:** 15–30 min

### Purpose

Create a structured interview template that guides the domain expert through describing their operational reality. The template removes the burden of structure from the expert — they just describe, the template ensures completeness.

### Input

- Strategic context (what product/feature area we're exploring)
- Known pain points or areas of interest
- Who will be interviewed (role, expertise level)

### Output

A markdown file with:
- Context header (who, what, why)
- Instructions for the interviewee
- Areas to cover (numbered)
- For each area: situations to describe
- For each situation: prompts (what happens / who's involved / what's wrong / how often / ideal state)
- Notes section for the AI agent

### Template structure

See [discovery-template.md](templates/discovery-template.md) for the generic template.

### Key principles

- **Write for the person being interviewed**, not for yourself. Use their language.
- **Be specific about what you need** — "describe step by step how it works today" is better than "describe the process."
- **Include the "ideal state" prompt** — it forces forward thinking and captures aspirations.
- **Add agent notes at the bottom** — tell the AI how to behave during the interview.

### Checklist

- [ ] Template has clear context (who is this for, what are we exploring)
- [ ] Areas to cover are numbered and scoped
- [ ] Each situation has 5 prompts (what/who/what's wrong/how often/ideal)
- [ ] Agent notes explain tone and behavior expectations
- [ ] File is saved in the project folder, ready to open in Cursor

---

## Phase 2: Guided Interview

**Who:** AI + Domain Expert (the person being interviewed)
**AI role:** Interview Scribe
**Duration:** 30–90 min per area

### Purpose

Walk the domain expert through the template, capture their real-world descriptions, ask follow-up questions to fill gaps, and write structured notes into the document in real time.

### Trigger

The PM says something like:
> "Guide [Name] through this file. I'm handing over the laptop."

Or opens the template file and says:
> "[Name] will dictate, capture what they say."

### AI behavior

1. **Greet the expert by name.** Acknowledge the handoff. ("Hi David, Karel passed the laptop to you.")
2. **Explain what will happen.** Brief overview: "We'll go through X areas, I'll ask questions, you just describe what happens in practice."
3. **Set expectations.** "You don't need to type or format anything. Just describe it in your own words."
4. **Ask one situation at a time.** Don't overwhelm with multiple questions.
5. **Listen for combined answers.** The expert often answers multiple situations at once — split their input into correct sections.
6. **Ask follow-up questions.** 2–3 clarifying questions per situation max. Don't interrogate.
7. **Confirm understanding.** "Did I capture that correctly?" or "Anything to add?"
8. **Write into the document in real time.** Light formalization only — keep their voice.
9. **Track progress.** "That covers situations 1.1 and 1.2. Let's move to 1.3."
10. **Request a summary.** At the end of each area: "Summarize in 1–3 bullets what's most important to solve."

### Tone

- Conversational, supportive, patient
- No jargon the expert doesn't use
- If the expert is unsure, offer examples or rephrase
- Never judge or critique their current process

### Output

- Updated template file with all situations filled in
- Summary bullets per area
- Notes on unclear points (flagged for later)

### Transition signal

AI says: "We've covered everything. [PM Name] can review this now." Or the expert says: "That's all I have."

### Edge cases

| Situation | How to handle |
|---|---|
| Expert combines multiple topics | Acknowledge: "You've covered two things — I'll split this into sections X and Y." |
| Expert goes off-topic | Gently redirect: "Good point — let me note that. Now back to [current topic]..." |
| Expert doesn't know the answer | "No problem, I'll flag this as an open question for [PM]." |
| Expert mentions future ideas | Capture separately: "I'll note this as a future idea, not current state." |
| Expert corrects themselves | Update the document immediately. |

### Checklist

- [ ] Expert was greeted and oriented
- [ ] All template sections addressed
- [ ] Follow-up questions asked where needed
- [ ] Summary bullets written per area
- [ ] Document saved with all input captured

---

## Phase 3: Process Formalization

**Who:** AI (autonomous) + PM review
**AI role:** Process Analyst
**Duration:** 30–60 min

### Purpose

Transform the raw interview notes into a formal process definition with flow diagrams, business rules, calculations, entity states, and a clear MVP vs. roadmap separation. Identify all gaps as numbered TODOs.

### Trigger

PM returns and asks something like:
> "Is everything we need in this document to start defining the process?"
> "Can we create a process definition from this?"

### AI behavior

1. **Read the entire interview document.** Assess completeness.
2. **Report status.** "We have solid input on X and Y. Missing details on Z."
3. **Propose the output structure.** "I'll create a process definition file with these sections..."
4. **Create a new file** — never overwrite the interview document.
5. **For each process:**
   - Write a plain-language description
   - Create a Mermaid flowchart
   - Extract business rules into a table (rule | definition)
   - Define calculations with formulas and examples
   - List entity states with meanings
6. **Separate MVP from roadmap.** MVP gets full detail. Roadmap items get a title, description, and business impact — no implementation detail.
7. **Generate numbered TODOs.** For every missing piece of information, create a TODO with:
   - Number (TODO-1, TODO-2, ...)
   - Question (specific, answerable)
   - Who should answer (domain expert / PM / both)
8. **Cross-link with reference data.** If the expert mentioned numbers, frequencies, or categories — create a reference data section.

### Output

A new markdown file (e.g., `process-definition-mvp.md`) with:
- Reference data (types, frequencies, capacities)
- Process sections (description, flow, rules, calculations, states)
- Roadmap / backlog (numbered items with description)
- Open questions (TODO list with responsible person)

See [process-definition-template.md](templates/process-definition-template.md) for the generic template.

### Transition signal

AI presents the file and says: "Process definition ready. There are N open questions that need answers before we can proceed."

### Checklist

- [ ] Every process has: description, flow diagram, rules table, calculations, states
- [ ] MVP processes are fully detailed
- [ ] Roadmap items have: title, description, business impact
- [ ] TODOs are numbered, specific, and assigned to a person
- [ ] Reference data section exists
- [ ] File is separate from the interview document

---

## Phase 4: Gap-filling Q&A

**Who:** AI + Stakeholders (different people answer different questions)
**AI role:** Q&A Facilitator
**Duration:** 20–60 min per stakeholder

### Purpose

Walk each stakeholder through the TODO questions relevant to them. Capture answers and immediately integrate them into the process definition.

### Trigger

PM says something like:
> "Guide [Name] through the open questions."
> "I'm handing the laptop to [Name] for the TODO questions."

Or PM returns and says:
> "I'm ready to answer my questions."

### AI behavior

1. **Identify the stakeholder.** Who are they, which TODOs are theirs?
2. **Count and preview.** "Hi [Name], we have N questions for you. Here's the first one."
3. **Ask one question at a time.** Provide context from the process definition.
4. **Integrate immediately.** After each answer, update the process definition.
5. **Mark TODOs as answered.** Strikethrough + "ANSWERED" label.
6. **Handle new questions.** If the answer reveals new gaps, create new TODOs.
7. **Handle scope changes.** If the stakeholder says "not for MVP" — move to roadmap.
8. **Facilitate handoffs.** "Your questions are done. The remaining N are for [other person]."

### Tone adaptation

| Stakeholder type | Tone | Focus |
|---|---|---|
| Domain expert (operational) | Practical, concrete | "How does this work in practice?" |
| Business owner (strategic) | Analytical, advisory | "What's the business impact? What are the tradeoffs?" |
| Technical lead | Precise, systemic | "What are the constraints? What depends on what?" |

### Output

- Updated process definition with answers integrated
- TODOs marked as answered
- New TODOs if discovered
- Roadmap items if scope was adjusted

### Transition signal

AI says: "All TODOs answered. [Remaining tasks if any]." Or the last stakeholder finishes their questions.

### Edge cases

| Situation | How to handle |
|---|---|
| Answer contradicts previous info | Flag it: "This differs from what [X] said earlier. Which is correct?" |
| Stakeholder doesn't understand the question | Rephrase with a concrete example from their domain. |
| Answer reveals a complex decision | Don't force it. "This needs more thought. I'll keep it as an open question." |
| Stakeholder adds future ideas | Capture as roadmap item, not MVP. |
| Stakeholder creates a new task | Create a new TASK item (separate from TODO). |

### Checklist

- [ ] All TODO items addressed (answered or explicitly deferred)
- [ ] Answers integrated into the process definition
- [ ] No unanswered TODOs remaining for this stakeholder
- [ ] New discoveries captured (new TODOs or roadmap items)

---

## Phase 5: Business Advisory

**Who:** AI + Business Owner
**AI role:** Business Advisor
**Duration:** 10–30 min per topic

### Purpose

Provide strategic analysis and recommendations for complex business decisions that emerge during the process. This is where AI shifts from documenting to actively advising.

### Trigger

The business owner explicitly asks for an opinion:
> "What do you think we should do?"
> "Look at this from a business analysis perspective."
> "What are the tradeoffs?"

Or a TODO reveals a decision with significant business impact where multiple valid approaches exist.

### AI behavior

1. **Frame the problem.** "The core issue is..."
2. **Analyze from multiple perspectives:**
   - Business impact (revenue, costs, operations)
   - Client/user experience (emotions, perception, satisfaction)
   - Technical complexity (feasibility, maintenance)
   - Risk (what could go wrong)
3. **Present options.** 2–3 concrete alternatives with pros/cons.
4. **Make a recommendation.** "My recommendation is [X] because..."
5. **Justify with specifics.** Numbers, scenarios, examples.
6. **Integrate the decision.** Once approved, update the process definition.

### Tone

- Analytical, confident, but open to pushback
- Use the owner's business language
- Don't hedge excessively — make a clear recommendation
- Acknowledge uncertainty where it exists

### Output

- Structured analysis (problem → options → recommendation → justification)
- Updated process definition with the chosen approach
- Documentation of why the decision was made (for future reference)

### Transition signal

Owner approves: "Good, do it that way." Or requests more analysis.

### Checklist

- [ ] Problem clearly framed
- [ ] Multiple perspectives analyzed
- [ ] Concrete recommendation made
- [ ] Owner approved the direction
- [ ] Decision integrated into process definition with rationale

---

## Phase 6: Cross-reference

**Who:** AI (autonomous) + PM for discrepancy resolution
**AI role:** Compliance Checker
**Duration:** 30–60 min

### Purpose

Compare the process definition against existing documents (contracts, terms of service, legal agreements, existing system documentation) to find discrepancies, missing elements, and confirmations.

### Trigger

PM provides a document:
> "Here are our terms of service. Check them against the process definition."
> "I uploaded [document]. Make sure we're consistent."

### AI behavior

1. **Read the reference document thoroughly.**
2. **Extract relevant rules/clauses** that relate to the process definition.
3. **Compare systematically.** For each process, check against relevant clauses.
4. **Categorize findings into three groups:**
   - **Confirmations** — process definition matches the document
   - **Discrepancies** — process definition conflicts with the document
   - **Additions** — document contains rules not yet in the process definition
5. **Present findings in a structured table** with document references.
6. **For each discrepancy:** Explain both sides and ask which takes precedence.
7. **For each addition:** Propose how to integrate it into the process definition.
8. **Update the process definition** after PM resolves discrepancies.

### Output

A new section in the process definition:
- Confirmations table (area | document reference | process definition | status)
- Discrepancies with resolution
- Additions with integration plan

### Transition signal

All discrepancies resolved, additions integrated. AI confirms: "Process definition is now consistent with [document]."

### Checklist

- [ ] All relevant clauses extracted from reference document
- [ ] Confirmations documented
- [ ] Discrepancies identified and resolved
- [ ] Additions proposed and integrated
- [ ] Process definition updated

---

## Phase 7: Design & Prototype

**Who:** AI + PM for validation
**AI role:** Product Designer
**Duration:** 2–4 hours

### Purpose

Create tangible design artifacts that make the process definition visible and testable: data models, process maps, wireframes, and interactive prototypes.

### Trigger

PM says:
> "Let's start designing."
> "Create wireframes / data model / prototype from the process definition."

Or Phase 6 is complete and all TODOs are resolved.

### AI behavior

1. **Create a design plan.** List all artifacts to produce, in order.
2. **Data model first.** ER diagram derived from process entities.
3. **Process maps.** Connect individual process flows into one system view.
4. **Wireframes.** ASCII first (fast iteration), then interactive if requested.
5. **Open questions.** Flag anything unclear or ambiguous for validation.
6. **Progressive fidelity.** Start low-fi, increase detail based on feedback.

### Output (in order)

| Artifact | Format | Purpose |
|---|---|---|
| Design plan | Markdown | Scope and sequence of design work |
| Data model | Mermaid ER diagram | Entity relationships and attributes |
| Process map | Mermaid flowchart | Cross-process integration view |
| Wireframes (client) | ASCII → HTML | Key screens for end users |
| Wireframes (admin) | ASCII → HTML | Key screens for internal users |
| Open questions | Markdown list | Issues for stakeholder validation |

### Transition signal

AI presents all artifacts and says: "Design ready for review with [stakeholders]."

### Checklist

- [ ] Data model covers all entities from process definition
- [ ] Process map shows how processes connect
- [ ] All key user flows have wireframes
- [ ] Open questions documented
- [ ] Artifacts ready for stakeholder review

---

## The Laptop Handoff Pattern

A distinctive feature of this methodology is **physical laptop handoffs** between stakeholders. The AI adapts to whoever is currently at the keyboard.

### How it works

1. **PM initiates.** "I'm handing the laptop to [Name]. Guide them through [task]."
2. **AI acknowledges.** "Hi [Name], [PM] asked me to walk you through..."
3. **AI adapts tone and depth** to the new person's role and expertise.
4. **Expert works with AI.** Dictates, answers questions, provides input.
5. **Expert signals completion.** "That's everything." Or AI says: "We're done with your part."
6. **PM returns.** "I'm back. I'm [Name]." (Explicit identity statement.)
7. **AI switches context.** Reports what happened, presents results, continues.

### Practical tips

- **Tell the AI who is speaking.** Especially in voice-to-text scenarios.
- **AI should confirm the identity.** "Welcome back, Karel."
- **Different people get different questions.** The AI routes TODOs by role.
- **Keep the AI informed of handoffs.** Even a simple "David is here now" is enough.

---

## Document Hierarchy

```
project-folder/
├── interview-notes.md         ← Phase 2 output (raw, keeps expert's voice)
├── process-definition-mvp.md  ← Phase 3-6 output (formal, evolving)
├── reference-documents/       ← Phase 6 inputs (VOP, contracts, etc.)
└── design/                    ← Phase 7 output
    ├── plan.md
    ├── data-model.md
    ├── process-map.md
    ├── wireframes-client.md
    ├── wireframes-admin.md
    └── open-questions.md
```

---

## Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|---|---|---|
| Skipping Phase 2 and going straight to formalization | You miss real-world nuance and edge cases | Always interview the domain expert first |
| Interviewing and formalizing in one step | Overwhelms the expert with structure | Keep raw capture separate from formalization |
| Hard-blocking on TODOs | Stops progress unnecessarily | Mark as TODO and continue — fill gaps later |
| AI only documenting, never advising | Misses the value of Phase 5 | When asked for opinion, give a clear recommendation |
| Editing the interview document during formalization | Loses the original voice and context | Always create a new file for the process definition |
| Asking all stakeholders all questions | Wastes time, creates confusion | Route questions by role |
