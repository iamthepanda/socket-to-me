var socket = new WebSocket("ws://10.143.35.126:8080/", "echo-protocol")
socket.onopen = function (event) {
  console.log("Hi")
  socket.send("Connected!");
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 38) {
      console.log("up was pressed");
      socket.send("up");
    }else if (key == 40) {
      console.log("down was pressed");
      socket.send("down");
    }
}
