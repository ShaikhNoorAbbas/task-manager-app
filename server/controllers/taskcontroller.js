import Task from "../models/Task.js";

// 1. CREATE a new task (POST /api/tasks)
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            user: req.userId // Comes from authMiddleware!
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create task",
            error: error.message
        });
    }
};

// 2. READ all tasks for the logged-in user (GET /api/tasks)
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
};

// 3. UPDATE a task (PUT /api/tasks/:id)
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user: req.userId }, // Must match both Task ID and Owner ID
            { title, description, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: error.message
        });
    }
};

// 4. DELETE a task (DELETE /api/tasks/:id)
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findOneAndDelete({
            _id: id,
            user: req.userId // Must match both Task ID and Owner ID
        });

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete task",
            error: error.message
        });
    }
};