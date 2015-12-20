const SOCKET_PORT = 5001;
const APP_PORT = SOCKET_PORT + 1;
const APP_HOST = '127.0.0.1';
const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = 6379;
const REDS_PASS = 'dNc072dNc072dNc072dNc072';

var io = require('socket.io').listen(SOCKET_PORT),
    redis = require('redis').createClient(REDIS_PORT, REDIS_HOST, { auth_pass: REDS_PASS }),
    fs = require('fs'),
    http = require('http'),
    roomViewsTbl = {};

logInfo('binding on ' + SOCKET_PORT);

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(roomViewsTbl));
}).listen(APP_PORT, APP_HOST);

redis.subscribe('create_msg');
redis.on('message', function(channel, raw_params) {
  params = JSON.parse(raw_params);
  switch(channel) {
    case 'create_msg':
      io.to(params.broadcast_id).emit("create_mes", params);
      logInfo('Getting mes...')
      break;
    default:
      logErr('Unknow channel')
  }
});

io.on('connection', function(socket) {
  socket.emit('connected');

  socket.on("init", function(req) {
    var broadcast_id = req.broadcast_id;
    socket.setRoominfo = broadcast_id;
    socket.join(broadcast_id);

    if (roomViewsTbl[broadcast_id] == undefined) {
      roomViewsTbl[broadcast_id] = 0;
    }
    roomViewsTbl[broadcast_id] += 1;

    logInfo(socket.id + " join to room: " + broadcast_id);
  });

  socket.on('disconnect', function() {
    logInfo(socket.id + ' has disconnected');
    roomViewsTbl[socket.setRoominfo] -= 1;
  });
});

function logInfo(str) {
  fs.appendFile('main.log', (str + '\n'), function (err) {
    if (err) return null;
  });
}

function logErr(str) {
  console.log('[err] ' + str);
}
