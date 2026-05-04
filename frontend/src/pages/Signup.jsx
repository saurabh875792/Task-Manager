import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-xl shadow-lg w-80" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          placeholder="Name"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Signup
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}