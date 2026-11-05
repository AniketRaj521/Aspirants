import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: "statwise-ai-c5afa.firebaseapp.com",
  projectId: "statwise-ai-c5afa",
  storageBucket: "statwise-ai-c5afa.firebasestorage.app",
  messagingSenderId: "524973435786",
  appId: "1:524973435786:web:a91fcd057f5395c7793673",
  measurementId: "G-C8XZW4KNJT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
