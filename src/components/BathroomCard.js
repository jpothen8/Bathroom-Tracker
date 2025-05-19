import React from 'react';

const BathroomCard = ({ bathroom, onUpdateStatus, isAdmin }) => {
    const getStatusColor = (status) => {
        return status === 'working' ? '#2ecc71' : '#ff4444';
    };

    const getStatusText = (status) => {
        return status === 'working' ? 'Working' : 'Needs Repair';
    };

    const getStatusButton = () => {
        if (bathroom.status === 'working') {
            if (isAdmin) {
                return (
                    <button 
                        onClick={() => onUpdateStatus(bathroom.id, 'needs repair')}
                        className="needs-repair-button"
                    >
                        Mark as Needs Repair
                    </button>
                );
            }
            return (
                <button 
                    onClick={() => onUpdateStatus(bathroom.id, 'needs repair')}
                    className="needs-repair-button"
                >
                    Mark as Needs Repair
                </button>
            );
        }
        if (bathroom.status === 'needs repair') {
            if (isAdmin) {
                return (
                    <button 
                        onClick={() => onUpdateStatus(bathroom.id, 'working')}
                        className="working-button"
                    >
                        Mark as Working
                    </button>
                );
            }
            return null;
        }
        return null;
    };

    return (
        <div className="bathroom-card" style={{ borderColor: getStatusColor(bathroom.status) }}>
            <h2>{bathroom.name}</h2>
            <div className="status-indicator" style={{ backgroundColor: getStatusColor(bathroom.status) }}>
                <span>{getStatusText(bathroom.status)}</span>
            </div>
            {getStatusButton()}
        </div>
    );
};

export default BathroomCard;
