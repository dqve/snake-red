var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); 

const save_key_Score = "highScore"; 

var x = canvas.width/2, y = canvas.height-30;

var ballx = 3, bally = -3;

var ballRadius = 10;


var paddleHeight = 10, paddleWidth = 75, paddleX = (canvas.width-paddleWidth)/2;

var dPressed = false, aPressed = false;

var brickRowCount = 4, brickColumnCount = 8, brickWidth = 50, brickHight = 20, brickPadding = 5, brickOffsetTop = 30, brickOffsetleft = 25;
/*skal bruges til de bricks man skal ramme med bolden
Der er defineret en variable som bestemmer antallet af rækker, antallet af bricks pr. række, højden og bredden af de bricks. Samtidig er der defineret en variable så de ikke rammer hinanden og en variable så de ikke bliver tegnet fra toppen og ved kanten, hvilket giver lidt space til kanten af canvas*/
var bricks = []
for(var c=0; c<brickColumnCount; c++){
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++){
    bricks[c][r] =  { x: 0, y: 0, status: 1};

  }
}

var score = 0, highScore = 2;

var number, color;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "d") {
        dPressed = true;
    }
    else if(e.key == "Left" || e.key == "a") {
        aPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "d") {
        dPressed = false;
    }
    else if(e.key == "Left" || e.key == "a") {
        aPressed = false;
    }
}


function getRandomColor() {
    number = Math.floor(Math.random() * 1000000 + 1);
    color = convertToColor(number);
    return color;
}

function convertToColor(num){
    return '#' + ('00000' + (num | 0).toString(16)).substr(-6);
}


function collisionDetection(){
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
        var b=bricks[c][r];
        
        if(b.status == 1){
        if (x + 15 > b.x && x < b.x + brickWidth && y + 15 > b.y && y < b.y + brickHight){
        bally = -bally;
        b.status = 0;
        score++;
        color = getRandomColor();
        } 
      }
    }
  }
}
/*function for at bolden skal ændre retning ved impact med bricks. Her er der defineret en variable som dækker over x og y koordinaterne for vores bricks, b-variablen. Den if statement skal der være opgyldt 4 ting, før bolden ændre retning, 
x positionen for bolden, skal være større end x positionen for bricks 
x positionen for bolden, skal være mindre end x positionen for bricks plusset med brickWidth
y positionen for bolden, skal være større end y positionen for bricks 
y positionen for bolden, skal være mindre end y positionen for bricks plusset med brickHight
der er plusset med 10 ved x og trukket 10 fra ved y, så det ligner den rammer ved kanten af bolden, istedet for i midten af bolden. 
sidste del er for at kunne tegne scoren*/

function drawScore(){
  ctx.font = "16 px Arial";
  ctx.fillStyle = "black"
  ctx.fillText("Score: "+score, 50, 20);
}


function drawHighScore(){
  ctx.textAlign = "right";
  ctx.font = "16 px Arial";
  ctx.fillStyle = "black"
  ctx.fillText("highScore: "+highScore, canvas.width/2, 20);
  var scoreStr = localStorage.getItem(save_key_Score);
    if(scoreStr == null){
      highScore = 0;
    } 
      else{
          highScore = parseInt(scoreStr);       
    }
      if(score > highScore){
        highScore = score;
        localStorage.setItem(save_key_Score, highScore);
  }
}


function drawBall(){
      
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  
}

function drawPaddle(){
    
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight-15, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath;
}

function redrawBricks(){
  
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
      if(bricks[c][r].status == 1){
      var brickX = (c*(brickWidth+brickPadding)+brickOffsetleft);
      var brickY = (r*(brickHight+brickPadding)+brickOffsetTop);
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHight);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath;
      }
    }
  }
}


function loop2DArray(arr, rows, cols, cb){
  for(let c = 0; c < cols; c++){
    for(let r = 0; r < rows; r++){
      cb(arr[c][r])
    }
  }
}
function drawBricks(){
  let bricksRemaining = 0;
  loop2DArray(bricks, brickRowCount, brickColumnCount, brick => {
    if(brick.status == 1){
      bricksRemaining ++;
      redrawBricks();
    }
  });
  if(bricksRemaining === 0){
    loop2DArray(bricks, brickRowCount, brickColumnCount, brick => {
      brick.status = 1;
    }); 
  }
  if(bricksRemaining === 0){
    ballx += 1
    bally += 1
  };
}


function glitchdetectorx(){
  if(ballx > - 0.5 && ballx < 0.5)
      ballx = 2;
}


function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height); 
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawHighScore();
  drawBricks();
  glitchdetectorx();
  /*henter funktionen drawBall, drawPaddle & drawBricks
  Få bolden til at "bounce" ved impact af siderne af canvas*/

  if(x + ballx > canvas.width-ballRadius || x + ballx < ballRadius){
    ballx = -ballx;
    color = getRandomColor();
  }
  
  if(y + bally < ballRadius) {
    bally = -bally;
    color = getRandomColor();
  }
  
  else if(y + bally > canvas.height - paddleHeight - 20) {
        if(x > paddleX && x < paddleX + paddleWidth) {
          bally = -bally
        }
        
    else if(y + bally > canvas.height - ballRadius) {
          alert("Game Over");
          document.location.reload();
          clearInterval(interval);
      }
  }
  /* || er en form for eller - så hvis enten den ene eller den anden statement er true, ændres retningen af bolden. 
  Der er trukket ballRadius fra og sat "< ballRadius" sådan så bolden ikke synker ind i rammen. Så ligner det, at bolden ændre kurs, når kanten af bolden rammer rammen */

 if(dPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(aPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
  /*får paddlen til at bevæge sig til højre eller venstre, men Samtidig ikke udenfor canvas, er der nemlig taget højde for oppe ved den anden if statement. tallet 7 definerer hastigheden paddlen bevæger sig med, når der trykkes. Om det er en fejl, eller mangle på erfaring, kan diskuterres, men nås et vist niveau, vil bolden bevæge sig så hurtigt, at selve paddle ikke kan følge med*/

  x += ballx;
  y += bally;
  
  requestAnimationFrame(draw);
}
draw();