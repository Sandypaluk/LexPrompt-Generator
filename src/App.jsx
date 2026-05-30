import { useState } from "react";

const PERSONAS = [
  {
    id: "fee-earner",
    label: "Fee earner",
    icon: "⚖️",
    accent: "#D4A853",
    placeholders: {
      produce: "e.g. a contract risk summary, a client update email, a clause explanation",
      audience: "e.g. a non-lawyer client, internal file note, the supervising partner",
      requirements: "e.g. UK law only, under 200 words, flag risks only"
    },
    roleContext: "a corporate lawyer at an international law firm"
  },
  {
    id: "bd-comms",
    label: "BD & comms",
    icon: "📊",
    accent: "#7EB8D4",
    placeholders: {
      produce: "e.g. a pitch introduction, a thought leadership post, a directory submission",
      audience: "e.g. a mid-size tech company, internal partners, LinkedIn followers",
      requirements: "e.g. British English, under 300 words, confident not stuffy"
    },
    roleContext: "a BD manager at Fieldfisher, an international law firm"
  },
  {
    id: "hr-people",
    label: "HR & people",
    icon: "👥",
    accent: "#7EC8A4",
    placeholders: {
      produce: "e.g. a job description, a manager communication, an HR policy summary",
      audience: "e.g. a candidate, a line manager, all staff",
      requirements: "e.g. inclusive language, Germany jurisdiction, three tone options"
    },
    roleContext: "an HR Business Partner at an international law firm"
  },
  {
    id: "km-hub",
    label: "KM & hub",
    icon: "🧠",
    accent: "#A99BE8",
    placeholders: {
      produce: "e.g. a know-how article, an AI session recap, a prompt card",
      audience: "e.g. fee earners, the intranet, new AI users",
      requirements: "e.g. EU law only, max 200 words, flag jurisdiction variants"
    },
    roleContext: "a knowledge management professional at an international law firm"
  },
  {
    id: "operations",
    label: "Operations",
    icon: "🏢",
    accent: "#C4B8A8",
    placeholders: {
      produce: "e.g. a process guide, a vendor comparison, an internal FAQ",
      audience: "e.g. all staff, the finance team, IT administrators",
      requirements: "e.g. numbered steps, include sign-off requirements, table format"
    },
    roleContext: "an operations manager at an international law firm"
  }
];

function buildPrompt(persona, produce, audience, requirements) {
  const p = PERSONAS.find(x => x.id === persona);
  const reqLine = requirements.trim() ? `Additional requirements: ${requirements.trim()}.` : "";
  const reviewCaveat = persona === "fee-earner"
    ? "Do not provide legal advice — flag anything that requires qualified review. A qualified lawyer must review this output before use."
    : persona === "hr-people"
    ? "Note: employment law varies by jurisdiction — confirm applicability before use. Do not include legal advice."
    : "Please review this output before sharing externally.";
  const formatHint =
    produce.toLowerCase().includes("email") ? "Structure it clearly with a subject line, opening, body, and sign-off." :
    produce.toLowerCase().includes("summary") ? "Present as a structured summary with clear headings or numbered points." :
    produce.toLowerCase().includes("article") || produce.toLowerCase().includes("post") ? "Write in flowing prose with a clear point of view. End with a question to drive engagement." :
    produce.toLowerCase().includes("comparison") ? "Present as a structured table followed by a one-paragraph recommendation." :
    produce.toLowerCase().includes("policy") || produce.toLowerCase().includes("guide") || produce.toLowerCase().includes("process") ? "Use numbered steps with clear headings. Include purpose, scope, and who to contact with questions." :
    produce.toLowerCase().includes("job description") ? "Structure as: (1) About the role, (2) Key responsibilities, (3) About you, (4) About Fieldfisher." :
    "Structure the output clearly with headings or numbered points where appropriate.";
  return `You are assisting ${p.roleContext}. I need you to produce ${produce} for ${audience}. ${formatHint} Use plain English. ${reqLine} ${reviewCaveat}`.trim().replace(/\s+/g, " ");
}

function buildExplanation(persona, produce, audience, requirements) {
  const p = PERSONAS.find(x => x.id === persona);
  return [
    { label: "Role context", text: `Opens with "${p.roleContext}" — this tells Claude exactly who is asking and what professional environment they're in, shaping the tone and depth of the response.` },
    { label: "Task and audience", text: `Specifying both what to produce and who it's for ensures Claude doesn't default to a generic output. The audience shapes register, language, and assumptions.` },
    { label: "Format guidance", text: `A format hint has been automatically added based on your task type — this addresses the E in CLEAR (Expected output) and makes results consistent across users.` },
    { label: "Review caveat", text: persona === "fee-earner" ? `A legal review caveat has been added automatically — required for all fee earner prompts to ensure AI outputs aren't mistaken for legal advice.` : `A review reminder has been added to ensure the output is checked before external use — this addresses the A in CLEAR (Aligned).` },
    { label: requirements.trim() ? "Your requirements" : "Optional requirements", text: requirements.trim() ? `Your specific requirements ("${requirements.trim()}") have been woven in to scope the output and improve repeatability.` : `No specific requirements were added — refine the prompt further by specifying length, tone, jurisdiction, or format constraints.` }
  ];
}

function clearScore(prompt) {
  const hasRole = /you are assisting/i.test(prompt);
  const hasFormat = /structure|numbered|table|summary|headings|points/i.test(prompt);
  const hasReview = /review|qualified|before use|before sending/i.test(prompt);
  const len = prompt.length;
  return {
    C: hasRole ? "pass" : "warn",
    L: len > 40 ? "pass" : "warn",
    E: hasFormat ? "pass" : "warn",
    A: hasReview ? "pass" : "warn",
    R: hasFormat && len > 100 ? "pass" : "warn"
  };
}

const CLEAR_LABELS = { C: "Context", L: "Language", E: "Expected", A: "Aligned", R: "Repeatable" };

export default function LexPromptGenerator() {
  const [persona, setPersona] = useState("");
  const [produce, setProduce] = useState("");
  const [audience, setAudience] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refined, setRefined] = useState("");
  const [showRefined, setShowRefined] = useState(false);

  const selectedPersona = PERSONAS.find(p => p.id === persona);
  const accent = selectedPersona?.accent || "#D4A853";

  const handleGenerate = () => {
    if (!persona || !produce.trim() || !audience.trim()) return;
    setGenerating(true);
    setResult(null);
    setShowRefined(false);
    setRefined("");
    setTimeout(() => {
      const prompt = buildPrompt(persona, produce, audience, requirements);
      const explanation = buildExplanation(persona, produce, audience, requirements);
      const scores = clearScore(prompt);
      setResult({ prompt, explanation, scores });
      setGenerating(false);
    }, 900);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setPersona(""); setProduce(""); setAudience(""); setRequirements("");
    setResult(null); setShowRefined(false); setRefined("");
  };

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #04213F 0%, #082E58 40%, #0A3566 70%, #062847 100%)",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Decorative background circles */}
      <div style={{
        position: "fixed", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: -80, left: -80, width: 320, height: 320,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(126,184,212,0.06) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", top: "40%", left: "60%", width: 200, height: 200,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{
        background: "rgba(4, 20, 40, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(212,168,83,0.15)",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #D4A853, #B8882A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#04213F", fontWeight: 700, letterSpacing: "0.02em",
            boxShadow: "0 2px 12px rgba(212,168,83,0.35)"
          }}>LG</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#F0E8D5", letterSpacing: "0.01em" }}>
              LexPrompt <span style={{ color: "#D4A853" }}>Generator</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(240,232,213,0.45)", marginTop: 1, letterSpacing: "0.04em" }}>
              FIELDFISHER AI KNOWLEDGE HUB
            </div>
          </div>
        </div>
        {result && (
          <button onClick={handleReset} style={{
            fontSize: 12, padding: "6px 16px", borderRadius: 20, cursor: "pointer",
            border: "1px solid rgba(212,168,83,0.3)", background: "rgba(212,168,83,0.08)",
            color: "#D4A853", fontFamily: "inherit", letterSpacing: "0.02em",
            transition: "all 0.2s"
          }}>← Start again</button>
        )}
      </div>

      {/* Hero */}
      {!result && (
        <div style={{ textAlign: "center", padding: "40px 24px 28px" }}>
          <div style={{
            display: "inline-block", fontSize: 11, letterSpacing: "0.12em",
            color: "#D4A853", marginBottom: 16, textTransform: "uppercase",
            borderBottom: "1px solid rgba(212,168,83,0.3)", paddingBottom: 8
          }}>
            Build a CLEAR-compliant prompt in 3 steps
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 400, color: "#F0E8D5", margin: "0 0 10px",
            letterSpacing: "-0.01em", lineHeight: 1.3
          }}>
            What do you need to write today?
          </h1>
          <p style={{ fontSize: 14, color: "rgba(240,232,213,0.5)", margin: 0 }}>
            Select your role and describe your task — we'll build the prompt for you.
          </p>
        </div>
      )}

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 48px" }}>

        {/* Step 1: Role */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 10, fontWeight: 500, color: "rgba(212,168,83,0.7)",
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12,
            display: "flex", alignItems: "center", gap: 8
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#D4A853", flexShrink: 0
            }}>1</span>
            Your role
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => { setPersona(p.id); setResult(null); }} style={{
                padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                border: persona === p.id ? `1.5px solid ${p.accent}` : "1px solid rgba(255,255,255,0.08)",
                background: persona === p.id
                  ? `rgba(${p.accent === "#D4A853" ? "212,168,83" : p.accent === "#7EB8D4" ? "126,184,212" : p.accent === "#7EC8A4" ? "126,200,164" : p.accent === "#A99BE8" ? "169,155,232" : "196,184,168"},0.12)`
                  : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s", fontFamily: "inherit",
                boxShadow: persona === p.id ? `0 0 20px rgba(${p.accent === "#D4A853" ? "212,168,83" : "126,184,212"},0.15)` : "none"
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
                <div style={{
                  fontSize: 12, fontWeight: persona === p.id ? 500 : 400,
                  color: persona === p.id ? p.accent : "rgba(240,232,213,0.55)",
                  lineHeight: 1.3
                }}>{p.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Fields */}
        {persona && (
          <div style={{ animation: "slideUp 0.3s ease" }}>
            <div style={{
              fontSize: 10, fontWeight: 500, color: "rgba(212,168,83,0.7)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#D4A853", flexShrink: 0
              }}>2</span>
              Describe your task
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "1.5rem",
              marginBottom: 20, display: "flex", flexDirection: "column", gap: 18,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
            }}>
              {[
                { label: "What do you need to produce?", value: produce, setter: setProduce, key: "produce", required: true },
                { label: "Who is it for?", value: audience, setter: setAudience, key: "audience", required: true },
                { label: "Any specific requirements?", value: requirements, setter: setRequirements, key: "requirements", required: false }
              ].map(field => (
                <div key={field.key}>
                  <label style={{
                    fontSize: 12, fontWeight: 500,
                    color: "rgba(240,232,213,0.6)",
                    display: "block", marginBottom: 6, letterSpacing: "0.02em"
                  }}>
                    {field.label}
                    {field.required
                      ? <span style={{ color: accent, marginLeft: 4 }}>*</span>
                      : <span style={{ fontSize: 10, color: "rgba(240,232,213,0.3)", marginLeft: 6 }}>optional</span>
                    }
                  </label>
                  <input
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={selectedPersona?.placeholders[field.key]}
                    style={{
                      width: "100%", fontSize: 13.5, padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(4,33,63,0.5)",
                      color: "#F0E8D5", fontFamily: "inherit",
                      transition: "border-color 0.2s",
                      outline: "none"
                    }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              ))}

              <button
                onClick={handleGenerate}
                disabled={!produce.trim() || !audience.trim() || generating}
                style={{
                  padding: "12px 0", borderRadius: 10, border: "none",
                  background: !produce.trim() || !audience.trim() || generating
                    ? "rgba(255,255,255,0.1)"
                    : `linear-gradient(135deg, ${accent}, ${accent}CC)`,
                  color: !produce.trim() || !audience.trim() || generating ? "rgba(255,255,255,0.3)" : "#04213F",
                  fontSize: 14, fontWeight: 600,
                  cursor: !produce.trim() || !audience.trim() || generating ? "not-allowed" : "pointer",
                  fontFamily: "inherit", letterSpacing: "0.02em",
                  transition: "all 0.2s",
                  boxShadow: produce.trim() && audience.trim() && !generating ? `0 4px 20px rgba(212,168,83,0.3)` : "none"
                }}>
                {generating ? "Building your prompt..." : "Generate prompt →"}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ animation: "slideUp 0.35s ease" }}>
            <div style={{
              fontSize: 10, fontWeight: 500, color: "rgba(212,168,83,0.7)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#D4A853", flexShrink: 0
              }}>3</span>
              Your prompt
            </div>

            {/* Prompt output */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${accent}40`,
              borderRadius: 16, padding: "1.5rem", marginBottom: 14,
              boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${accent}20`
            }}>
              <div style={{
                fontSize: 13.5, color: "#F0E8D5", lineHeight: 1.75,
                marginBottom: 16, fontStyle: "italic"
              }}>
                "{result.prompt}"
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => handleCopy(result.prompt)} style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  background: copied ? "rgba(126,200,164,0.2)" : `linear-gradient(135deg, ${accent}, ${accent}CC)`,
                  color: copied ? "#7EC8A4" : "#04213F",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s"
                }}>
                  {copied ? "✓ Copied" : "Copy prompt"}
                </button>
                <button onClick={() => setShowRefined(!showRefined)} style={{
                  padding: "8px 18px", borderRadius: 8,
                  border: `1px solid ${accent}50`,
                  background: "transparent", color: accent,
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit"
                }}>
                  {showRefined ? "Hide editor" : "Edit prompt"}
                </button>
              </div>
            </div>

            {/* Refine panel */}
            {showRefined && (
              <div style={{
                background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
                padding: "1.25rem", marginBottom: 14, animation: "slideUp 0.2s ease"
              }}>
                <div style={{ fontSize: 12, color: "rgba(240,232,213,0.5)", marginBottom: 8, letterSpacing: "0.02em" }}>
                  Edit your prompt
                </div>
                <textarea
                  value={refined || result.prompt}
                  onChange={e => setRefined(e.target.value)}
                  style={{
                    width: "100%", minHeight: 120, fontSize: 13, padding: "10px 14px",
                    borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(4,33,63,0.5)",
                    color: "#F0E8D5", fontFamily: "inherit", lineHeight: 1.6,
                    marginBottom: 10, resize: "vertical", outline: "none"
                  }}
                />
                <button onClick={() => handleCopy(refined || result.prompt)} style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
                  color: "#04213F", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit"
                }}>Copy edited prompt</button>
              </div>
            )}

            {/* CLEAR score */}
            <div style={{
              background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
              padding: "1.25rem", marginBottom: 14
            }}>
              <div style={{ fontSize: 11, color: "rgba(240,232,213,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                CLEAR score
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                {Object.entries(result.scores).map(([key, score]) => (
                  <div key={key} style={{
                    background: score === "pass" ? "rgba(126,200,164,0.1)" : "rgba(212,168,83,0.1)",
                    border: `1px solid ${score === "pass" ? "rgba(126,200,164,0.2)" : "rgba(212,168,83,0.2)"}`,
                    borderRadius: 10, padding: "10px 6px", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: score === "pass" ? "#7EC8A4" : "#D4A853" }}>{key}</div>
                    <div style={{ fontSize: 9, color: "rgba(240,232,213,0.35)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{CLEAR_LABELS[key]}</div>
                    <div style={{ fontSize: 16, marginTop: 4 }}>{score === "pass" ? "✅" : "⚠️"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why it was built this way */}
            <div style={{
              background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "1.25rem"
            }}>
              <div style={{ fontSize: 11, color: "rgba(240,232,213,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Why it was built this way
              </div>
              {result.explanation.map((point, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, paddingBottom: 12, marginBottom: 12,
                  borderBottom: i < result.explanation.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0, marginTop: 7,
                    background: accent
                  }} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: accent }}>{point.label}: </span>
                    <span style={{ fontSize: 13, color: "rgba(240,232,213,0.6)", lineHeight: 1.65 }}>{point.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(240,232,213,0.2) !important; }
        input, textarea, button { font-family: 'Georgia', serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,168,83,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
