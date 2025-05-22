import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <p1 to="/" className="font-bold text-lg">VGS</p1>
                <Link to="/browse">Browse</Link>
            </div>
            <div className="flex items-center space-x-4">
                <button>🔔</button>
                <Link to="/dashboard"> 
                    <img src="/src/assets/default_profile.png" alt="Profile" className="h-8 w-8 rounded-full" />
                </Link>
            </div>
        </div>
    );
}