// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serving the static files (front-end)
app.use(express.static('public'));

// Hardcoded data for hotels, Airbnb, and airlines
const hotelsPrices = {
  'Hawaii': {'Waikiki Beach Resort': 300, 'Four Seasons Resort': 600, 'Aulani Disney Resort': 450},
  'Maldives': {'Conrad Maldives Rangali Island': 900, 'Anantara Veli Maldives Resort': 750},
  'New York': {'The Plaza Hotel': 550, 'The Standard': 400, 'The Ritz-Carlton': 700},
  'Paris': {'Le Meurice': 800, 'The Ritz Paris': 700},
  'Tokyo': {'Park Hyatt Tokyo': 500, 'The Peninsula Tokyo': 650},
};

const airbnbPrices = {
  'Hawaii': {'Oceanfront Villa': 250, 'Beach Cottage': 200, 'Luxury Condo by the Beach': 300},
  'Maldives': {'Private Beach Bungalow': 350, 'Waterfront Luxury Suite': 400, 'Overwater Villa': 500},
  'New York': {'Downtown Loft': 250, 'Luxury Penthouse': 600, 'Soho Loft': 300},
  'Paris': {'Chic Parisian Apartment': 250, 'Modern Studio': 180, 'Luxury Suite near the Eiffel Tower': 400},
  'Tokyo': {'Tokyo Tower View Studio': 150, 'Shibuya District Loft': 200, 'Shinjuku Modern Apartment': 250},
};

const airlinePrices = {
  'Delta Airlines': 500,
  'Emirates': 750,
  'United Airlines': 600,
  'Air France': 650,
  'Singapore Airlines': 700,
  'American Airlines': 550,
};

io.on('connection', (socket) => {
  console.log('User connected');

  // Step 1: Greet the user
  socket.emit('response', "Hello! Welcome to TravelHacks. I'm your AI Travel Assistant. Let's plan your trip!");
  
  // Step 2: Ask for the destination
  socket.emit('question', 'Where are you traveling to?');

  // Set up a variable to track user input flow
  let step = 1;
  let destination;

  // Listen for user input
  socket.on('user_input', (data) => {
    const input = data.trim();

    if (step === 1) {
      destination = input;
      if (hotelsPrices[destination]) {
        step++;
        socket.emit('response', `Available hotels in ${destination}: ${Object.keys(hotelsPrices[destination]).join(', ')}`);
        socket.emit('question', 'Please choose a hotel from the list above or type the name of a hotel you know:');
      } else {
        socket.emit('response', "Sorry, we don't have data for that destination. Please choose another location.");
      }
    } else if (step === 2) {
      const hotelChoice = input;
      if (hotelsPrices[destination][hotelChoice]) {
        step++;
        socket.emit('response', `Hotel ${hotelChoice} selected.`);
        socket.emit('question', 'Do you want an Airbnb instead of a hotel? (Yes/No):');
      } else {
        socket.emit('response', "Hotel not found. Please choose from the listed hotels.");
      }
    } else if (step === 3) {
      const airbnbPreference = input.toLowerCase();
      if (airbnbPreference === 'yes' && airbnbPrices[destination]) {
        socket.emit('response', `Available Airbnb options in ${destination}: ${Object.keys(airbnbPrices[destination]).join(', ')}`);
        socket.emit('question', 'Please choose an Airbnb from the list above:');
      } else if (airbnbPreference === 'no') {
        step++;
        socket.emit('question', 'Do you have an airline preference? (Yes/No):');
      } else {
        socket.emit('response', "Invalid choice. Please respond with 'Yes' or 'No'.");
      }
    } else if (step === 4) {
      const airlinePreference = input.toLowerCase();
      if (airlinePreference === 'yes') {
        step++;
        socket.emit('response', `Available airlines: ${Object.keys(airlinePrices).join(', ')}`);
        socket.emit('question', 'Please enter your preferred airline:');
      } else if (airlinePreference === 'no') {
        step++;
        socket.emit('question', 'What is your travel budget?');
      } else {
        socket.emit('response', "Invalid choice. Please respond with 'Yes' or 'No'.");
      }
    }
    // Continue defining further steps and handling other data here...
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
