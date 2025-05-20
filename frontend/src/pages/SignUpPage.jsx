import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import universities from "../data/us_universities.json";

function SignupPage() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(pwd);
  };

  const signup = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    if (!isStrongPassword(password)) {
      alert("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/signup", new URLSearchParams({
        first, last, email, password, university
      }));
      alert(res.data);
      navigate("/verify", { state: { email } });
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <input className="w-full p-2 border rounded mb-3" placeholder="First Name" value={first} onChange={(e) => setFirst(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" placeholder="Last Name" value={last} onChange={(e) => setLast(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" placeholder="Email (.edu)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <select className="w-full p-2 border rounded mb-3" value={university} onChange={(e) => setUniversity(e.target.value)}>
          <option value="">Select University</option>
          {universities.map((u, idx) => <option key={idx} value={u.name}>{u.name}</option>)}
        </select>
        <input className="w-full p-2 border rounded mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="w-full p-2 border rounded mb-3" type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={signup}>Create Account</button>
      </div>
    </div>
  );
}

export default SignupPage;
