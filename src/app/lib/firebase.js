// lib/firebase.js
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json"; // cheia ta Firebase

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
export { admin, db };
