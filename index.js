//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let start = io.of('/start');
let private = io.of('/private');
let join = io.of('/join');

let newRoom;
let rooms = [];
let joinRoom;

//receive room data from start client
start.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);
    socket.on('roomData', function(data) {
        newRoom = data;
        rooms.push(newRoom);
        //console.log(newRoom);
    });

    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});

//receive room data from join client, compare with array, return result
join.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('msg', function(data) {
        let curRoom = socket.room;

        //Send a response to all clients, including this one
        private.to(curRoom).emit('msg', data);
    });

    socket.on('roomData', function(data) {
        joinRoom = data;
        console.log(joinRoom);
        let checkRoom = joinRoom.room;
        console.log(rooms);
        for(let i = 0; i < rooms.length; i++){
            if (checkRoom == rooms[i].room){
                join.emit('result', {msg: "true"});
                newRoom.name = joinRoom.name;
                newRoom.room = rooms[i].room;
            } else {
                join.emit('result', {msg: "false"});
            }
        }
    });

    socket.on('getUsers', function() {
        join.emit('allUsers', rooms);
    })

    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});

//Listen for individual clients/users to connect to the private namespace
private.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('getRoom', function(){
        //add socket to room
        
        socket.join(newRoom.room);
        console.log(newRoom);
        //add roomName property to socket object
        socket.room = newRoom.room;

        let welcomeMsg = newRoom.name + " has joined the room " + newRoom.room;
        private.to(newRoom.room).emit("joined", {"name": "Welcome", "msg": welcomeMsg});
        private.to(newRoom.room).emit("roomData", newRoom);

        
    });

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        let curRoom = socket.room;

        //Send a response to all clients, including this one
        private.to(curRoom).emit('msg', data);

    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});
