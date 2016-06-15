var http = require('http');
var fs = require('fs');
var WebSocketServer = require('websocket').server;

var chatconnections = [];

// load text from the log into buffer to send to the client
var buffer = fs.readFileSync("log.txt", 'utf8', (err, data)=> {
  if (err) {
    throw err;
  }
  buffer = data;
});

var chat = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

var wsChat = new WebSocketServer({
    httpServer: chat,
    autoAcceptConnections: false
});

chat.listen(8082, function() {
    console.log((new Date()) + ' Server is listening on port 8082');
});

function originIsAllowed(origin) {

  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsChat.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept('direction-protocol', request.origin);
    chatconnections.push(connection);

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var msg = message.utf8Data;

            fs.readFileSync("log.txt", 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                buffer = data;
            });

            var time = new Date().toISOString().
                replace(/T/, ' ').      // replace T with a space
                replace(/\..+/, '');     // delete the dot and everything after
            var hours = parseInt(time.substring(11,13));

            hours = (hours + 17)%24;
            if(hours<10 || hours==0){
                hours = '0' + hours.toString();
            }

            if (msg != '') {
                buffer += "\n<p>" + "<strong>(" + hours + time.substring(13,time.length) + "): </strong>" + msg + "</p>";
            }

            for (connected in chatconnections) {
                console.log(connected.toString());
                // chatconnections[connected].sendUTF(msg);

                fs.writeFile("log.txt", buffer, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                chatconnections[connected].sendUTF(buffer);
            }
            //connection.sendUTF(dir);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        var index = chatconnections.indexOf(connection);
        chatconnections.splice(index, 1);
        delete chatconnections[connection.id];
    });
});