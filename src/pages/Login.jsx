import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
export default function Login() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    const res = await api.login(form);

    if (!res.success) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("sidebarOpen", JSON.stringify(true));

      // Redirect based on role
      if (res.user.role === "admin") navigate("/admin/dashboard");
      else if (res.user.role === "scorer") navigate("/scorer/dashboard");
      else navigate("/viewer/dashboard"); // default viewer
    }else{
      alert(res.message || "Login failed")
    }
  };

  return (
    <>
      <ForgotPasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('src/assets/auth-bg.jpg')" }}
      >
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <form
          onSubmit={submit}
          className="bg-white p-6 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={change}
            className="w-full mb-3 px-3 py-2 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={change}
            className="w-full mb-3 px-3 py-2 border rounded"
          />

          <button
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Login
          </button>

          <div className="flex justify-between mt-3">
            <button
              type="button"
              className="text-red-600 hover:text-red-700 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              Forgot Password?
            </button>

            <Link
              to="/register"
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              New user? Register
            </Link>
          </div>

          <Link to="/" className="block mt-3 text-blue-500 hover:text-blue-600 cursor-pointer">
            Back to Home
          </Link>

        </form>
      </div>
    </>
  );
}



