//Access Canvas and Context of Canvas
var c=document.getElementById("myCanvas");
var ctx = c.getContext('2d');
//Image Variables
var background = new Image();
var title = new Image();
var splash = new Image();
var block = new Image();
//Sound Effect Variable
var hit = new Audio("assets/sounds/punch.wav");
var intro = new Audio("assets/sounds/intro.wav");
var tada = new Audio("assets/sounds/win.wav");
//Interval Access Variable
var loop;
//Box Holding array
var boxes = new Array();
//Animation Frame storage
var frames = new Array();
//Background Music Array
var music = new Array();
var track;
//World Attributes
var world = {
    width: 760,
    height: 355,
    boxCount: 0,
    maxBoxes: 175,
    level: 1
};
//Player Attributes
var player = {
    name: "Anon",
    color: "#00A",
    x: 640,
    y: 330,
    width: 22,
    height: 12,
    active: false,
    lives: 3,
    hitting: false,
    frame: 0,
    draw: function() {
        if(this.frame < frames.length){
            ctx.drawImage(frames[this.frame], this.x, this.y);
            this.frame++;
        } else {
            this.frame = 0;
            ctx.drawImage(frames[this.frame], this.x, this.y);
        }
    },
    setActive: function(){
        if(!player.active){
            player.active = true;
            document.getElementById("myCanvas").style.cursor = "none";
        }
    }
};
//Floor Block Initialisation
var floor = {
    x: 3,
    y: 363,
    width: 800,
    height: 38,
    draw: function() {
        ctx.fillStyle = 'rgba(225,225,225,0.0)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};
//Box Constructor
function Box(I){
    //Just for IE
    I = I || {};
    //Core Box Proporties
    I.active = true;
    I.speed = world.level * 1.9;
    I.floor = false;
    I.x = Math.random() * world.width;
    I.y = 0;
    I.width = 20;
    I.height = 20;
    //Box Drawing Function
    I.draw = function(){
        ctx.drawImage(block, this.x, this.y);
    };
    //Box Update Function
    I.update = function(){
        I.y += I.speed;
    };
    return I;
}
//Function for loading the player sprite
function loadSprite(){
    for(var i = 1; i <= 8; i++){
        frames[i-1] = new Image();
        frames[i-1].src = "assets/newPlayer/" + i +".png";
    }
}
//Initial Display of the Title Screen
function titleScreen(){
    splash.src = "assets/splash.png";
    title.src = "assets/logo.png";
        levelMusic();
        loadSprite();
        splash.onload = function(){
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#FFF';
            ctx.font = "bold 18px Arial, sans-serif ";
            ctx.drawImage(splash, 0, 0);
            ctx.fillText("CLICK ANYWHERE TO BEGIN", world.width/2 - 105, world.height/2 + 90);
            ctx.drawImage(title, world.width/2 - 240, world.height/2 - 30);
            ctx.strokeRect(0, 0, 800, 400);
            intro.play();
        };
    clicktoRestart();
}
//Function for loading of background music
function levelMusic(){
    for(var i = 1; i <= 4; i++){
        music[i-1] = new Audio("assets/sounds/levels/" + i +".mp3");
    } 
}
//Game Running Function
function start_game(){
    var FPS = 30;
    //Clear the Title Screen
    ctx.clearRect(0,0,800,400);
    //Stop the intro music
    intro.pause();
    //Code for Choosing which Song to play
    track = world.level - 1;
    if(track > 4)
        track -= world.level - 5;
    //Set and Play the chosen track
    music[track].play();
    music[track].volume = 0.2;
    //Load and Draw game background
    background.src = "assets/background.png";
    block.src = "assets/block.png";
    background.onload = function(){
        ctx.drawImage(background,0,0);   
    };
    //OnClick: Set Player to active
    c.addEventListener("mousedown", player.setActive, false);
    //Game Loop
    loop = setInterval(function(){
        draw();
        update();
        handleCollisions();
    }, 1000/FPS);
}
//Reset function
function reset(){
    //Set Values to default
    boxes.length = 0;
    world.boxCount = 0;
    world.maxBoxes = 175;
    player.active = false;
    player.x = 640,
    player.y = 330;
    player.lives = 3;
    for(var i = 0; i <= 4; i++){
        music[i].currentTime = 0;
    } 
}
//Draw the User Interface
function drawUI(){
    ctx.font = "bold 16px courier new, sans-serif ";
    ctx.fillStyle = "#009900";
    //Life Meter
    ctx.fillText("Lives: " + player.lives, 46, 48);
    //Level Meter
    ctx.fillText("Level: " + world.level, 46, 68);
    //Boxes Remaining
    ctx.fillText("Boxes Remaining: " + (world.maxBoxes - world.boxCount), 545, 46);
}
//New Level Function
function newLevel(){
    reset();
    clearInterval(loop);
    
    music[track].pause();
    tada.volume = 0.2;
    tada.play();
    
    world.level++;
    world.maxBoxes += world.level * 10;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 22px Times New Roman, sans-serif ";
    ctx.fillText("YOU SURVIVED LEVEL " + (world.level - 1), world.width/2 - 110, world.height/2);
    ctx.font = "16px helvetica, sans-serif ";
    ctx.fillText("CLICK ANYWHERE TO BEGIN LEVEL " + world.level, world.width/2 - 120, world.height/2 + 30);
    clicktoRestart();
    }
//Win Function
function win(){
    clearInterval(loop);
    
    music[track].pause();
    tada.volume = 0.2;
    tada.play();
    
    ctx.fillStyle = "rgba(245,12,230,0.8)";
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = "#FFCC00";
    ctx.font = "bold 22px Times New Roman, sans-serif ";
    ctx.fillText("CONGRATULATIONS", world.width/2 - 100, world.height/2 - 30); 
    ctx.fillText("YOU WIN!!", world.width/2 - 50, world.height/2);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px helvetica, sans-serif ";
    ctx.fillText("Your Better than everyone else!", world.width/2 - 100, world.height/2 + 30);
}
//Death Function
function death(){
    reset();
    clearInterval(loop);
    
    music[track].pause();
    intro.play();
    
    ctx.fillStyle = "rgba(0,0,0,0.80)";
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = "#FF0000";
    ctx.font = "bold 22px Times New Roman, sans-serif ";
    ctx.fillText("YOU'VE BEEN KILLED", world.width/2 - 100, world.height/2);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px helvetica, sans-serif ";
    ctx.fillText("You made it to Level " + world.level +"...", world.width/2 - 55, world.height/2 + 60);
    world.level = 1;
    ctx.fillText("CLICK ANYWHERE TO RESTART", world.width/2 - 100, world.height/2 + 30);
    
    clicktoRestart();
}
//On Click: Restart game
function clicktoRestart(){
    c.addEventListener("mousedown", function(){
        this.removeEventListener("mousedown", arguments.callee ,false);
        start_game();
    }, false);
}
//Main Update Function
function update() {
    //Restart Song if ended
    if(music[track].ended)
        music[track].currentTime = 0;
    //Boundarys
    if(player.x <= 5){
        player.x = 6;
    } else if(player.x >= 760) {
        player.x = 759;
    }
    
    if(player.y <= 5){
        player.y = 6;
    } else if(player.y >= 335){
        player.y = 334;
    }
    
    //Movement
    document.onkeydown = function() {
    switch (window.event.keyCode) {
        case 37:
            //left
            player.x -= 7;
            break;
        case 38:
            //up
            player.y -= 7;
            break;
        case 39:
            //right
            player.x += 7;
            break;
        case 40:
            //down
            player.y += 7;
            break;
        }
    };
    //Mouse Movement
    if(player.active){
        window.onmousemove = handleMouseMove;
            function handleMouseMove(event) {
                event = event || window.event; // IE-ism
                player.x = event.clientX - 295;
                player.y = event.clientY - 115;
            }
    }

    //Update Boxes
    boxes.forEach(function(box){
        box.update();
    });
    
    //Spawn New Boxes
    if(world.boxCount < world.maxBoxes){
        if(Math.random() < (world.level/10) + 0.05){
            world.boxCount++;
            if(world.boxCount >= world.maxBoxes){
                if(world.level >= 8){
                    win();
                } else {
                    newLevel();
                }
            }
            boxes.push(Box());
        }
    }
}
//Collision Handling
function handleCollisions(){
    //Collision between Box and Floor
    boxes.forEach(function(box){
        if(collides(box, floor) && box.active){
            box.speed = 0;
            box.floor = true;
        }
    });
    //Collision between Boxes
    boxes.forEach(function(box1){
        if(box1.floor === true && box1.active){
            boxes.forEach(function(box2){
                if(collides(box1, box2)){
                        box2.speed = 0;
                        box2.floor = true;
                }
            });
        }
    });
    //Collision between Player and Boxes
    boxes.forEach(function(box){
        if(collides(box, player) && box.active){
            box.active = false;
            player.lives -= 1;
            hit.play();
            if(player.lives === 0){
                death();
            }
        }
    });
}
//Drawing
function draw() {
    ctx.drawImage(background,0,0);
    floor.draw();
    player.draw();
    drawUI();
    boxes.forEach(function(box){
        if(box.active)
            box.draw();
    });
}
//Collision Function
function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}