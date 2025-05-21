import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BathroomList from './BathroomList';
import { Table } from 'react-bootstrap';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('review');
    const [problems, setProblems] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchProblems();
    }, [navigate, user]);

    const fetchProblems = async () => {
        try {
            const response = await fetch('https://crispy-giggle-wjx7xr9r5rfv6gr-5000.app.github.dev/api/bathrooms', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            const problems = data.filter(bathroom => bathroom.status === 'needs repair');
            setProblems(problems);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };

    const resolveProblem = async (id) => {
        try {
            const response = await fetch(`https://crispy-giggle-wjx7xr9r5rfv6gr-5000.app.github.dev/api/bathrooms/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'working' })
            });
            if (response.ok) {
                fetchProblems(); // Refresh the list
            }
        } catch (error) {
            console.error('Error resolving problem:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-options">
                <button
                    className={`admin-option ${selectedOption === 'review' ? 'active' : ''}`}
                    onClick={() => setSelectedOption('review')}
                >
                    Review Messages
                </button>
                <button
                    className={`admin-option ${selectedOption === 'report' ? 'active' : ''}`}
                    onClick={() => setSelectedOption('report')}
                >
                    Report Problems
                </button>
            </div>

            {selectedOption === 'review' && (
                <div className="problems-table">
                    <h2>Problems to Review</h2>
                    {problems.length === 0 ? (
                        <p>No problems reported at the moment</p>
                    ) : (
                        <Table className="custom-table" hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Floor</th>
                                    <th>Sex</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((bathroom) => (
                                    <tr key={bathroom.id}>
                                        <td>{bathroom.name}</td>
                                        <td>{bathroom.floor}</td>
                                        <td>{bathroom.gender}</td>
                                        <td>
                                            <button
                                                className="resolve-button"
                                                onClick={() => resolveProblem(bathroom.id)}
                                            >
                                                Resolve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}

            {selectedOption === 'report' && (
                <BathroomList />
            )}
        </div>
    );
};

export default AdminDashboard;
