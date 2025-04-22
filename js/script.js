window.onload = function() {
    var btn = document.getElementById("jump");
    var count = 0;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var x = 300;
    var y = 200;
    var speed = 25;
    var t = Date.now();

    var gameOn = false;
    var firstStart = true;
    var colors = [];
    colors [0] = "white";
    colors [1] = "orange";
    colors [2] = "green";
    colors [3] = "blue";
    function sleep(delay) { 
        var start = new Date().getTime(); 
        while (new Date().getTime() < start + delay); 
    } 
    
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }  

    class Circle {
        constructor(size, x, y, color) {
            this.size = size;
            this.x = x;
            this.y = y;
            this.color = color;
        }

        reset(){
            this.size = randomInt(15,30);
            this.x = 600;
            this.y = randomInt(50, 290);
            this.color = colors[randomInt(0,3)]; 
        }
    }

    function isColision(x, y, circlOne){
        forReturn = false;
        topSide = y;
        leftSide = x;
        bottomSide = y + 50;
        rightSide = x + 50;

        ntopSide = circlOne.y;
        nleftSide = circlOne.x;
        nbottomSide = circlOne.y + circlOne.size;       
        nrightSide = circlOne.x + circlOne.size;

        if((topSide<0 || bottomSide>400)){
              //console.log('out of field' + ' \n top:' + topSide + ' bottom: ' + bottomSide + ' \n leftSide ' + leftSide + ' rightSide ' + rightSide);
              if(topSide<0){
                  console.log('topSide<0');
              }
              if(bottomSide>350){
                  console.log('bottomSide>400');
              }              
              return true;
        }     
    
        if((rightSide >= nleftSide)&&(topSide<=nbottomSide)&&(bottomSide>=ntopSide)&&(leftSide <= nrightSide)){
            forReturn = true;
        }
        
        return forReturn;
    }
    let circlOne = new Circle(randomInt(15,30), 600, randomInt(50, 290), colors[randomInt(0,3)]);

    function gameOver(x, y, circlOne){
          context.clearRect(0, 0, 600, 400);
          context.beginPath();
          context.strokeStyle = "red";
          context.strokeRect(x, y, 50, 50); 
          context.fill();
          context.strokeStyle = 'red';
          context.strokeRect(circlOne.x, circlOne.y, circlOne.size, circlOne.size);            
          context.fillText("S:" + count, 20, 20);
          context.fillText("Game over:" + count, 20, 40);
          context.fillText("Y:" + Math.round(y), 20, 60);
          context.fillText("X:" + Math.round(x), 20, 80);
          context.fillText("nY:" + Math.round(circlOne.y), 20, 100);
          context.fillText("nX:" + Math.round(circlOne.x), 20, 120);
          count = 0
          y = 200;
          speed = 25;
          gameOn = false;
    }


    function draw() {
        if(isColision(x, y, circlOne)) {
            gameOver(x, y, circlOne);
        }
    
    
        if(gameOn){
          context.clearRect(0, 0, 600, 400);
          context.beginPath();
          context.strokeStyle = "orange";
          context.strokeRect(x, y, 50, 50); 
          context.fill();
          context.strokeStyle = circlOne.color;
          context.strokeRect(circlOne.x, circlOne.y, circlOne.size, circlOne.size);       
          context.fill();
          
          if(circlOne.x < circlOne.size){
              circlOne.reset();
              count = count + 10;
              //console.log('reset');
          }
          
          var timePassed = (Date.now() - t) / 1000;
          t = Date.now();
          if(gameOn) {
            speed += 50 * timePassed;
            y += speed*timePassed;
            circlOne.x -= speed*timePassed+randomInt(1,2);
            if(isColision(x, y, circlOne)){
                speed -= 50 * timePassed;
                y -= speed*timePassed;
                circlOne.x += speed*timePassed+randomInt(1,2);
                gameOver(x, y, circlOne);
            }

          }
          context.font = '15px Arial';
          context.fillStyle = 'white';
          context.fillText("Score:" + count, 20, 20);
          //context.fillText("T:" + t, 20, 40);
          //context.fillText("Y:" + Math.round(y), 20, 60);
          //context.fillText("X:" + Math.round(x), 20, 80);
          //context.fillText("nY:" + Math.round(circlOne.y), 20, 100);
          //context.fillText("nX:" + Math.round(circlOne.x), 20, 120);         
          window.requestAnimationFrame(draw);
        }
    }      

function userTap(){
        count += 1;
        if(gameOn){
          y -= 25;
          //y=1;
          //x = 549;
        }else{
          y=200;
        }
        if(speed > 25){
          speed -= 20;
        }

        
        if(!gameOn && !firstStart){
            sleep(200);
            t = Date.now();
            gameOn = true;
            draw();
            circlOne.reset();
        }
        
        if(firstStart){
            firstStart = false;
            gameOn = true;
            draw();
            console.log('run...')
        }
}

document.onkeydown = function() {
  userTap ();
}
document.ontouchstart = function() {
  userTap ();
}
  /*
    btn.onclick = function() {
        userTap ();
        
    }
  */
}