import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios.get("http://localhost:8080/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data))
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/");
    });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.email || "Loading..."}</h2>
        <button className="bg-red-600 text-white py-2 px-4 rounded" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
