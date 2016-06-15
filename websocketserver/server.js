#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var childProcess = require('child_process');

// load text from the log into buffer to send to the client
var buffer = fs.readFileSync("log.txt", 'utf8', (err, data)=> {
  if (err) {
    throw err;
  }
  buffer = data;
});

var id = 0;
var players = [];

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {

  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('direction-protocol', request.origin);
    players.push({con:connection, id: id});
    id++;
    console.log(id);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var dir = message.utf8Data;

            fs.readFileSync("log.txt", 'utf8', (err, data)=> {
              if (err) {
                throw err;
              }
              buffer = data;
            });
                    
            buffer += "\n" + message.utf8Data;
                
            for(connected in players){
                console.log(connected.toString());
                players[connected].con.sendUTF(dir);
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        var index = players.indexOf(connection);
        players.splice(index, 1);
    });
});

function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

// Now we can run a script and invoke a callback when complete, e.g.
runScript('./chat.js', function (err) {
    if (err) throw err;
    console.log('finished running chat.js');
});