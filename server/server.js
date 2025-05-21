const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key-here'; // In production, use environment variable

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// In-memory storage for bathroom statuses
let bathrooms = [
    { id: 1, name: '160\'s', status: 'working', gender: 'men', floor: '1st' },
    { id: 2, name: '160\'s', status: 'working', gender: 'women', floor: '1st' },
    { id: 3, name: 'Auditorium', status: 'working', gender: 'men', floor: '1st' },
    { id: 4, name: 'Auditorium', status: 'working', gender: 'women', floor: '1st' },
    { id: 5, name: '210\'s', status: 'working', gender: 'men', floor: '2nd' },
    { id: 6, name: '210\'s', status: 'working', gender: 'women', floor: '2nd' },
    { id: 7, name: '250\'s', status: 'working', gender: 'men', floor: '2nd' },
    { id: 8, name: '250\'s', status: 'working', gender: 'women', floor: '2nd' },
    { id: 9, name: '310\'s', status: 'working', gender: 'men', floor: '3rd' },
    { id: 10, name: '310\'s', status: 'working', gender: 'women', floor: '3rd' },
    { id: 11, name: '350\'s', status: 'working', gender: 'men', floor: '3rd' },
    { id: 12, name: '350\'s', status: 'working', gender: 'women', floor: '3rd' }
];

// Mock users (in production, use a database)
const users = {
    'admin': { password: 'admin123', role: 'admin' },
    'student': { password: 'student123', role: 'student' }
};

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = { username, role: users[username].role };
    const token = jwt.sign(user, SECRET_KEY);
    
    res.json({ 
        token,
        user: {
            username: user.username,
            role: user.role
        }
    });
});

// Get all bathrooms with optional gender filter
app.get('/api/bathrooms', authenticateToken, (req, res) => {
    const { gender, floor } = req.query;
    
    const filteredBathrooms = bathrooms.filter(bathroom => {
        const matchesGender = !gender || bathroom.gender === gender;
        const matchesFloor = !floor || bathroom.floor === floor;
        return matchesGender && matchesFloor;
    });
    
    res.json(filteredBathrooms);
});

// Update bathroom status
app.put('/api/bathrooms/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Only admins can mark bathrooms as working
    if (status === 'working' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can mark bathrooms as working' });
    }

    const bathroom = bathrooms.find(b => b.id === parseInt(id));
    if (!bathroom) {
        return res.status(404).json({ message: 'Bathroom not found' });
    }

    bathroom.status = status;
    res.json(bathroom);
});

// Get all bathrooms
app.get('/api/bathrooms', (req, res) => {
    res.json(bathrooms);
});

// Update bathroom status
app.put('/api/bathrooms/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const bathroom = bathrooms.find(b => b.id === parseInt(id));
    if (!bathroom) {
        return res.status(404).json({ message: 'Bathroom not found' });
    }

    bathroom.status = status;
    res.json(bathroom);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
