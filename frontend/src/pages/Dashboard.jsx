import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const projRes = await API.get("/projects");
      const taskRes = await API.get("/tasks");
      setProjects(projRes.data);
      setTasks(taskRes.data);
    };
    fetchData();
  }, []);

  const completed = tasks.filter(t => t.status === "completed").length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">Projects: {projects.length}</div>
        <div className="bg-white p-4 rounded shadow">Tasks: {tasks.length}</div>
        <div className="bg-white p-4 rounded shadow">Completed: {completed}</div>
        <div className="bg-white p-4 rounded shadow">Pending: {tasks.length - completed}</div>
      </div>

      <div className="mt-6 space-x-4">
        <button onClick={() => navigate("/projects")} className="bg-blue-500 text-white px-4 py-2 rounded">
          Projects
        </button>
        <button onClick={() => navigate("/tasks")} className="bg-green-500 text-white px-4 py-2 rounded">
          Tasks
        </button>
      </div>
    </div>
  );
}