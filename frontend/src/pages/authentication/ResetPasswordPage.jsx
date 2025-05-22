import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd);
  };

  const handleReset = async () => {
    if (password !== confirm) return alert("Passwords do not match");
    if (!isStrongPassword(password)) return alert("Password too weak");

    try {
      await axios.post("http://localhost:8080/auth/reset-password", new URLSearchParams({
        code: token,
        newPassword: password
      }));
      alert("Password successfully reset");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Reset failed");
    }
  };

  if (!token) {
    return <p>Invalid or missing reset token.</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
        <input
          className="w-full p-2 border rounded mb-3"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded mb-3"
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          onClick={handleReset}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
