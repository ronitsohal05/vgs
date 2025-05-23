import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function NavBar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoggedIn(false);
            return;
        }

        setLoggedIn(true);

        axios.get("http://localhost:8080/user", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => setUser(res.data))
        .catch(() => {
            localStorage.removeItem("token");
            setLoggedIn(false);
            navigate("/");
        });
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-xl font-medium">Virtual Garage Sale</div>

            <div className="flex items-center space-x-4">
                {loggedIn && (
                    <Link
                        to="/browse"
                        className="text-gray-700 hover:underline text-sm"
                    >
                        Browse
                    </Link>
                )}

                {loggedIn ? (
                    <>
                        <button
                            onClick={logout}
                            className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Log Out
                        </button>
                        {user?.profilePictureLink && (
                            <Link to="/dashboard">
                                <img
                                    src={user.profilePictureLink}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full border border-gray-300"
                                />
                            </Link>
                        )}
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Log In
                    </Link>
                )}
            </div>
        </nav>
    );
}
