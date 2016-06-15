var socket = new WebSocket("ws://"+ip+":8080/", "direction-protocol")
var chat = new WebSocket("ws://"+ip+":8082/", "direction-protocol")

var buffer = '';
var scrolled = false;
var repeatRateTimer = null;

socket.onmessage = function (event) {
    $('.move').text(event.data);
      moveNewPosition(event.data);
}

chat.onopen = function (event) {
  chat.send("");
}

chat.onmessage = function (event) {
    document.getElementById('log').innerHTML = event.data;
    buffer = event.data;
    document.getElementById('log').innerHTML = event.data;
    updateScroll();
      console.log(event);
}

// get values to animate
function animateblock(direction){
    $(".move").animate(direction, {duration: 50}, function(){
      blocking = true;
    });
}

function moveNewPosition(key){
  var blocking = false;
  if (!blocking){
      switch (key){
          case "left":
              animateblock({x: '-=50px'});
              break;
          case "right":
              animateblock({x: '+=50px'});
              break;
          case "up":
              animateblock({y: '-=50px'});
              break;
          case "down":
              animateblock({y: '+=50px'});
              break; 
      }
  }
  blocking = false;
}


window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if( repeatRateTimer == null )
    {
        repeatRateTimer = setTimeout( function( ) {
            repeating = false;
            clearTimeout( repeatRateTimer );
            repeatRateTimer = null;
        }, 100 );
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

    // focus on chat box on 'enter' keypress
    if (key == 13) {
      document.getElementById("msg").focus();
    }

}

window.myFunction = function(){
  if(document.getElementById('msg').value != ''){
    chat.send(document.getElementById('msg').value);

    document.getElementById('msg').value= '';

    document.getElementById("msg").focus();
  }

  return false; // to prevent page from refreshing after submitting form
}

// focus on chat box when window loads
window.onload = function() {
  // document.getElementById("msg").focus();
}

// scrolls to the bottom of the chat log
function updateScroll() {
  if(!scrolled) {
    var element = document.getElementById('log');
    element.scrollTop = element.scrollHeight;
  }
}