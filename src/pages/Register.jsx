import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(form.password)) {
      alert(
        "Password must be 8+ chars, include uppercase, lowercase, number & special char"
      );
      return;
    }

    const res = await api.register(form);
    if (res.success) {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      alert(res.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/auth-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
        >
          Register
        </button>

        <Link to="/" className="block mt-3 text-blue-500 hover:text-blue-700 cursor-pointer">
          Back to Home
        </Link>

        <Link to="/login" className="block mt-1 text-gray-600 hover:text-blue-600 cursor-pointer">
          Already a user? Login
        </Link>
      </form>
    </div>
  );
}
