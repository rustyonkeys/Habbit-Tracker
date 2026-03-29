export default function OnboardingWelcome({ onNext }) {
  return (
    <div style={shell}>
      <div style={inner}>
        {/* Animated logo */}
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: "linear-gradient(135deg, #f59132 0%, #e24b4a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52, marginBottom: 40,
          boxShadow: "0 20px 60px rgba(245,145,50,0.35)",
          animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          🔥
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: -0.5 }}>
          Build habits that stick.
        </h1>
        <p style={{ fontSize: 16, color: "#888", lineHeight: 1.6, margin: "0 0 60px", maxWidth: 280, textAlign: "center" }}>
          Track your daily habits, visualize progress, and build streaks that motivate you every day.
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginBottom: 48 }}>
          {[
            { icon: "🔥", text: "Daily streaks that keep you going"    },
            { icon: "📊", text: "Visual activity grid like GitHub"      },
            { icon: "🔔", text: "Smart reminders at your chosen time"   },
          ].map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", backgroundColor: "#1c1c1e",
              borderRadius: 14, animation: `fadeUp 0.4s ${0.1 * i + 0.3}s both`,
            }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <span style={{ fontSize: 14, color: "#ccc" }}>{f.text}</span>
            </div>
          ))}
        </div>

        <button onClick={onNext} style={primaryBtn}>
          Get Started
        </button>
        <p style={{ fontSize: 12, color: "#555", marginTop: 16 }}>Free forever · No credit card needed</p>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const shell = {
  minHeight: "100vh",
  backgroundColor: "#111111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
};

const inner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: 380,
  width: "100%",
  textAlign: "center",
};

const primaryBtn = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#f59132",
  color: "#fff",
  border: "none",
  borderRadius: 16,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 0.3,
};