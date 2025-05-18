import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const signup = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/signup", new URLSearchParams({ email, password, university }));
      alert(res.data);
      setStep(2);
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  const verify = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/verify", new URLSearchParams({ email, code }));
      alert(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Email (.edu)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={signup}>
              Create Account
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Verify Email</h2>
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="w-full bg-green-600 text-white py-2 rounded" onClick={verify}>
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SignupPage;
