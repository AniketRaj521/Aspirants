import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";
import { setAuthSession } from "../services/authStore";

export default function GoogleLogin({ mode = "signin" }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      toast.loading("Signing you in with Google...", {
        id: "google-login",
      });

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log("Google Login Successful:", user);

      const token = await user.getIdToken();
      setAuthSession({
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Student",
        email: user.email || "",
        photo: user.photoURL || "",
        isAuthenticated: true,
      }, token);

      toast.success(
        `Welcome ${user.displayName || "to STATWISE AI"}!`,
        {
          id: "google-login",
        }
      );

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);

    } catch (error) {
      console.error("Google Login Error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google login was cancelled.", {
          id: "google-login",
        });
      } else if (error.code === "auth/popup-blocked") {
        toast.error(
          "Please allow popups for this website.",
          {
            id: "google-login",
          }
        );
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error(
          "This domain is not authorized in Firebase.",
          {
            id: "google-login",
          }
        );
      } else {
        toast.error(
          error.message || "Unable to sign in with Google.",
          {
            id: "google-login",
          }
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="w-full flex justify-center"
    >
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-14 rounded-xl border border-[#172033]/10 bg-white hover:bg-[#FFFDF5] hover:border-[#F4C430] transition-all flex items-center justify-center gap-3 font-bold text-[#172033] shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-[#172033]/20 border-t-[#172033] rounded-full animate-spin" />

            <span>
              Signing in with Google...
            </span>
          </>
        ) : (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
              />

              <path
                fill="#34A853"
                d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.17.31-1.69V7.78H3.3A9.74 9.74 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.22l3.24-2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.28c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28Z"
              />
            </svg>

            <span>
              {mode === "signup"
                ? "Sign up with Google"
                : "Continue with Google"}
            </span>
          </>
        )}
      </button>
    </motion.div>
  );
}