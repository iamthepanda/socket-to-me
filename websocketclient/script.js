var socket = new WebSocket("ws://localhost:8080/", "direction-protocol")
socket.onopen = function (event) {
  console.log("Hi")
  socket.send("Connected!");
}
socket.onmessage = function (event) {
  console.log(event);
}

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    switch(key){
      case 37:
        console.log("left was pressed");
        socket.send("left");
        break;
      case 38:
        console.log("up was pressed");
        socket.send("up");
        break;
      case 39:
        console.log("right was pressed");
        socket.send("right");
        break;
      case 40:
        console.log("down was pressed");
        socket.send("down");
        break;
    }

}
