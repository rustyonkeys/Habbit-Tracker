import { useState, useEffect } from "react";

const HABITS_KEY = "habittracker_habits";
const COMPLETIONS_KEY = "habittracker_completions";

const EMOJI_OPTIONS = ["🧘", "💧", "💻", "📚", "🏃", "🎨", "🍎", "😴", "🏋️", "✍️"];

function generateActivityGrid(completions, habits) {
  const today = new Date();
  const days = [];
  for (let i = 69; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayCompletions = completions[key] || [];
    const total = habits.length;
    const done = dayCompletions.length;
    const ratio = total > 0 ? done / total : 0;
    days.push({ key, ratio, isToday: i === 0 });
  }
  return days;
}

function getStreak(completions, habits) {
  if (habits.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const done = (completions[key] || []).length;
    if (done === habits.length && habits.length > 0) {
      streak++;
    } else if (i === 0) {
      // today not complete, check yesterday for streak
      break;
    } else {
      break;
    }
  }
  return streak;
}

function getBestStreak(completions, habits) {
  if (habits.length === 0) return 0;
  const today = new Date();
  let best = 0;
  let current = 0;
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const done = (completions[key] || []).length;
    if (done === habits.length) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function ActivityCell({ ratio, isToday }) {
  const getColor = (r) => {
    if (r === 0) return "#2a2a2a";
    if (r <= 0.25) return "#7c3a0a";
    if (r <= 0.5) return "#b85e14";
    if (r <= 0.75) return "#e07820";
    return "#f59132";
  };
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 3,
        backgroundColor: getColor(ratio),
        border: isToday ? "1.5px solid #f59132" : "none",
        flexShrink: 0,
      }}
    />
  );
}

export default function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HABITS_KEY)) || [
        { id: "1", name: "Meditate", emoji: "🧘" },
        { id: "2", name: "Drink Water", emoji: "💧" },
        { id: "3", name: "Code", emoji: "💻" },
      ];
    } catch {
      return [];
    }
  });

  const [completions, setCompletions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPLETIONS_KEY)) || {};
    } catch {
      return {};
    }
  });

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🧘");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  }, [completions]);

  const todayKey = getTodayKey();
  const todayDone = (completions[todayKey] || []);
  const streak = getStreak(completions, habits);
  const bestStreak = getBestStreak(completions, habits);
  const completePct = habits.length > 0 ? Math.round((todayDone.length / habits.length) * 100) : 0;
  const activityDays = generateActivityGrid(completions, habits);

  const toggleHabit = (id) => {
    setCompletions((prev) => {
      const today = getTodayKey();
      const list = prev[today] || [];
      const updated = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...prev, [today]: updated };
    });
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const id = Date.now().toString();
    setHabits((prev) => [...prev, { id, name: newName.trim(), emoji: newEmoji }]);
    setNewName("");
    setNewEmoji("🧘");
    setShowAdd(false);
  };

  const removeHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setDeleteId(null);
  };

  const dayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#111111",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#ffffff",
      padding: "0 0 48px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "40px 20px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#fff", letterSpacing: 0.2 }}>Habits</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{dayLabel}</p>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Streak Card */}
        <div style={{
          backgroundColor: "#1c1c1e",
          borderRadius: 20,
          padding: "24px 20px 20px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, lineHeight: 1 }}>🔥</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{streak}</div>
            <div style={{ fontSize: 12, color: "#888", letterSpacing: 1.5, marginTop: 4 }}>DAY STREAK</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: "1px solid #2a2a2a", paddingTop: 16 }}>
            {[
              { label: "TODAY", value: `${todayDone.length}/${habits.length}` },
              { label: "COMPLETE", value: `${completePct}%` },
              { label: "BEST", value: bestStreak },
            ].map((item, i) => (
              <div key={i} style={{
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #2a2a2a" : "none",
              }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{item.value}</div>
                <div style={{ fontSize: 10, color: "#666", letterSpacing: 1, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{
            height: 6,
            backgroundColor: "#2a2a2a",
            borderRadius: 3,
            marginTop: 16,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${completePct}%`,
              backgroundColor: "#f59132",
              borderRadius: 3,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Activity Grid */}
        <div style={{
          backgroundColor: "#1c1c1e",
          borderRadius: 20,
          padding: "20px",
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 14 }}>Activity</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(14, 1fr)",
            gap: 4,
          }}>
            {activityDays.map((day) => (
              <ActivityCell key={day.key} ratio={day.ratio} isToday={day.isToday} />
            ))}
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            justifyContent: "flex-end",
          }}>
            <span style={{ fontSize: 10, color: "#555" }}>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
              <ActivityCell key={i} ratio={r} isToday={false} />
            ))}
            <span style={{ fontSize: 10, color: "#555" }}>More</span>
          </div>
        </div>

        {/* Daily Habits */}
        <div style={{
          backgroundColor: "#1c1c1e",
          borderRadius: 20,
          padding: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Daily Habits</div>
            <button
              onClick={() => setShowAdd(true)}
              style={{
                backgroundColor: "#2a2a2e",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              + Add
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {habits.length === 0 && (
              <p style={{ color: "#555", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                No habits yet. Add one to get started!
              </p>
            )}
            {habits.map((habit) => {
              const done = todayDone.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 4px",
                    borderBottom: "1px solid #2a2a2a",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleHabit(habit.id)}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    border: done ? "none" : "2px solid #555",
                    backgroundColor: done ? "#4cd964" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}>
                    {done && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Emoji */}
                  <span style={{ fontSize: 20 }}>{habit.emoji}</span>

                  {/* Name + streak */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: done ? "#888" : "#fff",
                      textDecoration: done ? "line-through" : "none",
                      transition: "all 0.2s",
                    }}>
                      {habit.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>
                      🔥 {getHabitStreak(completions, habit.id)} day streak
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(habit.id); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#444",
                      fontSize: 18,
                      cursor: "pointer",
                      padding: "4px 6px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          zIndex: 100,
        }} onClick={() => setShowAdd(false)}>
          <div
            style={{
              backgroundColor: "#1c1c1e",
              borderRadius: "24px 24px 0 0",
              padding: "24px 24px 40px",
              width: "100%",
              maxWidth: 420,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, color: "#fff" }}>New Habit</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>EMOJI</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    onClick={() => setNewEmoji(em)}
                    style={{
                      width: 40, height: 40,
                      borderRadius: 10,
                      border: newEmoji === em ? "2px solid #f59132" : "2px solid transparent",
                      backgroundColor: "#2a2a2e",
                      fontSize: 20,
                      cursor: "pointer",
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>NAME</div>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                placeholder="e.g. Morning Run"
                style={{
                  width: "100%",
                  backgroundColor: "#2a2a2e",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1, padding: "14px",
                  backgroundColor: "#2a2a2e",
                  color: "#888", border: "none",
                  borderRadius: 14, fontSize: 15,
                  cursor: "pointer", fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                style={{
                  flex: 1, padding: "14px",
                  backgroundColor: "#f59132",
                  color: "#fff", border: "none",
                  borderRadius: 14, fontSize: 15,
                  cursor: "pointer", fontWeight: 600,
                }}
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: "#1c1c1e",
            borderRadius: 20,
            padding: "28px 24px",
            width: 300,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "#fff" }}>Delete Habit?</div>
            <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>This will remove the habit and its history.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{
                flex: 1, padding: "12px", backgroundColor: "#2a2a2e",
                color: "#fff", border: "none", borderRadius: 12, fontSize: 15, cursor: "pointer",
              }}>Cancel</button>
              <button onClick={() => removeHabit(deleteId)} style={{
                flex: 1, padding: "12px", backgroundColor: "#e24b4a",
                color: "#fff", border: "none", borderRadius: 12, fontSize: 15, cursor: "pointer", fontWeight: 600,
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getHabitStreak(completions, habitId) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if ((completions[key] || []).includes(habitId)) {
      streak++;
    } else if (i === 0) {
      break;
    } else {
      break;
    }
  }
  return streak;
}
