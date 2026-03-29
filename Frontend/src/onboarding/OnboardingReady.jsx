import { useEffect, useState } from "react";

export default function OnboardingReady({ onNext, user, habits }) {
  const [tick, setTick] = useState(0);

  // Tick through checklist items appearing
  useEffect(() => {
    if (tick < 3) {
      const t = setTimeout(() => setTick(v => v + 1), 400);
      return () => clearTimeout(t);
    }
  }, [tick]);

  const checks = [
    { label: "Account ready",                  done: tick >= 1 },
    { label: `${habits?.length || 0} habits selected`, done: tick >= 2 },
    { label: "Reminder scheduled",             done: tick >= 3 },
  ];

  return (
    <div style={shell}>
      <div style={inner}>
        {/* Animated checkmark */}
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "linear-gradient(135deg, #f59132, #e24b4a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, marginBottom: 32,
          boxShadow: "0 16px 48px rgba(245,145,50,0.3)",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          🎉
        </div>

        <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
          You're all set{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h2>
        <p style={{ fontSize: 15, color: "#888", margin: "0 0 40px", lineHeight: 1.6, textAlign: "center" }}>
          Your habit tracker is ready. Start today and build your first streak.
        </p>

        {/* Checklist */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
          {checks.map((c, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", backgroundColor: "#1c1c1e", borderRadius: 14,
              opacity: c.done ? 1 : 0.3, transition: "opacity 0.4s ease",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                backgroundColor: c.done ? "#4cd964" : "#2a2a2a",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s",
                flexShrink: 0,
              }}>
                {c.done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 14, color: c.done ? "#fff" : "#666" }}>{c.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={tick < 3}
          style={{
            ...primaryBtn,
            opacity: tick < 3 ? 0.5 : 1,
            cursor: tick < 3 ? "not-allowed" : "pointer",
            transition: "opacity 0.4s",
          }}
        >
          Start Tracking 🔥
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const shell = { minHeight: "100vh", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" };
const inner = { display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 380, width: "100%", textAlign: "center" };
const primaryBtn = { width: "100%", padding: "16px", backgroundColor: "#f59132", color: "#fff", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700 };