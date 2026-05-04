import { useEffect, useState } from "react";
import API from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [memberData, setMemberData] = useState({
    projectId: "",
    userId: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      if (user?.role === "admin") {
        const res = await API.get("/auth/users");
        setUsers(res.data.users);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create project");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects/add-member", memberData);
      setMemberData({ projectId: "", userId: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add member");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Projects</h1>

      {user?.role === "admin" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Project</h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />

            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Create
            </button>
          </form>
        </div>
      )}

      {user?.role === "admin" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Member</h2>

          <form onSubmit={handleAddMember} className="space-y-3">
            <select
              value={memberData.projectId}
              onChange={(e) =>
                setMemberData({ ...memberData, projectId: e.target.value })
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
              value={memberData.userId}
              onChange={(e) =>
                setMemberData({ ...memberData, userId: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
              Add Member
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div key={proj._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{proj.name}</h3>
            <p className="text-sm text-gray-600">{proj.description}</p>

            <p className="text-sm mt-2">
              <span className="font-semibold">Members:</span>{" "}
              {proj.members?.map((m) => m.name).join(", ")}
            </p>

            {user?.role === "admin" && (
              <button
                onClick={() => handleDelete(proj._id)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}