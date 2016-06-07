var socket = new WebSocket("ws://localhost:8080")
socket.onopen = function (event) {
  socket.send("Connected!");
}

window.onkeydown = function(e) {
     var key = e.keyCode ? e.keyCode : e.which;

        if (key == 38) {
          console.log("up was pressed");
        }else if (key == 40) {
          console.log("down was pressed");
        }
}
