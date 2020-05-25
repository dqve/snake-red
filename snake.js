const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
//same as for Breakout, to load the graphics
const scale = 10;
const rows = canvas.height / scale; 
const columns = canvas.width / scale; 
//the three constants used to make the small squares, they are 10 px in size, is what scale does.

var snake, wPressed = false, dPressed = false, sPressed = false, aPressed = false;
//My variables

(function setup(){
  snake = new snake();
  fruit = new fruit();
  /*Note when using this "new" operator 3 things happen
  1. It creates an empty object for example -> const x = {};
  2. It will set the statement this to that object
  3. Lastly, it happens that they make a return statement for that function.
  So, we have the function snake, which is defined further down, here the keyword this is used. So we get this new object, and then set the function snake to point to that object. ********* */

  fruit.pickLocation();
  //if I didn't have to write <i> a lot of text </i>, I would have paved it just below fruit = new fruit (); but it seems more hassle. In general, this makes sure that a location is selected based on pickLocation, which you will see is prepared at random, at the start.

  window.setInterval(() =>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    fruit.draw();
    snake.update();
    snake.draw();

    if(snake.eat(fruit)){
      fruit.pickLocation();
       //Hver gang den if statement er sand, så ændres lokalitionen for æblet.
    }
  }, 250);
}());
//Dette er "tegnefunktionen", den bliver kaldt med det samme, hvorfor selve funktionen er sat i paranteser med det samme. For nu tegner den vores snake. Samtidig bliver snake updateret hvert 250 milisekund, eller 4 gange pr. sekund.

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//Disse to linjer er nogle som altid kører, de "lytter" efter om en knap bliver trykket, og den lytter efter en knap, knapper*, bliver sluppet.

function keyDownHandler(e) {
    if(e.key == "down" || e.key == "w") {
        wPressed = true;
    }
    else if(e.key == "down" || e.key == "d") {
        dPressed = true;
    }
    else if(e.key == "down" || e.key == "s") {
        sPressed = true;
    }
    else if(e.key == "down" || e.key == "a") {
        aPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "down" || e.key == "w") {
        wPressed = false;
    }
    else if(e.key == "down" || e.key == "d") {
        dPressed = false;
    }
    else if(e.key == "down" || e.key == "s") {
        sPressed = false;
    }
    else if(e.key == "down" || e.key == "a") {
        aPressed = false;
    }
}

//to funktioner for keyup og keydown - er med til at definere forudsætningen til, at få min paddle til at kunne bevæge sig - knapperne er defineret til d og a - dette gælder alle steder, dog er det altid en god ide, at tjekke, om der skulle være en "conflict" ved en anden browser. Eksembelvis edge, hvor ArrowRight og -left bare hedder left og right. Når den ønsket knap trykkes, ændre funktionen sig til true, og funktionen drawPaddle if, else statement bliver da aktiveret, slippes knappen, deaktiveres funktionen ved sidste kendte position.  

function fruit(){
  this.x;
  this.y;
    //Function for det velkendte æble, som snake skal spise. x og y-værdierne er ikke valgt endnu, og venter derfor på at få en værdi. 
  this.pickLocation = function(){
    this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;  
    this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
  }
  //Her er ventetiden for x og y-værdierne for æblet over. Jeg vil gerne have lokalitionen til at være tilfældig, hvorfor jeg har brugt denne matematik"formel". .flor skulle meget gerne gøre, så det bliver et helt rundt tal. For x tager jeg et tilfældigt tal og ganger det med antal rækker, rows og minusser med en efter hvilket jeg plusser med en igen. Det skulle meget gerne være for at sikre, at æblet ikke bliver tegnet uden for canvas. Sidst ganges der med scale, for at få den til at passe med de firkanter, som er ved canvas **note, hvis du ikke ser nogle firkanter, er det fordi jeg ikke nåede at ændre canvas, så man kan se firkanterne**.

  this.draw = function(){
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, scale, scale); 
  }
  //Giver nok sig selv, men functionen for at tegne frugten. this kan erstattes med fruit, da functionen hedder function fruit.
}

function snake() {
  this.x = 0; //x.koordinaten for snake ved start
  this.y = 0; //y.koordinaten for snake ved start
  this.xSpeed = scale * 1; //farten i x-retningen ved start
  this.ySpeed = 0; // farten i y-retningen ved start
  this.totalFruitEaten = 0; //antallet af spiste frugter ved strt
  this.tail = []; //Laves en tom arry, som bruges senere for at øge længden af halen. 

  this.draw = function(){
    ctx.fillStyle = "#FFFFFF";

    for (let i=0; i<this.tail.length; i++){
        ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        //Dette er en "simpel" for løkke, hvor den kører igennem dette loop. Her bruget jeg let metoden, som er en form for variable, men kun inde for disse paranteser, {}, og kan altså ikke blive brugt udenfor. Jeg har altså brugt bogstavet i, som variable, hvis variablen er mindre end this.tail.length, altså snakens tail længde, skal den løbe gennem den statment under, hvilket vil tegne en ekstra firkant bag vores "hoved". Lenght er en indbygget property, som kan bruges, til at bestemme længden for en string. Så overordnet set, er denne med 
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  } //Danner grundlag for snakes form. Laver en hvid firkant.

  //^^Funktion for at tegne sanke. Den første sætter "variablerne" for x og y for snake. this.x og this.y der gør this bare, at man kan indsætte hvad funktionene "bliver kaldt" isteder. Så this udgører altså i denne funktionsdel snake.

  this.update = function() { 
    for (let i=0; i<this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i+1];
    }
    //Samme princip som forløkken ovenfor, dog - der med 1, hvilket er for at den ekstra "hale", så at sige, kommer bag vores "hoved", og ikke foran. Hvis du ønsker, kan du prøve at fjerne 1, og se hvad der sker. Halen kommer egentligt foran slangens hoved, og ikke bag. Ellers, så sker der bare det, at slangens hale øges med en, hvor der bliver brugt variablen i**, som så plusses med 1, hver gang det er "rigtigt". ** her kommer let til nytte. Da i kan bruges igen, men med et andet tal, end det i ved den tidligere forløkke. 
      this.tail[this.totalFruitEaten - 1] = { x: this.x, y: this.y};
      //Jer 

    this.x += this.xSpeed;
    this.y += this.ySpeed;
      //Function for at opdatere snakefunktionen - bliver kaldet ved function setup()

    if (this.x > canvas.width){
        this.x = 0;
    }
    //Når snakens x-værdi er større end canvas.width, sættes snakens x-værdi til 0 
    if (this.y > canvas.height){
        this.y = 0;
    }
    //Når snakens y-værdi er større end canvas.height, sættes snakens y-værdi til 0 
    if (this.x < 0){
        this.x = canvas.width;
    }
    //Når snakens x-værdi er mindre end 0, sættes snakens x-værdi til canvas.width
    if (this.y < 0){
        this.y = canvas.height;
    }
    //Når snakens y-værdi er mindre end 0, sættes snakens y-værdi til canvas.height. 

/*De fire if statements under update udgøre den del, som sikre, at vores snake kommer tilbage på canvas, når man rammer kanten. Se under hver statement for, hvad de hver i ser gør. */

    if(wPressed){
      this.xSpeed = 0;
      this.ySpeed = -scale * 1;
    }
    if(sPressed){
      this.xSpeed = 0;
      this.ySpeed = scale * 1;
    }
    if(dPressed){
      this.xSpeed = scale * 1;
      this.ySpeed = 0;
    }
    if(aPressed){
      this.xSpeed = -scale * 1;
      this.ySpeed = 0;
    }
    //De fire if statements er en udvidelse af den fra breakout, men princippet er det samme. De hænder desuden sammen med begge document.addEventListener samt keyDownHandler & keyUpHandler. Danner grundlag for at snaken kan bevæge sig, når der trykkes på kanpperne w,a,s,d

    this.eat = function(fruit){
      if (this.x === fruit.x && this.y === fruit.y){
        this.totalFruitEaten++;
        return true;
      }
        return false; 
    }
    /*denne function tager udgangspunkt for at spise æblet, frugten. Der dannes en function this.eat(snake.eat), som tager fruit som argument. Her bruges der at x og y koordinaterne for snaken og for frugten skal være ens. Der bruges 3 x = tegn, da det er en form for den strenge lære, så det skal være ens. Ikke noget med at ændre lidt på det, så det er rigtigt, der skal stå det samme på begge sidder. Eksempel findes i dokumentet. efter skrives der, at hvis det er rigtigt, så skal this.totalFruitEaten øges med 1, ++, hvor this er snake. Så hvis de to koordinater for snaken og frugten er ens, skal snakens længde altså øges med 1. Det giver så værdien true, hvor hvis det ikke passer giver værdien false, som der ses, return true, og reutrn false. Der er i princippet bare sparet en else statement, og skrevet return med det samme.*/  
  }
}
