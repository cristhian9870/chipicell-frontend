import { db } from "../config/firebase.config.js";

export const createUser = async (email, hashedPassword, name) => {
  const newClient = {
    nombres: name,
    email,
    contrasena: hashedPassword,
    fechaRegistro: new Date().toISOString(),
    apellidos: "",
    direccion: "",
    referenciaDireccion: "",
    dni: "",
  };

  const clientRef = await db.collection("clientes").add(newClient);

  return {
    id: clientRef.id,
    nombres: newClient.nombres,
    email: newClient.email,
  };
};

export const getUserByEmail = async (email) => {
  const snapshot = await db.collection("clientes").where("email", "==", email).get();
  if (snapshot.empty) return null;

  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() };
};
