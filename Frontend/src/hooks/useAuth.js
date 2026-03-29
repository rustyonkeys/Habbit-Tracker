// import { useState} from "react";

// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// export function useAuth() {
//   const [user, setUser] = useState(() => {
//   const stored = sessionStorage.getItem("ht_user");
//   return stored ? JSON.parse(stored) : null;
// });const [loading] = useState(false);
//   const loginWithGoogle = () => {
//     return new Promise((resolve, reject) => {
//       if (!window.google) {
//         reject(new Error("Google SDK not loaded"));
//         return;
//       }
//       window.google.accounts.oauth2
//         .initTokenClient({
//           client_id: GOOGLE_CLIENT_ID,
//           scope: "openid email profile",
//           callback: async (response) => {
//             if (response.error) { reject(response); return; }
//             try {
//               // Send token to your FastAPI backend
//               const res = await fetch("/api/auth/google", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ token: response.access_token }),
//               });
//               const data = await res.json();
//               // data = { access_token, user: { id, email, name, avatar } }
//               sessionStorage.setItem("ht_user", JSON.stringify(data.user));
//               sessionStorage.setItem("ht_token", data.access_token);
//               setUser(data.user);
//               resolve(data.user);
//             } catch (err) {
//               reject(err);
//             }
//           },
//         })
//         .requestAccessToken();
//     });
//   };

//   const logout = () => {
//     sessionStorage.removeItem("ht_user");
//     sessionStorage.removeItem("ht_token");
//     setUser(null);
//   };

//   return { user, loading, loginWithGoogle, logout };
// }

import { useState } from "react";

export function useAuth() {
  // Lazy init — reads sessionStorage once, no useEffect needed
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("ht_user");
    return stored ? JSON.parse(stored) : null;
  });

  const loginWithGoogle = () => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error("Google SDK not loaded"));
        return;
      }
      window.google.accounts.oauth2
        .initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: async (response) => {
            if (response.error) { reject(response); return; }
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.access_token }),
              });
              const data = await res.json();
              sessionStorage.setItem("ht_user",  JSON.stringify(data.user));
              sessionStorage.setItem("ht_token", data.access_token);
              setUser(data.user);
              resolve(data.user);
            } catch {
              reject(new Error("Failed to authenticate with server"));
            }
          },
        })
        .requestAccessToken();
    });
  };

  const logout = () => {
    sessionStorage.removeItem("ht_user");
    sessionStorage.removeItem("ht_token");
    setUser(null);
  };

  return { user, loginWithGoogle, logout };
}