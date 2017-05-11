// Create our 'main' state that will contain the game

var mainState = {

preload: function() {

// This function will be executed at the beginning

// That's where we load the images and sounds
    
//Load the bird sprite

game.load.image('bird', 'assets/therock.png');
game.load.image('pipe', 'assets/post.png'); 
},

create: function() {

// This function is called after the preload function

// Here we set up the game, display sprites, etc.
    
//Change the background colour of the game to blue - for now!

game.stage.backgroundColor = '#71c5cf';

//Set the physics system

game.physics.startSystem(Phaser.Physics.ARCADE);

//Display the bird at the position x=100 and y=245

this.bird = game.add.sprite(100, 245, 'bird');

//Add physics to the bird

//Needed for: movement, gravity, collisions, etc.

game.physics.arcade.enable(this.bird);

//Add gravity to the bird to make it fall

this.bird.body.gravity.y = 1000;

//Call the 'jump' function when the spacebar is pressed

var spaceBar = game.input.keyboard.addKey(

Phaser.Keyboard.SPACEBAR);

spaceBar.onDown.add(this.jump, this);
    
//Create an empty group
    this.pipes = game.add.group();
    
//Timer for pipes

this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    
//Score
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", 
        { font: "30px Arial", fill: "#ffffff" });
    
//New anchor position
this.bird.anchor.setTo(-0.2, 0.5);

},

update: function() {

// This function is called 60 times per second

// It contains the game's logic

// This function is called 60 times per second

//If the 'bird' is out of the screen (too high or too low)

//Call the 'restartGame' function

if (this.bird.y < 0 || this.bird.y > 490)

this.restartGame();

//calls the restartGame function each time the bird dies
game.physics.arcade.overlap(
  this.bird, this.pipes, this.hitPipe, null, this);
    
//Slowly rotate the bird downward, up to a certain point
if (this.bird.angle < 20)
    this.bird.angle += 1;

},
    
//Make the bird jump

jump: function() {
    
//Stops the bird being controlled when it's dead
if (this.bird.alive == false)
    return;

//Add a vertial velocity to the bird

this.bird.body.velocity.y = -350;
    
//Create an animation on the bird 
var animation = game.add.tween(this.bird);
    
//Change the angle of the bird to -20 in 100 milliseconds
animation.to({angle: -20}, 100);
    
//Add the start animation
animation.start();

},
    
//Restart the game

restartGame: function() {

//Start the 'main' state, which restarts the game

game.state.start('main');

},
    
//Adds a pipe

addOnePipe: function(x, y) {

//Create a pipe at the position x and y

var pipe = game.add.sprite(x, y, 'pipe');

//Add the pipe to our previously created group

this.pipes.add(pipe);

//Enable physics on the pipe

game.physics.arcade.enable(pipe);

//Add velocity to the pipe to make it move left

pipe.body.velocity.x = -200;

//Automatically kill the pipe when it is no longer visible

pipe.checkWorldBounds = true;

pipe.outOfBoundsKill = true;

},
    
//Adds 6 pipes

addRowOfPipes: function() {

//Randomly pick a number between 1 and 5

//This will be the hole position in the pipe for the bird to fly through

var hole = Math.floor(Math.random() * 5) + 1;

//Add the 6 pipes

//With one big hole at position 'hole' and 'hole + 1'

for (var i = 0; i < 8; i++)

if (i != hole && i != hole + 1)

this.addOnePipe(400, i * 60 + 10);
    
//Increases score as new pipes are created
this.score += 1;
this.labelScore.text = this.score;

},

hitPipe: function() {
  
//If the bird has already hit a pipe, do nothing    
//It means the bird is already falling off the screen
if (this.bird.alive == false)
    return;
    
//Set the alive property of the bird to false
this.bird.alive = false;
    
//Prevent new pipes from appearing 
game.time.events.remove(this.timer);
    
//Go through all the pipes, and stop their movement
this.pipes.forEach(function(p){
    p.body.velocity.x = 0;
}, this);
    
},

};

// Initialize Phaser, and create a 400px by 490px game

var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'

game.state.add('main', mainState);

// Start the state to actually start the game

game.state.start('main');