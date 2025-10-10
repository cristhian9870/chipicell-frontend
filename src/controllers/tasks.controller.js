import * as tasksService from "../services/tasks.service.js";

export const getTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await tasksService.getTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, description } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newTask = await tasksService.createTask(userId, {
      title,
      description,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    await tasksService.updateTask(userId, taskId, req.body);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    await tasksService.deleteTask(userId, taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
