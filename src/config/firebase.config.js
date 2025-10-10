import admin from "firebase-admin";
//import serviceAccount from "../firebase-key.json" assert { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../firebase-key.json");

// Inciamos firebase con la clave
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exportamos la instancia de firestore
export const db = admin.firestore();
