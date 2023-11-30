//Get the program to be able to get rid of the balls that are clicked on
//There will be a time limit to finish clicking all the balls before time runs out
//Create a count variable to keep track of how many balls are left and report results at the end of the timer
console.log("Hello World");

// Global variables
var timer = 60;
var score = 0;
var ballsToClick = 50; // Set the number of balls to click

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var tx = window.innerWidth;
var ty = window.innerHeight;

canvas.width = tx;
canvas.height = ty;

var mousex = 0;
var mousey = 0;

var grav = 0.99;
var timerInterval;

// Event listener for mouse movement
addEventListener("mousemove", function() {
  mousex = event.clientX;
  mousey = event.clientY;
});

// Ball class
function Ball() {
  this.color = randomColor();
  this.radius = Math.random() * 20 + 14;
  this.startradius = this.radius;
  this.x = Math.random() * (tx - this.radius * 2) + this.radius;
  this.y = Math.random() * (ty - this.radius);
  this.dy = Math.random() * 2;
  this.dx = Math.round((Math.random() - 0.5) * 10);
  this.vel = Math.random() / 5;

  this.update = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fillStyle = this.color;
    c.fill();
    //c.stroke();
  };
}

// Function to generate random color
function randomColor() {
  return (
    "rgba(" +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.round(Math.random() * 250) +
    "," +
    Math.ceil(Math.random() * 10) / 10 +
    ")"
  );
}

// Function to update the timer
function updateTimer() {
  console.log("Time left: " + timer + " seconds");

  if (timer <= 0) {
    console.log("Time's up! Your score: " + score);
    clearInterval(timerInterval);
    gameOver();
  } else {
    timer--;
  }
}

// Function to display the score on the canvas
function displayScore() {
  c.font = "20px Arial";
  c.fillStyle = "black";
  c.fillText("Score: " + score, 20, 30);
  c.fillText("Time: " + timer + "s", tx - 100, 30);
}

// Array to store balls
var bal = [];
for (var i = 0; i < ballsToClick; i++) {
  bal.push(new Ball());
}

// Add new ball every 400 milliseconds
setInterval(function() {
  bal.push(new Ball());
  bal.splice(0, 1);
}, 400);

// Function to handle mouse click
function handleMouseClick() {
  for (var i = 0; i < bal.length; i++) {
    if(timer != 0){
      if (
        mousex > bal[i].x - bal[i].radius &&
        mousex < bal[i].x + bal[i].radius &&
        mousey > bal[i].y - bal[i].radius &&
        mousey < bal[i].y + bal[i].radius
      ) {
        bal.splice(i, 1);
        score++;
      }
    }
  }
}

// Event listener for mouse click
canvas.addEventListener("click", handleMouseClick);

// Animation function
function animate() {
  if (tx != window.innerWidth || ty != window.innerHeight) {
    tx = window.innerWidth;
    ty = window.innerHeight;
    canvas.width = tx;
    canvas.height = ty;
  }

  requestAnimationFrame(animate);
  c.clearRect(0, 0, tx, ty);

  for (var i = 0; i < bal.length; i++) {
    bal[i].update();
    bal[i].y += bal[i].dy;
    bal[i].x += bal[i].dx;

    if (bal[i].y + bal[i].radius >= ty) {
      bal[i].dy = -bal[i].dy * grav;
    } else {
      bal[i].dy += bal[i].vel;
    }

    if (bal[i].x + bal[i].radius > tx || bal[i].x - bal[i].radius < 0) {
      bal[i].dx = -bal[i].dx;
    }

    if (
      mousex > bal[i].x - 20 &&
      mousex < bal[i].x + 20 &&
      mousey > bal[i].y - 50 &&
      mousey < bal[i].y + 50 &&
      bal[i].radius < 70
    ) {
      bal[i].radius += 5;
    } else {
      if (bal[i].radius > bal[i].startradius) {
        bal[i].radius -= 5;
      }
    }
  }

  displayScore();

  if (timer == 0 || score == ballsToClick){
    gameOver();
  }
}

// Call updateTimer every second
timerInterval = setInterval(updateTimer, 1000);

// Call animate function
animate();

  // Function to handle game over
  function gameOver() {
    console.log("Game Over! Your final score: " + score);

    // Display the game over message and restart button
    c.font = "30px Arial";
    c.fillStyle = "red";
    c.fillText("Game Over!", tx / 2 - 100, ty / 2 - 20);
    c.fillText("Your final score: " + score, tx / 2 - 130, ty / 2 + 20);

    // Restart button
    c.fillStyle = "green";
    c.fillRect(tx / 2 - 60, ty / 2 + 40, 120, 40);
    c.fillStyle = "white";
    c.fillText("Restart", tx / 2 - 30, ty / 2 + 65);

  }
  // Event listener for restart button
  canvas.addEventListener("click", function (event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    if(timer == 0){
      if (
        mouseX > tx / 2 - 60 &&
        mouseX < tx / 2 + 60 &&
        mouseY > ty / 2 + 40 &&
        mouseY < ty / 2 + 80
      ) {
        restartGame();
      }
    }
  });
  // Function to restart the game
  function restartGame() {
      timer = 60;
      score = 0;
      clearInterval(timerInterval);

      bal = [];
      for (var i = 0; i < ballsToClick; i++) {
        bal.push(new Ball());
      }

      // Reset the timer interval
      timerInterval = setInterval(updateTimer, 1000);

      // Restart the game loop
      animate();
  }
