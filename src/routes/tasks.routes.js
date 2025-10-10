import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

const router = Router();

router.get("/:userId", getTasks);
router.post("/:userId", createTask);
router.put("/:userId/:taskId", updateTask);
router.delete("/:userId/:taskId", deleteTask);

export default router;
