// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth -20;
canvas.height = window.innerHeight -20;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image(window.innerWidth, window.innerWidth);
bgImage.onload = function () {
	bgReady = true;
};

// character image
var characterReady = false;
var characterImage = new Image();
characterImage.onload = function () {
	characterReady = true;
};
characterImage.src = "images/robot.png";

// cpu image
var cpuReady = false;
var cpuImage = new Image();
cpuImage.onload = function () {
	cpuReady = true;
};
cpuImage.src = "images/cpu.png";

// goal image
var goalReady = false;
var goalImage = new Image();
goalImage.onload = function () {
	goalReady = true;
};
goalImage.src = "images/diamond.png";

// Game objects
var character = {
	speed: 256, // movement in pixels per second
	width: 32, 
	height: 32
};
var cpu = {
	speed: 196, // movement in pixels per second
	width: 32, 
	height: 32
};

// goals
var goal = {};
var sumGoals = 0, cpuGoals = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Places character in senter of canvas
var start = function () {
	character.x = canvas.width / 2;
	character.y = 0;
	cpu.x = canvas.width / 2;
	cpu.y = canvas.height - cpu.height;
	//getting everything going
	countdown();
	reset();
};

// New goal appears 
var countdown = function () {
	ctx.fillStyle = "rgb(156, 255, 0)";
	ctx.font = "108px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	var i = 3;

	var aoeu = setInterval(function() {
		ctx.save();
		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Restore the transform
		ctx.restore();

		if(i > 0)
			ctx.fillText(i--, canvas.width/2, canvas.height/2 - 54);
		else {
			ctx.fillText("Go!", canvas.width/2, canvas.height/2 - 54);
			window.clearInterval(aoeu);
		}
	}, 1000);
};

// New goal appears 
var reset = function () {
	goal.x = 32 + (Math.random() * (canvas.width - 64));
	goal.y = 32 + (Math.random() * (canvas.height - 64));	
};

// Update game objects
var update = function (modifier) {
	// Player movement
	if (38 in keysDown) { // Player holding up
		if(character.y >0)
			character.y -= character.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		if(character.y < canvas.height - character.height)
			character.y += character.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		if(character.x > 0)
			character.x -= character.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		if(character.x < canvas.width - character.width)
			character.x += character.speed * modifier;
	}

	// CPU movement
	if(cpu.y > goal.y)
		cpu.y -= cpu.speed * modifier;
	if(cpu.y < goal.y)
		cpu.y += cpu.speed * modifier;
	if(cpu.x > goal.x)
		cpu.x -= cpu.speed * modifier;
	if(cpu.x < goal.x)
		cpu.x += cpu.speed * modifier;

	// Collision Detection
	if (character.x <= (goal.x + character.width) && goal.x <= (character.x + character.width)
		&& character.y <= (goal.y + character.height) && goal.y <= (character.y + character.height)) {
		++sumGoals;
		reset();
	}
	if (cpu.x <= (goal.x + cpu.width) && goal.x <= (cpu.x + cpu.width)
		&& cpu.y <= (goal.y + cpu.height) && goal.y <= (cpu.y + cpu.height)) {
		++cpuGoals;
		reset();
	}
};

// Draw everything
var render = function () {	
	ctx.save();
	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Restore the transform
	ctx.restore();

	if (bgReady) 
		ctx.drawImage(bgImage, 0, 0);
	if (characterReady) 
		ctx.drawImage(characterImage, character.x, character.y);
	if (cpuReady) 
		ctx.drawImage(cpuImage, cpu.x, cpu.y);
	if (goalReady) 
		ctx.drawImage(goalImage, goal.x, goal.y);

	// Score
	ctx.fillStyle = "rgb(33, 33, 33)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("You: " + sumGoals+", CPU: "+cpuGoals, 5, 5);

	if(sumGoals == 10 || cpuGoals == 10) {
		window.clearInterval(begin);
	
		ctx.fillStyle = "rgba(0, 0, 0, .7)"
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "rgb(156, 255, 0)";
		ctx.font = "108px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";

		if( sumGoals > cpuGoals) 
			ctx.fillText("You Won. ", canvas.width, canvas.height - 54);
		else
			ctx.fillText("You Lost ", canvas.width/2, canvas.height/2 - 54);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;
};

// Start the game off
start();
var then, begin;
setTimeout(function() {
	then = Date.now();
	begin = setInterval(main, 1); 
}, 5000);

