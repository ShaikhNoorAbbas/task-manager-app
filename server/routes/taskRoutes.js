import express from "express";
import authmiddleware from "../middleware/authMiddleware.js";

import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskcontroller.js";

const router = express.Router();


router.use(authmiddleware);

// POST /api/tasks -> Create a task
router.post("/", createTask);

// GET /api/tasks -> Get all tasks for logged-in user
router.get("/", getTasks);

// PUT /api/tasks/:id -> Update a specific task
router.put("/:id", updateTask);

// DELETE /api/tasks/:id -> Delete a specific task
router.delete("/:id", deleteTask);

export default router;