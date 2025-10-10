import { db } from "../config/firebase.config.js";

const taskRef = (userId) =>
  db.collection("users").doc(userId).collection("tasks");

export const getTasks = async (userId) => {
  const data = await taskRef(userId).get();
  if (data.empty) {
    return [];
  }
  const tasks = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return tasks;
};

export const createTask = async (userId, data) => {
  const newTask = {
    ...data,
    completed: false,
    creationDate: new Date(),
  };
  const createdTask = await taskRef(userId).add(newTask);
  return { id: createdTask.id, ...newTask };
};

export const updateTask = async (userId, taskId, data) => {
  await taskRef(userId).doc(taskId).update(data);
};

export const deleteTask = async (userId, taskId) => {
  await taskRef(userId).doc(taskId).delete();
};
