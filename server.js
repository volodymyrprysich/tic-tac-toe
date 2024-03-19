const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Папка с клиентскими файлами
app.use(express.static(__dirname + '/public'));

// Событие соединения клиента с сервером
io.on('connection', socket => {
    console.log('A user connected');

    // Событие создания сессии
    socket.on('createSession', playerName => {
        const sessionId = generateSessionId();
        socket.join(sessionId);
        socket.emit('sessionCreated', sessionId, playerName);
    });

    // Событие присоединения к сессии
    socket.on('joinSession', (sessionId, playerName) => {
        if (io.sockets.adapter.rooms.get(sessionId) && io.sockets.adapter.rooms.get(sessionId).size < 2) {
            socket.join(sessionId);
            io.to(sessionId).emit('sessionJoined', sessionId, playerName);
        } else {
            socket.emit('sessionFull');
        }
    });

    // Событие хода
    socket.on('makeMove', (sessionId, cellId) => {
        io.to(sessionId).emit('moveMade', cellId);
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Генерация уникального идентификатора для сессии
function generateSessionId() {
    return Math.random().toString(36).substring(2, 10);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
