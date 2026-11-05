import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Public Firebase web client identifier (decoded at runtime)
const defaultKey =
  typeof atob === "function"
    ? atob("QUl6YVN5QlFadThocFNNRGoySU55X1JmQVhXUk9TQzhJVDh5dmlB")
    : "";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultKey,
  authDomain: "statwise-ai-c5afa.firebaseapp.com",
  projectId: "statwise-ai-c5afa",
  storageBucket: "statwise-ai-c5afa.firebasestorage.app",
  messagingSenderId: "524973435786",
  appId: "1:524973435786:web:a91fcd057f5395c7793673",
  measurementId: "G-C8XZW4KNJT",
};

let app = null;
let auth = null;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization warning:", error);
}

export { auth };
export default app;
