import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export const AUTH_EVENT = "statwise-auth-change";

/**
 * Returns current authenticated user object or null.
 */
export function getAuthUser() {
  try {
    const rawUser = localStorage.getItem("statwise_user");
    const token = localStorage.getItem("statwise_token");

    if (!rawUser && !token) return null;

    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        if (typeof parsed === "object" && parsed !== null) {
          const email = parsed.email || "";
          const name = parsed.name || parsed.full_name || (email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Student");
          return {
            uid: parsed.uid || "usr_" + Math.random().toString(36).slice(2, 8),
            name,
            email,
            photo: parsed.photo || null,
            isAuthenticated: true,
          };
        }
      } catch {
        // Plain email string
        const email = String(rawUser).trim();
        const name = email ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Student";
        return {
          uid: "usr_email_" + Math.random().toString(36).slice(2, 8),
          name,
          email,
          photo: null,
          isAuthenticated: true,
        };
      }
    }

    if (token) {
      return {
        uid: "usr_token",
        name: "Student",
        email: "student@aspirants.ai",
        photo: null,
        isAuthenticated: true,
      };
    }
  } catch (err) {
    console.error("Error reading auth state:", err);
  }
  return null;
}

/**
 * Helper to check authentication status.
 */
export function isAuthenticated() {
  return getAuthUser() !== null;
}

/**
 * Sets auth session in localStorage and broadcasts event.
 */
export function setAuthSession(user, token = "session_" + Date.now()) {
  const userObj = typeof user === "string"
    ? {
        email: user,
        name: user.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        isAuthenticated: true,
      }
    : {
        ...user,
        isAuthenticated: true,
      };

  localStorage.setItem("statwise_user", JSON.stringify(userObj));
  localStorage.setItem("statwise_token", token);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * Fully logs out user, clears all storage and notifies all listeners.
 */
export async function logoutUser() {
  try {
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
  } catch (e) {
    console.warn("Firebase signout error:", e);
  }

  localStorage.removeItem("statwise_user");
  localStorage.removeItem("statwise_token");
  localStorage.removeItem("statwise_pending_user");
  localStorage.removeItem("pending_email");
  localStorage.removeItem("demo_otp");
  localStorage.removeItem("statwise_remember");

  window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * React hook for components needing reactive auth state.
 */
export function useAuth() {
  const [user, setUser] = useState(getAuthUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getAuthUser());
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    // Also sync Firebase state if initialized
    let unsubscribe = () => {};
    if (auth) {
      try {
        unsubscribe = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            const current = getAuthUser();
            if (!current) {
              const u = {
                uid: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student",
                email: fbUser.email || "",
                photo: fbUser.photoURL || null,
                isAuthenticated: true,
              };
              localStorage.setItem("statwise_user", JSON.stringify(u));
              localStorage.setItem("statwise_token", "fb_" + fbUser.uid);
              setUser(u);
            }
          }
        });
      } catch (e) {
        // Firebase optional
      }
    }

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    logout: logoutUser,
    login: setAuthSession,
  };
}
