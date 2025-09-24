import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0iFEHIACZ_Fx2Rerfm93hCDMQ9vMLu0M",
  authDomain: "oxvoidmain-gatewayz.firebaseapp.com",
  projectId: "oxvoidmain-gatewayz",
  storageBucket: "oxvoidmain-gatewayz.firebasestorage.app",
  messagingSenderId: "1040867084001",
  appId: "1:1040867084001:web:1ac1fd71c959f9a21499a0",
  measurementId: "G-YFL2PSB07D"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configure providers
googleProvider.addScope('profile');
googleProvider.addScope('email');
githubProvider.addScope('user:email');

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    throw error;
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = () => signOut(auth);

export { app, auth, db, onAuthStateChanged, type User };
