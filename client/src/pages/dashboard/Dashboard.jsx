import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/api";

const taskValidationSchema = Yup.object({
  title: Yup.string().trim().required("Task title is required"),
  description: Yup.string().trim(),
  status: Yup.string().oneOf(["pending", "in-progress", "completed"]),
});

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Tracks which task is being edited (null = Create mode)
  const [editingTaskId, setEditingTaskId] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // 1. READ: Fetch all tasks
  async function fetchTasks() {
    try {
      setFetching(true);
      setServerError("");
      const response = await api.get("/api/tasks", getAuthHeader());
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load tasks";
      setServerError(message);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const initialValue = {
    title: "",
    description: "",
    status: "pending",
  };

  // 2. CREATE & 3. UPDATE: Single submit handler for both modes
  async function submitHandler(values, { resetForm }) {
    try {
      setServerError("");
      setLoading(true);

      if (editingTaskId) {
        // UPDATE existing task (PUT)
        const response = await api.put(
          `/api/tasks/${editingTaskId}`,
          values,
          getAuthHeader(),
        );

        if (response.data.success) {
          setTasks(
            tasks.map((task) =>
              task._id === editingTaskId ? response.data.task : task,
            ),
          );
          setEditingTaskId(null);
          resetForm();
        }
      } else {
        // CREATE new task (POST)
        const response = await api.post("/api/tasks", values, getAuthHeader());

        if (response.data.success) {
          setTasks([response.data.task, ...tasks]);
          resetForm();
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  }

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: initialValue,
    onSubmit: submitHandler,
    validationSchema: taskValidationSchema,
  });

  // Load selected task into the form for editing
  const handleEditClick = (task) => {
    setServerError("");
    setEditingTaskId(task._id);
    setValues({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
  };

  // Cancel editing and return form to Create mode
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    resetForm();
  };

  // 4. DELETE: Remove a task (DELETE)
  const handleDeleteClick = async (id) => {
    try {
      setServerError("");
      const response = await api.delete(`/api/tasks/${id}`, getAuthHeader());

      if (response.data.success) {
        setTasks(tasks.filter((task) => task._id !== id));
        if (editingTaskId === id) {
          handleCancelEdit();
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task";
      setServerError(message);
    }
  };

  const getBadgeClass = (status) => {
    if (status === "completed") return "bg-success";
    if (status === "in-progress") return "bg-warning text-dark";
    return "bg-secondary";
  };

  return (
    <section className="row mt-4">
      {/* Left Column: Add / Edit Task Form */}
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm p-3">
          <h4 className="mb-3">
            {editingTaskId ? "Edit Task" : "Add New Task"}
          </h4>

          {serverError && (
            <div className="alert alert-danger py-2">{serverError}</div>
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
                className={`form-control ${
                  touched.title && errors.title ? "is-invalid" : ""
                }`}
              />
              {touched.title && errors.title && (
                <span className="invalid-feedback">{errors.title}</span>
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

            {/* Submit & Cancel Buttons */}
            <div className="d-flex gap-2">
              <button
                disabled={loading}
                type="submit"
                className={`btn w-100 ${
                  editingTaskId ? "btn-warning" : "btn-primary"
                }`}
              >
                {loading
                  ? "Saving..."
                  : editingTaskId
                    ? "Update Task"
                    : "Add Task"}
              </button>

              {editingTaskId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
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
                      <p className="text-muted mb-2 small">
                        {task.description}
                      </p>
                    )}
                    <span className={`badge ${getBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
