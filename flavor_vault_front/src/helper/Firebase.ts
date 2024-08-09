import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvV5GXG5lL1vha4GimGCgn4PlgC1JIaBQ",
  authDomain: "flavor-vault.firebaseapp.com",
  projectId: "flavor-vault",
  storageBucket: "flavor-vault.appspot.com",
  messagingSenderId: "320173037641",
  appId: "1:320173037641:web:6399826ae717c70011c798",
  measurementId: "G-17JT7CY3VD"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL  };