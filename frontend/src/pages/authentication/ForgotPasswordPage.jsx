import React, { useState, useEffect } from "react";
import axios from "axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // On mount: check if there's a cooldown saved
  useEffect(() => {
    const saved = localStorage.getItem(`resetCooldown-${email}`);
    if (saved) {
      const remaining = Math.floor((new Date(saved) - new Date()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem(`resetCooldown-${email}`);
      }
    }
  }, [email]);

  // Decrement cooldown every second
  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      localStorage.removeItem(`resetCooldown-${email}`);
    }
  }, [cooldown, email]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/forgot-password", new URLSearchParams({ email }));
      alert(res.data);
      const expireAt = new Date(Date.now() + 60000); // 60 seconds from now
      localStorage.setItem(`resetCooldown-${email}`, expireAt.toISOString());
      setCooldown(60);
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded ${cooldown > 0 ? "bg-gray-400" : "bg-blue-600 text-white"}`}
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
