import { useState } from "react";

const QUICK_TIMES = [
  { label: "Early bird", time: "06:00", icon: "🌅" },
  { label: "Morning",    time: "08:00", icon: "☀️" },
  { label: "Midday",     time: "12:00", icon: "🌤" },
  { label: "Evening",    time: "18:00", icon: "🌆" },
  { label: "Night owl",  time: "21:00", icon: "🌙" },
];

export default function OnboardingReminder({ onNext, onBack }) {
  const [time,    setTime]    = useState("08:00");
  const [enabled, setEnabled] = useState(true);

  const handleNext = () => onNext({ reminder: enabled ? time : null });

  const fmt = (t) => {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour   = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  return (
    <div style={shell}>
      <button onClick={onBack} style={backBtn}>← Back</button>

      <div style={{ maxWidth: 420, width: "100%", padding: "0 24px" }}>
        <div style={{ marginBottom: 36, paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
            Set a reminder
          </h2>
          <p style={{ fontSize: 15, color: "#888", margin: 0 }}>
            We'll nudge you daily so you never break your streak.
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", backgroundColor: "#1c1c1e", borderRadius: 14, marginBottom: 20,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Daily reminder</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Get notified to log your habits</div>
          </div>
          <div
            onClick={() => setEnabled(v => !v)}
            style={{
              width: 48, height: 28, borderRadius: 14, cursor: "pointer",
              backgroundColor: enabled ? "#f59132" : "#333",
              position: "relative", transition: "background 0.2s",
            }}
          >
            <div style={{
              position: "absolute", top: 3,
              left: enabled ? 23 : 3,
              width: 22, height: 22, borderRadius: "50%",
              backgroundColor: "#fff", transition: "left 0.2s",
            }} />
          </div>
        </div>

        {enabled && (
          <>
            {/* Quick pick */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {QUICK_TIMES.map((qt) => (
                <button
                  key={qt.time}
                  onClick={() => setTime(qt.time)}
                  style={{
                    padding: "8px 12px", borderRadius: 10,
                    border: time === qt.time ? "1.5px solid #f59132" : "1.5px solid #2a2a2a",
                    backgroundColor: time === qt.time ? "#1e1408" : "#1c1c1e",
                    color: time === qt.time ? "#f59132" : "#aaa",
                    fontSize: 12, fontWeight: 500, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  <span>{qt.icon}</span> {qt.label}
                </button>
              ))}
            </div>

            {/* Custom time */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>CUSTOM TIME</div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  width: "100%", backgroundColor: "#1c1c1e", border: "1.5px solid #2a2a2a",
                  borderRadius: 12, padding: "14px 16px", color: "#fff",
                  fontSize: 22, fontWeight: 600, outline: "none",
                  textAlign: "center", boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              />
            </div>

            <div style={{
              padding: "12px 16px", backgroundColor: "#1c1c1e",
              borderRadius: 12, marginBottom: 28, textAlign: "center",
            }}>
              <span style={{ fontSize: 13, color: "#888" }}>You'll be reminded at </span>
              <span style={{ fontSize: 13, color: "#f59132", fontWeight: 600 }}>{fmt(time)}</span>
              <span style={{ fontSize: 13, color: "#888" }}> every day</span>
            </div>
          </>
        )}

        <button onClick={handleNext} style={primaryBtn}>
          {enabled ? "Set Reminder" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}

const shell = { minHeight: "100vh", backgroundColor: "#111111", display: "flex", justifyContent: "center", position: "relative" };
const backBtn = { position: "absolute", top: 24, left: 24, background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer" };
const primaryBtn = { width: "100%", padding: "16px", backgroundColor: "#f59132", color: "#fff", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: "pointer" };