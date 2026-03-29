// import { useState, useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";

// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// export default function OnboardingSignIn({ onNext, onBack }) {
//   const { loginWithGoogle } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState("");

//   // Load Google SDK
//   useEffect(() => {
//     if (window.google) return;
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     document.head.appendChild(script);
//   }, []);

//   const handleGoogle = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const user = await loginWithGoogle();
//       onNext({ user });
//     } catch (err) {
//       setError("Sign-in failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Dev bypass — remove in production
//   const handleDevBypass = () => {
//     onNext({ user: { id: "dev", name: "Dev User", email: "dev@test.com", avatar: null } });
//   };

//   return (
//     <div style={shell}>
//       <button onClick={onBack} style={backBtn}>← Back</button>

//       <div style={inner}>
//         <div style={{ fontSize: 56, marginBottom: 24 }}>👋</div>
//         <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
//           Welcome back
//         </h2>
//         <p style={{ fontSize: 15, color: "#888", margin: "0 0 48px", lineHeight: 1.5 }}>
//           Sign in to sync your habits across all your devices.
//         </p>

//         {/* Google Sign-In button */}
//         <button
//           onClick={handleGoogle}
//           disabled={loading}
//           style={{
//             width: "100%", padding: "15px 20px",
//             backgroundColor: loading ? "#222" : "#fff",
//             color: "#111", border: "none", borderRadius: 14,
//             fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
//             display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
//             transition: "all 0.2s", opacity: loading ? 0.7 : 1,
//           }}
//         >
//           {loading ? (
//             <Spinner />
//           ) : (
//             <>
//               <GoogleIcon />
//               Continue with Google
//             </>
//           )}
//         </button>

//         {error && (
//           <div style={{
//             marginTop: 16, padding: "12px 16px",
//             backgroundColor: "#2a1515", borderRadius: 10,
//             color: "#e24b4a", fontSize: 13, width: "100%", textAlign: "center",
//           }}>
//             {error}
//           </div>
//         )}

//         {/* Divider */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0", width: "100%" }}>
//           <div style={{ flex: 1, height: 1, backgroundColor: "#222" }} />
//           <span style={{ color: "#555", fontSize: 12 }}>or</span>
//           <div style={{ flex: 1, height: 1, backgroundColor: "#222" }} />
//         </div>

//         {/* Dev bypass */}
//         <button onClick={handleDevBypass} style={{
//           width: "100%", padding: "14px",
//           backgroundColor: "transparent",
//           color: "#555", border: "1px solid #2a2a2a",
//           borderRadius: 14, fontSize: 14, cursor: "pointer",
//         }}>
//           Continue without account (local only)
//         </button>

//         {/* Trust badges */}
//         <div style={{ display: "flex", gap: 20, marginTop: 36 }}>
//           {["🔒 Private", "☁️ Synced", "📵 No spam"].map((b, i) => (
//             <span key={i} style={{ fontSize: 12, color: "#555" }}>{b}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function GoogleIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 18 18">
//       <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
//       <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
//       <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
//       <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
//     </svg>
//   );
// }

// function Spinner() {
//   return (
//     <div style={{
//       width: 18, height: 18, borderRadius: "50%",
//       border: "2px solid #333", borderTopColor: "#f59132",
//       animation: "spin 0.7s linear infinite",
//     }}>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }

// const shell = { minHeight: "100vh", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" };
// const inner = { display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 360, width: "100%", textAlign: "center" };
// const backBtn = { position: "absolute", top: 24, left: 24, background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer" };


import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function OnboardingSignIn({ onNext, onBack }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (window.google) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await loginWithGoogle();
      onNext({ user });
    } catch {                        // ✅ no unused `err`
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    onNext({ user: { id: "dev", name: "Dev User", email: "dev@test.com", avatar: null } });
  };

  return (
    <div style={shell}>
      <button onClick={onBack} style={backBtn}>← Back</button>
      <div style={inner}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>👋</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Welcome back</h2>
        <p style={{ fontSize: 15, color: "#888", margin: "0 0 48px", lineHeight: 1.5 }}>
          Sign in to sync your habits across all your devices.
        </p>

        <button onClick={handleGoogle} disabled={loading} style={{
          width: "100%", padding: "15px 20px",
          backgroundColor: loading ? "#222" : "#fff",
          color: "#111", border: "none", borderRadius: 14,
          fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          opacity: loading ? 0.7 : 1, transition: "all 0.2s",
        }}>
          {loading ? <Spinner /> : <><GoogleIcon /> Continue with Google</>}
        </button>

        {error && (
          <div style={{
            marginTop: 16, padding: "12px 16px",
            backgroundColor: "#2a1515", borderRadius: 10,
            color: "#e24b4a", fontSize: 13, width: "100%", textAlign: "center",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0", width: "100%" }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "#222" }} />
          <span style={{ color: "#555", fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#222" }} />
        </div>

        <button onClick={handleDevBypass} style={{
          width: "100%", padding: "14px", backgroundColor: "transparent",
          color: "#555", border: "1px solid #2a2a2a", borderRadius: 14, fontSize: 14, cursor: "pointer",
        }}>
          Continue without account (local only)
        </button>

        <div style={{ display: "flex", gap: 20, marginTop: 36 }}>
          {["🔒 Private", "☁️ Synced", "📵 No spam"].map((b, i) => (
            <span key={i} style={{ fontSize: 12, color: "#555" }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        border: "2px solid #333", borderTopColor: "#f59132",
        animation: "spin 0.7s linear infinite",
      }} />
    </>
  );
}

const shell = { minHeight: "100vh", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" };
const inner = { display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 360, width: "100%", textAlign: "center" };
const backBtn = { position: "absolute", top: 24, left: 24, background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer" };