var socket = new WebSocket("ws://10.143.35.126:8080/", "direction-protocol")
socket.onopen = function (event) {
  console.log("Hi")
  socket.send("Connected!");
}

socket.onmessage = function (event) {
  $('#move').text(event.data);
    moveNewPosition(event.data);
    
}

// get values to animate

function moveNewPosition(key){
    
    switch (key){
        case "left":
            $("#move").animate({left: '-=50px'}, "slow");
            break;
        case "right":
            $("#move").animate({left: '+=50px'}, "slow");
            break;
        case "up":
            $("#move").animate({top: '-=50px'}, "slow");
            break;
        case "down":
            $("#move").animate({top: '+=50px'}, "slow");
            break; 
    }
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
