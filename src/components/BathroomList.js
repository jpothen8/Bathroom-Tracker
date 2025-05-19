import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BathroomCard from './BathroomCard';
import GenderToggle from './GenderToggle';
import FloorSelector from './FloorSelector';

const BathroomList = () => {
    const [bathrooms, setBathrooms] = useState([]);
    const [selectedGender, setSelectedGender] = useState('men');
    const [selectedFloor, setSelectedFloor] = useState('1st');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchBathrooms();
    }, [selectedGender, selectedFloor]);

    const fetchBathrooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:5000/api/bathrooms?gender=${selectedGender}&floor=${selectedFloor}`;
            console.log('Fetching from URL:', url);
            console.log('Selected gender:', selectedGender);
            console.log('Selected floor:', selectedFloor);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched bathrooms:', data); // Debug log
            setBathrooms(data);
        } catch (error) {
            console.error('Error fetching bathrooms:', error);
            setBathrooms([]); // Clear bathrooms on error
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
            <div className="floor-selector-container">
                <FloorSelector
                    selectedFloor={selectedFloor}
                    onFloorChange={setSelectedFloor}
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
