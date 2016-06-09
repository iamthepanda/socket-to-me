var socket = new WebSocket("ws://"+ip+":8080/", "direction-protocol")

var buffer = '';
var scrolled = false;
var repeatRateTimer = null;

socket.onopen = function (event) {
  socket.send("");
}

socket.onmessage = function (event) {
  document.getElementById('log').innerHTML = message.data;
  if(event.data=='right' || event.data=='left' || event.data=='up' || event.data=='down'){
    $('#move').text(event.data);
      moveNewPosition(event.data);
  }
  else {
    buffer = event.data;
    console.log(buffer);
    document.getElementById('log').innerHTML = event.data;
    updateScroll();
  }
}

// get values to animate
function animateblock(direction){
    $("#move").animate(direction, {duration: 50}, function(){
      blocking = true;
    });
}

function moveNewPosition(key){
  var blocking = false;
  if (!blocking){
      switch (key){
          case "left":
              animateblock({left: '-=50px'});
              break;
          case "right":
              animateblock({left: '+=50px'});
              break;
          case "up":
              animateblock({top: '-=50px'});
              break;
          case "down":
              animateblock({top: '+=50px'});
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
        }, 500 );
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
    socket.send('<br>'+document.getElementById('msg').value+'');

    document.getElementById('msg').value= '';

    document.getElementById("msg").focus();
  }

  return false; // to prevent page from refreshing after submitting form
}

// focus on chat box when window loads
window.onload = function() {
  document.getElementById("msg").focus();
}

// scrolls to the bottom of the chat log
function updateScroll() {
  if(!scrolled) {
    var element = document.getElementById('log');
    element.scrollTop = element.scrollHeight;
  }
}

//animateDiv();
//
//
//function makeNewPosition(){
//    
//    // Get viewport dimensions (remove the dimension of the div)
//    var h = $(window).height() - 50;
//    var w = $(window).width() - 50;
//    
//    var nh = Math.floor(Math.random() * h);
//    var nw = Math.floor(Math.random() * w);
//    
//    return [nh,nw];    
//    
//}
//
//function animateDiv(){
//    var newq = makeNewPosition();
//    $('#move').animate({ top: newq[0], left: newq[1] }, function(){
//      animateDiv();        
//    });  
//};
//
