var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); 
//linje 1 og 2 er for at indlæse grafikken. Linje 1 lager en reference til "canvas". Gemt som variamle canvas, så den nemt kan hentes igen. Linje 2 med ctx er en måde at gemme 2D indlæsningens kontekst. Det sker i en variable navngivet ctx. Det er selve værktøjet, som kan printe noget på canvas. 
const save_key_Score = "highScore"; 
//Locas stoarge key til at gennem ens highScore lokalt
var x = canvas.width/2, y = canvas.height-30;
//Laver en variable for x og y koordinater
var ballx = 3, bally = -3;
//laver en variable for x og y koordinaterne, så det ligner bolden rykker sig
var ballRadius = 10;
//boldens radius, bruges i flere funktioner, så hvis radius skal ændres, skal det kun gøres ét sted
//to variabler som er en del af farvefunktionen, hvilken gør, at bolden ændre farve, hver gang den rammer kanten af canvas
var paddleHeight = 10, paddleWidth = 75, paddleX = (canvas.width-paddleWidth)/2;
//Definerer den paddle, som bolden skal ramme. Samtidig definerers hvor dan skal tegnes på canvas, i midten
var dPressed = false, aPressed = false;
//skal bruges til at få vores paddle til at bevæge sig, når vi trykket på a og d 
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
//koden ovenfor er en to dimesionel arry, hvilket indeholder variablen v for columns, hvilket vil indeholde brick row, r, som begge vil indeholde x og y positionen for hver brick som printes på skærmen. Grundfunktionen af dette arry er at kunne tegne de her bricks på skærmen, hvilket vil blive udført i den senere funktion "function drawBricks"
var score = 0, highScore = 2;
//variable til at kunne vise ens score
var number, color;
//Skal bruges til at ændre farven på bolden og paddlen når bolden rammer kanten af canvas

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//Disse to linjer er nogle som altid kører, de "lytter" efter om en knap bliver trykket, og den lytter efter en knap, knapper*, bliver sluppet.

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
//to funktioner for keyup og keydown - er med til at definere forudsætningen til, at få min paddle til at kunne bevæge sig - knapperne er defineret til d og a - dette gælder alle steder, dog er det altid en god ide, at tjekke, om der skulle være en "conflict" ved en anden browser. Eksembelvis edge, hvor ArrowRight og -left bare hedder left og right. Når den ønsket knap trykkes, ændre funktionen sig til true, og funktionen drawPaddle if, else statement bliver da aktiveret, slippes knappen, deaktiveres funktionen ved sidste kendte position.  

function getRandomColor() {
    number = Math.floor(Math.random() * 1000000 + 1);
    color = convertToColor(number);
    return color;
}

function convertToColor(num){
    return '#' + ('00000' + (num | 0).toString(16)).substr(-6);
}
//De to funktioner ovenfor sammen med de to sidste variabler er for at få bolden og paddle til at skifte farve hver gang den rammer kanten af canvas og hver brick ****

function collisionDetection(){
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
        var b=bricks[c][r];
        //collisionDetection
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
//function til at kunne tegne ens score

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
//function til at kunne tegne ens hidhscore, samtidig er den med til at få ens high score fra local stoarge. *** uddyb

function drawBall(){
      //tegnefunktion for bolden
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  //beginpath til closepath tegner en bold
}

function drawPaddle(){
    //tegnefunktion for paddle
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight-15, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath;
}

function redrawBricks(){
  //tegnefunktion for bricks
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
//Denne function bygger på det arry defineret tidligere, de to nye tilføjet variable gør det nu muligt for os at tegne de her bricks i forskellige x og y koordinater hver gang der køres igennem det arry, hvis ikke de var tilføjet,ville alle bricks tegnes ved (0,0). For x-koordinaten gørs der brug af c-variablen defineret ved arry, hvilken ganges med brickwidt plus brickPadding som efterfølgende plused med brickOffsetleft, for at få dem til at blive tegnet væk kanten. Det samme gælder for y-koordinaten, her er der bare blevet brugt r-variablen og brickOffsetTop istedet. Samtidig er der tilføjet en if statement, som siger, at der kun skal tegnes en brick, hvis bricksstaus er lig med 1 

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
//De tre functions er designet således, at når alle bricks er fjernet, deres værdi er 0, skal alle bricks værdier sættes tilbage til 1. På den måde får vi muligheden for er længere spil, nu da jeg ikke har levels. 

function glitchdetectorx(){
  if(ballx > - 0.5 && ballx < 0.5)
      ballx = 2;
}
//Bruges til, at bolden ikke bare hopper lige op eller lige ned.

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height); //ryder canvas ved hvert frame, så det ligner boldten rykker sig
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
  //Få bolden til at "bounce" ved impact af kanten
  if(y + bally < ballRadius) {
    bally = -bally;
    color = getRandomColor();
  }
  //Få bolden til at "bounce" ved impact af toppen
  else if(y + bally > canvas.height - paddleHeight - 20) {
        if(x > paddleX && x < paddleX + paddleWidth) {
          bally = -bally
        }
        //selve else if if funktionen gør bare, at bolden skal bounce op igen, hvis den rammer vores paddle
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
  //x og y får bolden til at rykke sig
  requestAnimationFrame(draw);
}
draw();