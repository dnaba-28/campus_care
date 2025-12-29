
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAOkFzh4hrruj4FyF-IfcVJeuatZBc8Zkw",
  authDomain: "studio-8954641290-81428.firebaseapp.com",
  databaseURL: "https://studio-8954641290-81428-default-rtdb.firebaseio.com",
  projectId: "studio-8954641290-81428",
  storageBucket: "studio-8954641290-81428.appspot.com",
  messagingSenderId: "94432253484",
  appId: "1:94432253484:web:5776b7bb6f3238d9e3a389"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
