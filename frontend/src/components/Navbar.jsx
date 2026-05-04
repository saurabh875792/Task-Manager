import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Task Manager</h1>

      <div className="space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/projects" className="text-gray-700 hover:text-blue-600">
          Projects
        </Link>
        <Link to="/tasks" className="text-gray-700 hover:text-blue-600">
          Tasks
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}