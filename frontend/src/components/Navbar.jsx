import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <p1 to="/" className="font-bold text-lg">VGS</p1>
                <Link to="/browse">Browse</Link>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={logout}>Logout</button>
                <Link to="/dashboard"> 
                    <img src="/src/assets/default_profile.png" alt="Profile" className="h-8 w-8 rounded-full" />
                </Link>
            </div>
        </div>
    );
}