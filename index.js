const { Socket } = require('dgram');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 5000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    //console.log(io.sockets.name);  //output in number
    // or
    console.log(io.sockets.server.engine.clientsCount); //output in number
});

io.on('connection', (socket) => {
    //console.log(socket)
    if (io.sockets.server.engine.clientsCount < 3) { // condition for one on one chat (comment this and else section & change socket emit code for room)
        if (io.sockets.server.engine.clientsCount == 1) socketId1 = socket.id;
        socketId2 = socket.id;
        //console.log(socketId1, "---", socketId2);
        socket.on('chat message', msg => {
            //console.log(socket.id);
            //socket.broadcast.emit('chat message', msg);     //uncomment when needed
            //socket.to(socketId2).emit('chat message', msg);
            if (socketId2 != socket.id) socket.to(socketId2).emit('chat message', msg)
            if (socketId1 != socket.id) socket.to(socketId1).emit('chat message', msg)
        });
    } else {
        socket.on('chat message', msg => {
            msg = 'msg : access Denied';
            io.to(socket.id).emit('chat message', msg);
        });
    }

});
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});