// var socket = new WebSocket("ws://10.143.254.4:8080/", "echo-protocol")
// var socket = new WebSocket("ws://10.143.183.69:8080/", "echo-protocol")
// var socket = new WebSocket("ws://192.168.0.15:8080/", "echo-protocol")
var socket = new WebSocket("ws://localhost:8080/", "echo-protocol")

var buffer = '';
var scrolled = false;
socket.onopen = function (event) {
  // console.log(document.getElementById('msg').innerHTML);
  socket.send('<br>Connected!');


  var objDiv = document.getElementById('log');
  objDiv.scrollTop = objDiv.scrollHeight;
  setInterval('updateScroll',1000);
}

socket.onmessage = function (message) {
  // console.log(message.data);
  document.getElementById('log').innerHTML = message.data;
  buffer = message.data;

  updateScroll();
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
    // console.log(document.getElementById('msg').value);
    socket.send('<br>'+document.getElementById('msg').value+'');

    document.getElementById('msg').value= '';

    document.getElementById("msg").focus();
  }

  return false;
}

window.onload = function() {
  document.getElementById("msg").focus();
}

function updateScroll() {
  if(!scrolled) {
    var element = document.getElementById('log');
    element.scrollTop = element.scrollHeight;
  }
}