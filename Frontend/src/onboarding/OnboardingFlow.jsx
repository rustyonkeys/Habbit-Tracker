import { useState } from "react";
import OnboardingWelcome  from "./OnboardingWelcome";
import OnboardingSignIn   from "./OnboardingSignIn";
import OnboardingHabits   from "./OnboardingHabits";
import OnboardingReminder from "./OnboardingReminder";
import OnboardingReady    from "./OnboardingReady";

// Slide-in transition wrapper
function SlideScreen({ children, direction = "right" }) {
  return (
    <div style={{
      animation: `slideIn${direction} 0.35s cubic-bezier(0.4,0,0.2,1) forwards`,
      minHeight: "100vh",
    }}>
      {children}
    </div>
  );
}

const SCREENS = ["welcome", "signin", "habits", "reminder", "ready"];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep]           = useState(0);
  const [userData, setUserData]   = useState(null);
  const [habits, setHabits]       = useState([]);
  const [reminder, setReminder]   = useState("08:00");

  const next = (data = {}) => {
    if (data.user)     setUserData(data.user);
    if (data.habits)   setHabits(data.habits);
    if (data.reminder) setReminder(data.reminder);
    if (step < SCREENS.length - 1) setStep(s => s + 1);
    else onComplete({ user: userData, habits, reminder });
  };

  const back = () => setStep(s => Math.max(0, s - 1));

  const screens = [
    <OnboardingWelcome  key="welcome"  onNext={next} />,
    <OnboardingSignIn   key="signin"   onNext={next} onBack={back} />,
    <OnboardingHabits   key="habits"   onNext={next} onBack={back} />,
    <OnboardingReminder key="reminder" onNext={next} onBack={back} />,
    <OnboardingReady    key="ready"    onNext={next} user={userData} habits={habits} />,
  ];

  return (
    <>
      <style>{`
        @keyframes slideInright {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes slideInleft {
          from { transform: translateX(-40px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      {/* Progress dots */}
      {step > 0 && step < SCREENS.length - 1 && (
        <div style={{
          position: "fixed", top: 20, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 6, zIndex: 50,
        }}>
          {SCREENS.slice(1, -1).map((_, i) => (
            <div key={i} style={{
              width: i === step - 1 ? 20 : 6,
              height: 6, borderRadius: 3,
              backgroundColor: i === step - 1 ? "#f59132" : "#333",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}

      <SlideScreen key={step}>{screens[step]}</SlideScreen>
    </>
  );
}