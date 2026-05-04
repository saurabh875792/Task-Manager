import { useEffect, useState } from "react";
import API from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending",
    dueDate: "",
    projectId: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const fetchAll = async () => {
    try {
      const taskRes = await API.get("/tasks");
      const projRes = await API.get("/projects");

      setTasks(taskRes.data);
      setProjects(projRes.data);

      // 🔥 only admin fetch users
      if (user?.role === "admin") {
        const userRes = await API.get("/auth/users");
        setUsers(userRes.data.users);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 validation
    if (!form.title || !form.assignedTo || !form.projectId) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await API.post("/tasks", form);
      setForm({
        title: "",
        description: "",
        assignedTo: "",
        status: "pending",
        dueDate: "",
        projectId: "",
      });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create task");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchAll();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Tasks</h1>

      {/* 🔥 Only admin can create */}
      {user?.role === "admin" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleCreate} className="space-y-3">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <select
              value={form.projectId}
              onChange={(e) =>
                setForm({ ...form, projectId: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={form.assignedTo}
              onChange={(e) =>
                setForm({ ...form, assignedTo: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Assign User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Create Task
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>

            <p className="text-sm mt-2">
              <span className="font-semibold">Project:</span>{" "}
              {task.projectId?.name}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Assigned:</span>{" "}
              {task.assignedTo?.name || "Unassigned"}
            </p>

            <select
              value={task.status}
              onChange={(e) =>
                handleStatusChange(task._id, e.target.value)
              }
              className="mt-2 w-full p-1 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}