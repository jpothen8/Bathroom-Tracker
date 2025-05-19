import React from 'react';

const GenderToggle = ({ selectedGender, onGenderChange }) => {
    return (
        <div className="gender-toggle" style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <button
                className={`gender-button ${selectedGender === 'men' ? 'selected' : ''}`}
                onClick={() => onGenderChange('men')}
                style={{ flex: 1 }}
            >
                Men's
            </button>
            <button
                className={`gender-button ${selectedGender === 'women' ? 'selected' : ''}`}
                onClick={() => onGenderChange('women')}
                style={{ flex: 1 }}
            >
                Women's
            </button>
        </div>
    );
};

export default GenderToggle;
