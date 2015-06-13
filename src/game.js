window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var titleScreen;
var backgrounds;
var level;
var sonic;
var physics;
var gamepad;
var rings;

var sounds = [
    {title: 'stage', url: 'resources/audio/emerald-hill.mp3'},
    {title: 'jump', url: 'resources/audio/jump.wav'},
    {title: 'stop', url: 'resources/audio/stop.wav'},
    {title: 'ring', url: 'resources/audio/ring.wav'},
    {title: 'title', url: 'resources/audio/title-screen.mp3'}
];
var audio = new Audio(sounds);

var images = [
    {title: 'title_bg', url: 'resources/image/title_bg.png'},
    {title: 'title_sonic', url: 'resources/image/title_sonic.png'},
    {title: 'bg_mer', url: 'resources/image/mer.jpg'},
    {title: 'bg_clouds1', url: 'resources/image/bn.png'},
    {title: 'bg_clouds2', url: 'resources/image/mn.png'},
    {title: 'tileset', url: 'resources/image/emeraldhillsc2.png'},
    {title: 'sonicSprites', url: 'resources/image/sprites-sonic.png'},
    {title: 'ring', url: 'resources/image/ring.png'}
];
var resources = new Resources(images);

var canvas = document.getElementById('game');
var context2d = canvas.getContext('2d');

var rafHandler;

audio.load()
	.then(function(value) {
		return resources.load();
	})
	.then(function(value) {
		launchTitle();
	});


function launchTitle() {
	titleScreen = new TitleScreen();
	audio.stageTitle(startGame);
	paintTitle();
}

function paintTitle() {
	canvas.width = canvas.width;
	titleScreen.paint(context2d);
	rafHandler = window.requestAnimationFrame(paintTitle);
}

function startGame() {
	console.log('start game');
	window.cancelAnimationFrame(rafHandler);

    var mapping = {
        A: 0,
        B: 1,
        LEFT: 15,
        RIGHT: 16
    };

	gamepad = new Gamepad(mapping);
	backgrounds = new Background();
	physics = new Physics();
	level = new Level();
	sonic = new Sonic();
	rings = new Rings()

    paintGame();
	audio.stageBgm();
}

function checkInput() {

	if(gamepad.controls[gamepad.A] == true && !physics.isInAir()) {
		audio.jump();
		physics.jump();

	} else if (physics.isInAir()) {
		if (gamepad.controls[gamepad.LEFT] == true) {
			physics.accelerateLeft(true);
		} else if (gamepad.controls[gamepad.RIGHT] == true) {
			physics.accelerateRight(true);
		}

	} else if(!gamepad.controls[gamepad.LEFT] && !gamepad.controls[gamepad.RIGHT]) {
		physics.applyFriction();

	} else if(gamepad.controls[gamepad.LEFT] == true) {
		if (physics.shouldBrakeLeft()) {
			audio.stop();
			sonic.startStopRight();
			physics.decelerateWhenRunningRight();
		} else if (physics.shouldDecelerateLeft()) {
			physics.decelerateWhenRunningRight();
		} else {
			physics.accelerateLeft(false);
		}
	} else if(gamepad.controls[gamepad.RIGHT] == true) {
		if (physics.shouldBrakeRight()) {
			audio.stop();
			sonic.startStopLeft();
			physics.decelerateWhenRunningLeft();
		} else if (physics.shouldDecelerateRight()) {
			physics.decelerateWhenRunningLeft();
		} else {
			physics.accelerateRight(false);
		}
	}
}

function paintGame() {

	canvas.width = canvas.width;

	backgrounds.paint(context2d, physics.x);
	level.draw(context2d, resources.images['tileset'], physics.x, physics.y);
	sonic.draw(context2d, physics.x, physics.y);

	checkInput();
	physics.applyPhysics();
	sonic.animate();

	if (level.checkAABBRing(physics.x, physics.y)) {
		audio.ring();
	}

    window.requestAnimationFrame(paintGame);
}
