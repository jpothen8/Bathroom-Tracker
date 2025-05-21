import React, { useState, useEffect } from 'react';

const FloorSelector = ({ selectedFloor, onFloorChange }) => {
    const floors = [
        { id: '1st', name: '1st Floor', image: '/Blair Floor 1 Bathrooms.png' },
        { id: '2nd', name: '2nd Floor', image: '/Blair Floor 2 Bathrooms.png' },
        { id: '3rd', name: '3rd Floor', image: '/Blair Floor 3 Bathrooms.png' }
    ];

    const [selectedFloorState, setSelectedFloorState] = useState(selectedFloor);

    useEffect(() => {
        setSelectedFloorState(selectedFloor);
    }, [selectedFloor]);

    return (
        <div className="floor-selector">
            <div className="floor-buttons">
                {floors.map(floor => (
                    <button
                        key={floor.id}
                        onClick={() => {
                            onFloorChange(floor.id);
                            setSelectedFloorState(floor.id);
                        }}
                        className={`floor-button ${selectedFloorState === floor.id ? 'selected' : ''}`}
                        style={{ width: '100%' }}
                    >
                        {floor.name}
                    </button>
                ))}
            </div>
            {selectedFloorState && (
                <div className="floor-image">
                    <img 
                        src={floors.find(f => f.id === selectedFloorState).image} 
                        alt={`${selectedFloorState} Floor Bathrooms`} 
                        className="floor-map"
                    />
                </div>
            )}
        </div>
    );
};

export default FloorSelector;
