var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

users = [];
users[1]=[];
roomno=1;
io.on('connection', function(socket) {
   console.log('A user connected');

   if(io.nsps['/'].adapter.rooms["room-"+roomno] &&   io.nsps['/'].adapter.rooms["room-"+roomno].length > 5) 
   {
      roomno++;
      users[roomno]=[];
   }
   socket.join("room-"+roomno);
   io.sockets.in("room-"+roomno).emit('connectToRoom', {room:roomno,users:users[roomno]});
   console.log(roomno);
   console.log(users[roomno].length);

   socket.on('setUsername', function(data) {
      console.log(data);
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         
         users[roomno].push(data);
         socket.emit('userSet', {username: data});
         <!-- socket.emit('usersInRoom') -->
      }
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.in("room-"+data.room).emit('newmsg', data);
   })
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});