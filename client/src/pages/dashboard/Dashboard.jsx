import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/api";

const taskValidationSchema = Yup.object({
    title: Yup.string().trim().required("Task title is required"),
    description: Yup.string().trim(),
    status: Yup.string().oneOf(["pending", "in-progress", "completed"])
});

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Helper to attach JWT token header
    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // 1. READ: Fetch all tasks for the logged-in user
    async function fetchTasks() {
        try {
            setFetching(true);
            setServerError("");
            const response = await api.get("/api/tasks", getAuthHeader());
            if (response.data.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to load tasks";
            setServerError(message);
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    // 2. CREATE: Formik setup for adding a task
    const initialValue = {
        title: "",
        description: "",
        status: "pending"
    };

    async function submitHandler(values, { resetForm }) {
        try {
            setServerError("");
            setLoading(true);

            const response = await api.post(
                "/api/tasks",
                values,
                getAuthHeader()
            );

            if (response.data.success) {
                // Add newest task to the top of the list and clear form
                setTasks([response.data.task, ...tasks]);
                resetForm();
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to create task";
            setServerError(message);
        } finally {
            setLoading(false);
        }
    }

    const { values, handleChange, handleSubmit, errors, touched, handleBlur } =
        useFormik({
            initialValues: initialValue,
            onSubmit: submitHandler,
            validationSchema: taskValidationSchema
        });

    // Helper for status badge colors
    const getBadgeClass = (status) => {
        if (status === "completed") return "bg-success";
        if (status === "in-progress") return "bg-warning text-dark";
        return "bg-secondary";
    };

    return (
        <section className="row mt-4">
            {/* Left Column: Add Task Form */}
            <div className="col-md-4 mb-4">
                <div className="card shadow-sm p-3">
                    <h4 className="mb-3">Add New Task</h4>

                    {serverError && (
                        <div className="alert alert-danger py-2">
                            {serverError}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                        className="d-flex flex-column gap-3"
                    >
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="form-label">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter task title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-control ${touched.title && errors.title
                                    ? "is-invalid"
                                    : ""
                                    }`}
                            />
                            {touched.title && errors.title && (
                                <span className="invalid-feedback">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                placeholder="Optional details..."
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-control"
                            ></textarea>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={values.status}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            {loading ? "Adding Task..." : "Add Task"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Column: Task List */}
            <div className="col-md-8">
                <h4 className="mb-3">My Tasks ({tasks.length})</h4>

                {fetching ? (
                    <p className="text-muted">Loading your tasks...</p>
                ) : tasks.length === 0 ? (
                    <div className="alert alert-light border text-center">
                        No tasks found. Create your first task on the left!
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {tasks.map((task) => (
                            <div key={task._id} className="card shadow-sm p-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="mb-1">{task.title}</h5>
                                        {task.description && (
                                            <p className="text-muted mb-0 small">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        className={`badge ${getBadgeClass(
                                            task.status
                                        )}`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}