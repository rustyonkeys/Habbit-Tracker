import { useState } from "react";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import HabitTracker   from "./HabitTracker";

export default function App() {
  const [onboarded, setOnboarded] = useState(
    () => !!sessionStorage.getItem("ht_onboarded")
  );

  const handleOnboardingComplete = (onboardingData) => {
    // TODO: POST onboardingData to /api/onboard
    console.log("Onboarding complete:", onboardingData);
    sessionStorage.setItem("ht_onboarded", "1");
    setOnboarded(true);
  };

  return onboarded
    ? <HabitTracker />
    : <OnboardingFlow onComplete={handleOnboardingComplete} />;
}