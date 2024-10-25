// backend/server.js
const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('locationUpdate', (location) => {
        io.emit('locationUpdate', location);  // Broadcast updated location
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
