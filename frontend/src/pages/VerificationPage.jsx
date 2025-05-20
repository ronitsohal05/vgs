import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerificationPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // On mount, check for cooldown in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`vcodeCooldown-${email}`);
    if (saved) {
      const diff = Math.floor((new Date(saved) - new Date()) / 1000);
      if (diff > 0) {
        setCooldown(diff);
      } else {
        localStorage.removeItem(`vcodeCooldown-${email}`);
      }
    }
  }, [email]);

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      localStorage.removeItem(`vcodeCooldown-${email}`);
    }
  }, [cooldown, email]);

  const verify = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/verify", new URLSearchParams({ email, code }));
      alert(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Verification failed");
    }
  };

  const sendCode = async () => {
    try {
      await axios.post("http://localhost:8080/auth/vcode", new URLSearchParams({ email }));
      setMessage("Code sent to your email.");
      const expiry = new Date(Date.now() + 60000); // 60 seconds from now
      localStorage.setItem(`vcodeCooldown-${email}`, expiry.toISOString());
      setCooldown(60);
    } catch (err) {
      setMessage(err.response?.data || "Failed to send code.");
    }
  };

  if (!email) {
    return <p className="text-center mt-10">Email is missing. Go back to signup.</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="mb-4 text-sm text-gray-600">Code sent to <strong>{email}</strong></p>

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          className={`w-full py-2 rounded mb-2 ${cooldown > 0 ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
          onClick={sendCode}
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Code"}
        </button>

        <button
          className="w-full bg-green-600 text-white py-2 rounded"
          onClick={verify}
        >
          Verify
        </button>

        {message && <p className="mt-3 text-sm text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

export default VerificationPage;
