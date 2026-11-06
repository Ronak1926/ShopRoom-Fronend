import { initializeApp, getApps } from "firebase/app";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Initialised without the popup/redirect resolver on purpose. getAuth() installs it, and that makes
 * every page that touches auth download Google's `apis.google.com` script and open a hidden
 * `firebaseapp.com` iframe straight away, whether or not anyone signs in with Google. Sign-in calls
 * pass `popupResolver` themselves, so that cost is only paid when someone clicks the button.
 */
function createAuth() {
  try {
    return initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence] });
  } catch {
    // Already initialised (hot reload in development).
    return getAuth(app);
  }
}

export const firebaseAuth = createAuth();
export const popupResolver = browserPopupRedirectResolver;
export const googleProvider = new GoogleAuthProvider();
