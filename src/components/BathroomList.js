import React, { useState, useEffect } from 'react';
import BathroomCard from './BathroomCard';
import GenderToggle from './GenderToggle';

const BathroomList = () => {
    const [bathrooms, setBathrooms] = useState([]);
    const [selectedGender, setSelectedGender] = useState('men');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchBathrooms();
    }, [selectedGender]);

    const fetchBathrooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/bathrooms?gender=${selectedGender}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            setBathrooms(data);
        } catch (error) {
            console.error('Error fetching bathrooms:', error);
        }
    };

    const updateBathroomStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bathrooms/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const updatedBathroom = await response.json();
            
            if (response.ok) {
                // Update the local state
                setBathrooms(prevBathrooms => 
                    prevBathrooms.map(bathroom => 
                        bathroom.id === id ? updatedBathroom : bathroom
                    )
                );
            } else {
                console.error('Error updating status:', updatedBathroom.message);
            }
        } catch (error) {
            console.error('Error updating bathroom status:', error);
        }
    };

    return (
        <div className="bathroom-list">
            <div className="header">
                <GenderToggle
                    selectedGender={selectedGender}
                    onGenderChange={setSelectedGender}
                />
            </div>
            <div className="bathroom-grid">
                {bathrooms.map(bathroom => (
                    <BathroomCard
                        key={bathroom.id}
                        bathroom={bathroom}
                        onUpdateStatus={updateBathroomStatus}
                        isAdmin={user?.role === 'admin'}
                    />
                ))}
            </div>
        </div>
    );
};

export default BathroomList;
