# LexPrompt Generator — Fieldfisher AI Prompt Builder

> A role-based AI prompt generator that builds CLEAR-compliant prompts for legal professionals in seconds. Part of the LexPrompt suite for Fieldfisher's AI Knowledge Hub.

**[Live Demo →](https://lex-prompt-generator.vercel.app/)**

---

## What This Is

LexPrompt Generator solves the most common barrier to AI adoption in professional services: contributors know they should use AI, but don't know how to write a prompt that produces a reliable, professional result.

Rather than asking contributors to learn prompt engineering from scratch, LexPrompt Generator does the engineering for them. A contributor selects their role, answers three guided questions about their task, and receives a ready-to-use, CLEAR-compliant prompt — with a plain-English explanation of why it was built that way, so they learn as they use it.

It is the companion tool to [LexPrompt](https://lex-prompt-fieldfisher.vercel.app/) — the firmwide Prompt Bank. Together they form a complete prompt lifecycle:

```
LexPrompt Generator          →           LexPrompt
Build a prompt for your task    Score, approve, and add to the bank
```

---

## Features

### Role-based generation
Five professional personas, each with tailored placeholder guidance:
- ⚖️ **Fee earner** — contracts, client communications, clause explanations
- 📊 **BD & comms** — pitches, directory submissions, thought leadership
- 👥 **HR & people** — job descriptions, manager communications, policies
- 🧠 **KM & hub** — know-how articles, session recaps, prompt cards
- 🏢 **Operations** — process guides, vendor comparisons, internal FAQs

### Guided three-field input
Instead of a blank text box, contributors answer three structured questions:
1. What do you need to produce?
2. Who is it for?
3. Any specific requirements? *(optional)*

Placeholder text is persona-specific — a fee earner and a BD manager see different examples, reducing friction and improving output quality.

### Automatic CLEAR compliance
Every generated prompt is built to pass the CLEAR framework:
- **C** — opens with role context so Claude knows who is asking
- **L** — plain English throughout, no ambiguous action words
- **E** — format guidance automatically selected based on task type
- **A** — review caveat and confidentiality reminder baked in
- **R** — structured and scoped for consistent results across users

### Live CLEAR score
The generated prompt is scored instantly against all five criteria — giving contributors immediate confidence that their prompt meets the firm's quality standard.

### Why it was built this way
Each generated prompt comes with a five-point explanation of the design decisions — turning every use of the tool into a micro-learning moment in prompt engineering.

### Inline editor
Contributors can refine the generated prompt before copying — keeping them in control while the tool handles the structural heavy lifting.

---

## The Design Philosophy

**Meet contributors where they are.**
Non-technical contributors shouldn't have to understand prompt engineering to use AI effectively. The generator abstracts the complexity — role context, format hints, review caveats, placeholder structure — and surfaces only what the contributor needs to provide: their task and their audience.

**Build confidence, not dependency.**
The "Why it was built this way" panel is deliberate. Every time a contributor uses the tool, they see the reasoning behind good prompt structure. Over time, they internalise it. The goal is contributors who eventually don't need the generator — because they've learned to write CLEAR-compliant prompts themselves.

**Responsible AI by default.**
Review caveats and confidentiality reminders are not optional add-ons — they are embedded in every prompt the generator produces. Contributors cannot accidentally generate a prompt that skips responsible AI standards.

---

## Part of the LexPrompt Suite

| Tool | Purpose |
|---|---|
| [LexPrompt](https://lex-prompt-fieldfisher.vercel.app/) | Browse approved prompts, submit and score new ones |
| [LexPrompt Generator](https://lex-prompt-generator.vercel.app/) | Build a CLEAR-compliant prompt from scratch |

Both tools are underpinned by the Fieldfisher AI Knowledge Hub Skills Library — a set of Claude skill files that encode the firm's responsible AI standards, persona-based guidance, and quality methodology.

---

## Tech Stack

- **React 18** with Vite
- **No external UI libraries** — all components hand-built
- **No backend or API calls** — prompt generation logic runs entirely client-side
- **Deployed on Vercel** — zero infrastructure overhead
- **Design** — deep navy and gold palette, glass-morphism cards, persona-specific accent colours

---

## About the Project

This tool was designed and built by **Sandra Paluku** as a pre-start demonstration for the AI Knowledge Hub role at Fieldfisher, an international law firm with offices across Europe and Asia.

The project reflects three core responsibilities of that role:

- **Tooling & Knowledge Infrastructure** — building practical AI resources that non-technical contributors can use confidently and immediately
- **Enablement & Adoption** — lowering the barrier to AI use without lowering the standard of AI outputs
- **Responsible AI by design** — embedding the firm's standards into the tool itself, so responsible use is the path of least resistance

---

## Roadmap

A production version would include:

- **Direct export to LexPrompt** — one-click submission of generated prompts to the Prompt Bank for QA review
- **Prompt history** — contributors can revisit and reuse prompts they've generated
- **Microsoft Copilot mode** — generate prompts optimised for Copilot's specific syntax and constraints
- **Multilingual support** — German language interface for the Berlin office
- **Analytics** — most common task types and personas, informing future training priorities

---

## Running Locally

```bash
git clone https://github.com/Sandypaluk/LexPrompt-Generator.git
cd LexPrompt-Generator
npm install
npm run dev
```

Open **http://localhost:5173/**

---

## Contact

**Sandra Paluku**
AI Knowledge & Enablement Professional
Berlin, Germany

[LinkedIn](#) <!-- Add your LinkedIn URL -->

---

*Part of the LexPrompt suite — built for Fieldfisher's AI Knowledge Hub. Demonstrates practical, responsible, role-appropriate AI enablement infrastructure for a legal professional services environment.*

