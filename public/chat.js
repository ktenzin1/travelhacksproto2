// public/chat.js
const socket = io();

const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');

sendButton.addEventListener('click', () => {
  const message = userInput.value;
  if (message) {
    addMessageToChat('You: ' + message);
    socket.emit('user_input', { type: 'destination', message: message });
    userInput.value = ''; // Clear the input
  }
});

// Function to add messages to the chat window
function addMessageToChat(message) {
  const newMessage = document.createElement('div');
  newMessage.textContent = message;
  chatbox.appendChild(newMessage);
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
}

// Listen for responses from the server
socket.on('response', (responseMessage) => {
  addMessageToChat('Assistant: ' + responseMessage);
});
