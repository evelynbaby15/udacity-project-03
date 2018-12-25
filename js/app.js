'use strict';
var xRange = 4;
var yRange = 5;

const GRID_WIDTH = 101;
const GRID_HEIGHT = 83;

const PLAYER_START_xGrid = 2;
const PLAYER_START_yGrid = 5;

var currentSelectIndex = 0;
var charLen;

const DECTECT_W = 99;
const DECTECT_H = 80;

var score = 0;

// TODO: 調整蟲蟲速度
// const RACE = [10, 30, 100];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
   
    this.sprite = 'images/enemy-bug.png';
    
    let randomY = getRandomInt(1, 4);
    this.randomX = getRandomInt(20, 300);

    this.x = -GRID_WIDTH;
    this.y = randomY * GRID_HEIGHT - 20;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if(this.x > (xRange +1) * GRID_WIDTH) {
        this.x = -GRID_WIDTH;
    }
    this.x += this.randomX * dt;

    // this.x = 100;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.strokeRect(this.x, this.y + 20, DECTECT_W, DECTECT_H);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // default character
    this.sprite = 'images/char-pink-girl.png';

    this.xMoveUnit = GRID_WIDTH;
    this.yMoveUnit = GRID_HEIGHT;

    // Player start point
    this.xGrid = PLAYER_START_xGrid;
    this.yGrid = PLAYER_START_yGrid;

    // Player start position
    this.x = this.xGrid * this.xMoveUnit;
    this.y = this.yGrid * this.yMoveUnit;
};
Player.prototype.update = function() {
    // console.log('Player update');
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.strokeRect(this.x, this.y, DECTECT_W, DECTECT_H);
};
Player.prototype.backToStart = function() {
    this.xGrid = PLAYER_START_xGrid;
    this.yGrid = PLAYER_START_yGrid;
    this.x = this.xGrid * this.xMoveUnit;
    this.y = this.yGrid * this.yMoveUnit;
}
Player.prototype.handleInput = function(moveDirection) {
    // console.log("xgrid:", this.xGrid, ", ygrid:", this.yGrid);
    switch (moveDirection) {
        case 'left':
            this.xGrid = this.xGrid - 1 < 0 ? this.xGrid : (this.xGrid -1);
            this.x = this.xGrid * this.xMoveUnit;
            break;
        case 'up':
            this.yGrid = this.yGrid - 1 < 0 ? this.yGrid: (this.yGrid - 1);
            this.y = this.yGrid * this.yMoveUnit;
            // win
            if(this.yGrid == 0) {
                // console.log("yGrid:", this.yGrid);
                document.getElementById("score").textContent = "Congratulations~~~ You win!";
                score++;
                setTimeout(() => {
                    document.getElementById("score").textContent = score;
                    player.backToStart();
                }, 1000);
                
            }

            break;
        case 'right':
            this.xGrid = this.xGrid + 1 > xRange ? this.xGrid : (this.xGrid +1);
            this.x = this.xGrid * this.xMoveUnit;
            break;
        case 'down':
            this.yGrid = this.yGrid + 1 > yRange ? this.yGrid : (this.yGrid +1);
            this.y = this.yGrid * this.yMoveUnit;
            break;     
        default:
            console.log("Can't go.");
            break;
    }
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (let i=0; i<3; i++) {
    // let enemy = new Enemy(-300,40+i*90);
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function checkCollisions() {
      for(var enemy of allEnemies) {
        if(player.isCollision(enemy)) {
            console.log("collision happend!");
            // reset player back to start position
            player.backToStart();
        }
    }

}

Player.prototype.isCollision = function(enemy) {
    // Set default value for dectection, e.g.
    // bug-enemy dectecion size: 80 * 150
    // player dectection size: 90 * 160

    let xClash = false;
    let yClash = false;

    // Player's xy
    const x1 = this.x;
    const x2 = this.x + DECTECT_W;

    const y1 = this.y;
    const y2 = this.y + DECTECT_H;

    // Enemy's xy
    const ex1 = enemy.x;
    const ex2 = enemy.x + DECTECT_W;

    const ey1 = enemy.y + 20;
    const ey2 = enemy.y + DECTECT_H + 20;

    // console.log("(x1, y1):", x1, y1);
    // console.log("(ex1, ey1):", ex1, ey1);

    // 1.top-left point
    if(x1 >= ex1 && x1 <= ex2) {
        if(y1 >= ey1 && y1 <= ey2) {
            xClash = true;
            //console.log(`(x1,y1):(${x1}, ${y1}) is in `, ex1);
        }
    }

    // 2.top-right point
    if(x2 >= ex1 && x2 <= ex2) {
        if(y1 >= ey1 && y1 <= ey2) {
            xClash = true;
        }
    }

    // 3.bottom-left point
    if(x1 >= ex1 && x1 <= ex2) {
        if(y2 >= ey1 && y2 <= ey2) {
            yClash = true;
        }
    }

    // 4.bottom-right point
    if(x2 >= ex1 && x2 <= ex2) {
        if(y2 >= ey1 && y2 <= ey2) {
            yClash = true;
        }
    }
    return xClash && yClash;
}
/** 
 * Choose character.
*/
function clickChar(img){
    player.sprite = img;
    document.querySelector(".sec-choose-char").style.display = "none";
    document.getElementById("score-div").style.display = "block";
    init();
}

window.onload = function() {
    document.addEventListener('keyup', changeSelectedCharacterCSS, false);

    const charters = document.querySelectorAll(".sec-choose-char img");
    charLen = charters.length;

    charters[currentSelectIndex].focus();
    charters[currentSelectIndex].classList.add("choose");

    document.getElementById("score-div").style.display = "none";
   
}

function changeSelectedCharacterCSS(e) {
    const charters = document.querySelectorAll(".sec-choose-char img");

    switch (e.key) {
        case 'ArrowLeft':
            if(currentSelectIndex > 0) {
                currentSelectIndex--;
            } else {
                currentSelectIndex = charLen - 1;
            }
            charters[currentSelectIndex].focus();
            charters[currentSelectIndex].classList.add("choose");
            break;
        case 'ArrowRight':
            if(currentSelectIndex < charLen - 1) {
                currentSelectIndex++;
            } else {
                currentSelectIndex = 0;
            }
            charters[currentSelectIndex].focus();
            charters[currentSelectIndex].classList.add("choose");
            break;
        case 'Enter':
            // console.log("enter img src:", charters[currentSelectIndex].getAttribute("data-role"));
            clickChar(charters[currentSelectIndex].getAttribute("data-role"));
            break;
        default:
            break;
    }

    charters.forEach((ele, i) => {
        if(currentSelectIndex != i) {
            ele.classList.remove("choose");
        }
    });
    // console.log("currentSelectIndex:", currentSelectIndex);
}