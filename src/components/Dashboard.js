import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BathroomList from './BathroomList';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Bathroom Status Tracker</h1>
                <div className="user-info">
                    <span>Welcome, {user.role === 'admin' ? 'Admin' : 'Student'}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <BathroomList />
        </div>
    );
};

export default Dashboard;
