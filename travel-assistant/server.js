// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serving the static files (front-end)
app.use(express.static('public'));

// Hardcoded data for hotels, Airbnb, transport, and airlines
const hotels_prices = {
  'Hawaii': {'Waikiki Beach Resort': 300, 'Four Seasons Resort': 600, 'Aulani Disney Resort': 450},
  'Maldives': {'Conrad Maldives Rangali Island': 900, 'Anantara Veli Maldives Resort': 750},
  'New York': {'The Plaza Hotel': 550, 'The Standard': 400, 'The Ritz-Carlton': 700},
  'Paris': {'Le Meurice': 800, 'The Ritz Paris': 700},
  'Tokyo': {'Park Hyatt Tokyo': 500, 'The Peninsula Tokyo': 650},
};

const airbnb_prices = {
  'Hawaii': {'Oceanfront Villa': 250, 'Beach Cottage': 200, 'Luxury Condo by the Beach': 300},
  'Maldives': {'Private Beach Bungalow': 350, 'Waterfront Luxury Suite': 400, 'Overwater Villa': 500},
  'New York': {'Downtown Loft': 250, 'Luxury Penthouse': 600, 'Soho Loft': 300},
  'Paris': {'Chic Parisian Apartment': 250, 'Modern Studio': 180, 'Luxury Suite near the Eiffel Tower': 400},
  'Tokyo': {'Tokyo Tower View Studio': 150, 'Shibuya District Loft': 200, 'Shinjuku Modern Apartment': 250},
};

const airline_prices = {
  'Delta Airlines': 500,
  'Emirates': 750,
  'United Airlines': 600,
  'Air France': 650,
  'Singapore Airlines': 700,
  'American Airlines': 550,
};

// Define a simple route to serve the website
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Set up socket.io communication
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('user_input', (data) => {
    // Here, you will handle user input and send back appropriate responses
    console.log('User input:', data);
    
    // For example, respond to the destination input
    if (data.type === 'destination') {
      socket.emit('response', `Where are you traveling to? You can choose from Hawaii, Maldives, New York, Paris, Tokyo.`);
    }

    // Handle more cases based on user flow (date, budget, etc.)
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
