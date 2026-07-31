import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAskSly2t3yGeHe0Zzwu6sRWnLNl4FF9qE",
  authDomain: "rev3-36be7.firebaseapp.com",
  projectId: "rev3-36be7",
  storageBucket: "rev3-36be7.firebasestorage.app",
  messagingSenderId: "122239657705",
  appId: "1:122239657705:web:b24f8611fdad8648247278"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Anonymous sign in for the public board and reading stats
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous sign in failed: ", error);
});
