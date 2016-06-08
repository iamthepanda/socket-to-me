// var socket = new WebSocket("ws://10.143.254.4:8080/", "echo-protocol")
// var socket = new WebSocket("ws://10.143.183.69:8080/", "echo-protocol")
var socket = new WebSocket("ws://localhost:8080/", "echo-protocol")
socket.onopen = function (event) {
  console.log(event);
  socket.send('get-chat');
}

socket.onmessage = function (message) {
  console.log(message.data);
}

window.onkeydown = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  if (key == 38) {
    console.log("up was pressed");
    socket.send("up");
  }else if (key == 40) {
    console.log("down was pressed");
    socket.send("down");
  }else if (key == 13) {

    document.getElementById("msg").focus();
  }
}

window.myFunction = function(){
  if(document.getElementById('msg').value != ''){
    console.log(document.getElementById('msg').value);
    socket.send(document.getElementById('msg').value);
      document.getElementById('chatbox').innerHTML = document.getElementById('chatbox').innerHTML + '<br>' + document.getElementById('msg').value;
  }

  return false;
}

window.onload = function() {
  document.getElementById("msg").focus();
}

