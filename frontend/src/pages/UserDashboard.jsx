import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserListings from "./UserListings";
import NavBar from "../components/Navbar";
import axios from "axios";


function UserDashboard() {
	const navigate = useNavigate();
	const [user, setUser] = useState("");
  const [activeTab, setActiveTab] = useState("listings");

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



  return (
    <>
        <NavBar />
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center space-x-4">
                <img
                src={user.profilePictureLink}
                alt="Profile"
                className="w-24 h-24 rounded-full border"
                />
                <div>
                    <h1 className="text-2xl font-bold"> {user.firstName + " " + user.lastName} </h1>
                    <p className="text-sm text-gray-600">
                        {user.university}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex space-x-6 border-b">
                <button
                className={`pb-2 ${
                    activeTab === "listings"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("listings")}
                >
                Listings
                </button>
            </div>

            <div className="mt-4">
                {activeTab === "listings" && <UserListings />}
            </div>
        </div>
    </>
  );
}

export default UserDashboard;