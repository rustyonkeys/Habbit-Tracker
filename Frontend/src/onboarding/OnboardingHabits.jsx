import { useState } from "react";

const STARTER_HABITS = [
  { id: "meditate",  name: "Meditate",      emoji: "🧘", desc: "5 min daily"     },
  { id: "water",     name: "Drink Water",   emoji: "💧", desc: "8 glasses"       },
  { id: "code",      name: "Code",          emoji: "💻", desc: "30 min daily"    },
  { id: "read",      name: "Read",          emoji: "📚", desc: "20 pages"        },
  { id: "exercise",  name: "Exercise",      emoji: "🏃", desc: "30 min"          },
  { id: "journal",   name: "Journal",       emoji: "✍️", desc: "Before bed"      },
  { id: "sleep",     name: "Sleep 8hrs",    emoji: "😴", desc: "By 11pm"         },
  { id: "nosugar",   name: "No Junk Food",  emoji: "🍎", desc: "Eat clean"       },
];

export default function OnboardingHabits({ onNext, onBack }) {
  const [selected, setSelected] = useState(["meditate", "water", "code"]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    const chosenHabits = STARTER_HABITS
      .filter(h => selected.includes(h.id))
      .map(h => ({ id: h.id, name: h.name, emoji: h.emoji }));
    onNext({ habits: chosenHabits });
  };

  return (
    <div style={shell}>
      <button onClick={onBack} style={backBtn}>← Back</button>

      <div style={{ maxWidth: 420, width: "100%", padding: "0 24px" }}>
        <div style={{ marginBottom: 32, paddingTop: 60 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
            Choose your habits
          </h2>
          <p style={{ fontSize: 15, color: "#888", margin: 0 }}>
            Pick habits to track. You can always add more later.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
          {STARTER_HABITS.map((h) => {
            const active = selected.includes(h.id);
            return (
              <button
                key={h.id}
                onClick={() => toggle(h.id)}
                style={{
                  padding: "16px 14px",
                  backgroundColor: active ? "#1e1408" : "#1c1c1e",
                  border: active ? "1.5px solid #f59132" : "1.5px solid transparent",
                  borderRadius: 16, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{h.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: active ? "#f59132" : "#fff" }}>{h.name}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{h.desc}</div>
                {active && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    width: 18, height: 18, borderRadius: "50%",
                    backgroundColor: "#f59132",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#666" }}>
            {selected.length} habit{selected.length !== 1 ? "s" : ""} selected
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          style={{
            ...primaryBtn,
            opacity: selected.length === 0 ? 0.4 : 1,
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", backgroundColor: "#111111", display: "flex", justifyContent: "center", position: "relative" };
const backBtn = { position: "absolute", top: 24, left: 24, background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer" };
const primaryBtn = { width: "100%", padding: "16px", backgroundColor: "#f59132", color: "#fff", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700 };