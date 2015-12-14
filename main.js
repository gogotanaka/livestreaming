const SOCKET_PORT = 5001;
const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = 6379;

var io = require('socket.io').listen(SOCKET_PORT),
    redis = require('redis').createClient(REDIS_PORT, REDIS_HOST, {}),
    connectedSockets = [];

logInfo('binding on ' + SOCKET_PORT + ' ...');

redis.subscribe('create_msg');
redis.on('message', function(channel, message) {
  msg = JSON.parse(message);
  switch(channel) {
    case 'create_msg':
      io.to(msg.broadcast_id).emit("create_mes", msg);
      logInfo('Getting mes...')
      break;
    default:
      logErr('Unknow channel')
  }
});

io.on('connection', function(socket) {
  logInfo('new client id:' + socket.id + '...');
  socket.emit('connected');

  socket.on("init", function(req) {
    socket.setRoominfo = req.broadcast_id;
    socket.join(req.broadcast_id);
    socket.join(socket.id);

    logInfo(req.broadcast_id + " join");
  });

  // socket.on("login_room", function(req) {
  // });
});

function logInfo(str) {
  console.log('[info] ' + str);
}

function logErr(str) {
  console.log('[err] ' + str);
}


// connectedSockets.push(socket);
// console.log('[info] number of connected sockets: ' + connectedSockets.length);


    // socket.to('some room').emit('create_mes', JSON.parse(message));

  // socket.on('disconnect', function() {
  //   console.log('[info] ' + socket.id + ' has disconnected');
  //   var i = connectedSockets.indexOf(socket);
  //   connectedSockets.splice(i, 1);
  // });


    // show user name
    // socket.on('show username', function(username) {
    //     // set username into people
    //     people[socket.id] = username;
    //     // add all username in userlist
    //     var userlist = [];
    //     for(key in people){
    //         userlist.push(people[key]);
    //         console.log(userlist);
    //     }
    //     // send username to client
    //     io.emit('show username', username); // show username in form header
    //     io.emit('show userlist', userlist); // show userlist in main
    // });
    // // disconnect socket

// });
