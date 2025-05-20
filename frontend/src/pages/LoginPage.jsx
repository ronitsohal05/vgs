import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/login", new URLSearchParams({ email, password }));
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;

      if (data?.redirect === "/verify") {
        navigate("/verify", { state: { email: data.email } });
      } else {
        alert(data?.error || "Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded mb-2" onClick={handleLogin}>
          Login
        </button>
        <button className="text-sm text-blue-600 underline" onClick={() => navigate("/signup")}>
          Don't have an account? Sign up
        </button>
        <button className="text-sm text-blue-600 underline" onClick={() => navigate("/forgot-password")}>
            Forgot your password?
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
