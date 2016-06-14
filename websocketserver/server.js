#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

// load text from the log into buffer to send to the client
var buffer = fs.readFileSync("log.txt", 'utf8', (err, data)=> {
  if (err) {
    throw err;
  }
  buffer = data;
});

var connections = [];

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
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
    connections.push(connection);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var dir = message.utf8Data;

            if(message.utf8Data != 'left' && message.utf8Data != 'right' && message.utf8Data != 'up' && message.utf8Data != 'down'){

                    fs.readFileSync("log.txt", 'utf8', (err, data)=> {
                      if (err) {
                        throw err;
                      }
                      buffer = data;
                    });
                    
                    buffer += "\n" + message.utf8Data;
                    fs.writeFile("log.txt", buffer, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                    });
                }
            for(connected in connections){
                console.log(connected.toString());
                connections[connected].sendUTF(dir);

                if(message.utf8Data != 'left' && message.utf8Data != 'right' && message.utf8Data != 'up' && message.utf8Data != 'down'){
                    
                    connections[connected].sendUTF(buffer);
                }
            }
            //connection.sendUTF(dir);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
        // if(message.utf8Data == ''){
        //     connection.send(buffer);
        // }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        var index = connections.indexOf(connection);
        connections.splice(index, 1);
    });
});
