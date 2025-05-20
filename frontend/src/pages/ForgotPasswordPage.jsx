import React, { useState } from "react";
import axios from "axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/forgot-password", new URLSearchParams({ email }));
      alert(res.data);
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <input className="w-full mb-3 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            <button onClick={handleSubmit} className="bg-blue-600 text-white w-full py-2 rounded">Send Reset Link</button>
        </div>
    </div>
  );
}

export default ForgotPasswordPage;