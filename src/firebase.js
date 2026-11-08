import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  // Your Web App config object from the Firebase Console
};

// Initialize the core Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase AI Logic (using the no-cost Gemini Developer API)
export const ai = getAI(app, { backend: new GoogleAIBackend() });

// Define and export your reusable Generative Model
export const model = getGenerativeModel(ai, { model: "gemini-3.7-flash" });
