const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
//same as for Breakout, to load the graphics
const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
//the three constants used to make the small squares, they are 10 px in size, is what scale does.

var snake, wPressed = false,
    dPressed = false,
    sPressed = false,
    aPressed = false;
//My variables

(function setup() {
    snake = new snake();
    fruit = new fruit();
    /*Note when using this "new" operator 3 things happen
      1. It creates an empty object for example -> const x = {};
      2. It will set the statement this to that object
      3. Lastly, it happens that they make a return statement for that function.
      So, we have the function snake, which is defined further down, here the keyword this is used. So we get this new object, and then set the function snake to point to that object. ********* */

    fruit.pickLocation();
    //if I didn't have to write <i> a lot of text </i>, I would have paved it just below fruit = new fruit (); but it seems more hassle. In general, this makes sure that a location is selected based on pickLocation, which you will see is prepared at random, at the start.

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
            fruit.pickLocation();
            //Each time the if statement is true, the location of the apple changes.
        }
    }, 250);
}());
  //This is the "drawing function", it is called immediately, which is why the function itself is put in parentheses immediately. For now, it draws our snake. At the same time, the snake is updated every 250 milliseconds, or 4 times per second. second.

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//These two lines are some that always run, they "listen" for a button being pressed, and it listens for a button, buttons *, being released.

function keyDownHandler(e) {
    if (e.key == "down" || e.key == "w") {
        wPressed = true;
    } else if (e.key == "down" || e.key == "d") {
        dPressed = true;
    } else if (e.key == "down" || e.key == "s") {
        sPressed = true;
    } else if (e.key == "down" || e.key == "a") {
        aPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "down" || e.key == "w") {
        wPressed = false;
    } else if (e.key == "down" || e.key == "d") {
        dPressed = false;
    } else if (e.key == "down" || e.key == "s") {
        sPressed = false;
    } else if (e.key == "down" || e.key == "a") {
        aPressed = false;
    }
}

//two functions for keyup and keydown - help define the precondition for moving my paddle - the buttons are defined for d and a - this applies everywhere, however, it is always a good idea to check if there should be a "conflict" on another browser. Example edge, where ArrowRight and lift are just called left and right. When the desired button is pressed, the function changes to true and the function drawPaddle if, else statement is activated, the button is released, the function is deactivated at the last known position.

function fruit() {
    this.x;
    this.y;
    //Function of the well-known apple that snake must eat. The x and y values ​​are not selected yet and are therefore waiting to get a value.
    this.pickLocation = function() {
            this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
            this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        }
        //Here is the wait for the x and y values ​​for the apple over. I want the location to be random, which is why I used this math "formula". .flor would very much like to do so that it becomes a completely round number. For x I take a random number and multiply it by number of rows, rows and minuses with one after which I plus with one again. It should very much be to ensure that the apple is not drawn outside the canvas. Last time to scale, to make it fit with the squares that are on canvas ** note, if you don't see any squares, it's because I didn't manage to change the canvas so you can see the squares **.

    this.draw = function() {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, scale, scale);
        }
        //Probably gives itself, but the function of drawing the fruit. this can be replaced with fruit, as the function is called function fruit.
}

function snake() {
    this.x = 0; //x.coordinate for snake at start
    this.y = 0; //y.coordinate for snake at start
    this.xSpeed = scale * 1; //the speed in the x direction at takeoff
    this.ySpeed = 0; // the speed in the Y direction at takeoff
    this.totalFruitEaten = 0; //the number of fruits eaten by strt
    this.tail = []; //Make an empty arry which is used later to increase the length of the tail.

    this.draw = function() {
            ctx.fillStyle = "#FFFFFF";

            for (let i = 0; i < this.tail.length; i++) {
                ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
                //This is a "simple" for loop where it runs through this loop. Here I easily used the method, which is a form of variable, but only for these parentheses, {}, and thus cannot be used outside. So I used the letter in, as variable, if the variable is less than this.tail.length, ie the tail's length, it must run through the statment below, which will draw an extra square behind our "head". Length is a built-in property that can be used to determine the length of a string. So overall, this one is included
            }
            ctx.fillRect(this.x, this.y, scale, scale);
        } //Forms the basis for snake form. Makes a white square.

    //^^Function to draw sanke. The first sets the "variables" for x and y for snake. this.x and this.y that just makes it possible to insert what the functions "are called" instead. So this constitutes in this feature part snake.

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        //The same principle as the loop above, however - there with 1, which is so that the extra "tail", so to speak, gets behind our "head", and not in front. If you want, try removing 1 and see what happens. The tail actually comes in front of the snake's head, and not behind. Otherwise, it just happens that the tail of the snake is increased by one, where the variable in ** is used, which is then increased by 1 every time it is "right". ** Here comes easy utility. Since you can be used again, but with a different number than the one in the previous loop.
        this.tail[this.totalFruitEaten - 1] = {
            x: this.x,
            y: this.y
        };
        //Because

        this.x += this.xSpeed;
        this.y += this.ySpeed;
        //Function to update the talk function - is called by function setup ()

        if (this.x > canvas.width) {
            this.x = 0;
        }
        //When the x value of the snake is greater than canvas.width, the x value of the snake is set to 0 
        if (this.y > canvas.height) {
            this.y = 0;
        }
        //When the y value of the snake is greater than canvas.width, the y value of the snake is set to 0
        if (this.x < 0) {
            this.x = canvas.width;
        }
        //When the x value of the snake is less than 0, the snail's x value is set to canvas.width
        if (this.y < 0) {
            this.y = canvas.height;
        }
        //When the y-value of the snake is less than 0, the y-value of the snake is set to canvas.height.

        /*The four if statements during update make up the part that ensures that our snake gets back on the canvas when you hit the edge. Look under each statement for what they each see. */

        if (wPressed) {
            this.xSpeed = 0;
            this.ySpeed = -scale * 1;
        }
        if (sPressed) {
            this.xSpeed = 0;
            this.ySpeed = scale * 1;
        }
        if (dPressed) {
            this.xSpeed = scale * 1;
            this.ySpeed = 0;
        }
        if (aPressed) {
            this.xSpeed = -scale * 1;
            this.ySpeed = 0;
        }
        //The four if statements are an extension of it from the breakout, but the principle is the same. They also work with both document.addEventListener and keyDownHandler & keyUpHandler. Provides a basis for the snake to move when the buttons w, a, s, d are pressed

        this.eat = function(fruit) {
                if (this.x === fruit.x && this.y === fruit.y) {
                    this.totalFruitEaten++;
                    return true;
                }
                return false;
            }
            /*This function is based on eating the apple, the fruit. A function is created this.eat (snake.eat) which takes fruit as an argument. Here, the x and y coordinates of the snake and the fruit must be the same. 3 x = signs are used as it is a form of the strict doctrine, so it must be the same. Nothing to change a little about it, so it is right to stand the same on both sides. Example can be found in the document. after it is written that if this is true then this.totalFruitEaten should be increased by 1, ++ where this is snake. So if the two coordinates of the snake and the fruit are the same, then the length of the snake must be increased by 1. It then gives the value true, where if it does not fit the value false, as seen, returns true, and reutrn false. In principle, just another statement is saved and written return immediately.*/
    }
}