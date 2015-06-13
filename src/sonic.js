function Sonic() {

    // Position de l'animation courante parmi les frames
    this.currentAnimationFrame = 0;

    // Taille en pixels d'une frame d'animation
    this.animationFrameWidth = 44;

    // Nombre de frames dans les animations
    this.standAnimationNumberFrame = 1;
    this.runAnimationNumberFrame = 8;
    this.dashAnimationNumberFrame = 4;
    this.ballAnimationNumberFrame = 5;
    this.stopAnimationNumberFrame = 3;

    // Position y de l'animation courante dans le sprite général.
    this.animationY = 0;

    // Sert à controler la boucle d'animation
    this.animationLoop;

    this.currentState = this.STANDING;
}

Sonic.prototype.STANDING = 'STANDING';
Sonic.prototype.RUNNING = 'RUNNING';
Sonic.prototype.DASHING = 'DASHING';
Sonic.prototype.JUMPING = 'JUMPING';

// Affichage de sonic dans un contexte de canvas
Sonic.prototype.draw = function (context, x, y) {

    var endLevel = level.nbTotalTilesX * level.tileSize;
    var halfScreen = level.tilesDisplayX / 2 * level.tileSize;
    var displayX = x;

    if (level.isAtEndOfLevel(x)) { // Fin de niveau
        displayX = x - endLevel + halfScreen * 2;
    } else if (level.isAtMiddleOfLevel(x)) { // Milieu de niveau
        displayX = halfScreen;
    }

    context.drawImage(resources.images['sonicSprites'], this.currentAnimationFrame * this.animationFrameWidth, this.animationY, 44, 46, displayX - 22, y - 30, 44, 46);
};

// Efface l'animation courante
Sonic.prototype.clearCurrentAnimation = function () {
    this.currentAnimationFrame = 0;
    clearTimeout(this.animationLoop);
};

Sonic.prototype.standLeft = function () {
    if (this.currentState != this.STANDING) {
        this.clearCurrentAnimation();
        this.animationY = 0;
        this.currentState = this.STANDING;
    }
};

Sonic.prototype.standRight = function () {
    if (this.currentState != this.STANDING) {
        this.clearCurrentAnimation();
        this.animationY = 46;
        this.currentState = this.STANDING;
    }
};

Sonic.prototype.startRunRight = function () {
    if (this.currentState != this.RUNNING) {
        this.clearCurrentAnimation();
        this.animationY = 138;
        this.run();
        this.currentState = this.RUNNING;
    }
};

Sonic.prototype.startRunLeft = function () {
    if (this.currentState != this.RUNNING) {
        this.clearCurrentAnimation();
        this.animationY = 92;
        this.run();
        this.currentState = this.RUNNING;
    }
};

Sonic.prototype.startDashRight = function () {
    if (this.currentState != this.DASHING) {
        this.clearCurrentAnimation();
        this.animationY = 230;
        this.dash();
        this.currentState = this.DASHING;
    }
};

Sonic.prototype.startDashLeft = function () {
    if (this.currentState != this.DASHING) {
        this.clearCurrentAnimation();
        this.animationY = 184;
        this.dash();
        this.currentState = this.DASHING;
    }
};

Sonic.prototype.startBallRight = function () {
    if (this.currentState != this.JUMPING) {
        this.clearCurrentAnimation();
        this.animationY = 322;
        this.ball();
        this.currentState = this.JUMPING;
    }
};

Sonic.prototype.startBallLeft = function () {
    if (this.currentState != this.JUMPING) {
        this.clearCurrentAnimation();
        this.animationY = 276;
        this.ball();
        this.currentState = this.JUMPING;
    }
};

Sonic.prototype.startStopRight = function () {
    this.clearCurrentAnimation();
    this.animationY = 414;
    this.stop();
};

Sonic.prototype.startStopLeft = function () {
    this.clearCurrentAnimation();
    this.animationY = 368;
    this.stop();
};

Sonic.prototype.run = function () {
    this.currentAnimationFrame += 1;
    if (this.currentAnimationFrame == this.runAnimationNumberFrame) {
        this.currentAnimationFrame = 0;
    }

    this.animationLoop = setTimeout(function () {
        this.run();
    }.bind(this), 100);
};

Sonic.prototype.dash = function () {
    this.currentAnimationFrame += 1;
    if (this.currentAnimationFrame == this.dashAnimationNumberFrame) {
        this.currentAnimationFrame = 0;
    }

    this.animationLoop = setTimeout(function () {
        this.dash();
    }.bind(this), 100);
};

Sonic.prototype.ball = function () {
    this.currentAnimationFrame += 1;
    if (this.currentAnimationFrame == this.ballAnimationNumberFrame) {
        this.currentAnimationFrame = 0;
    }

    this.animationLoop = setTimeout(function () {
        this.ball();
    }.bind(this), 100);
};

Sonic.prototype.stop = function () {
    this.currentAnimationFrame += 1;

    if (this.currentAnimationFrame == this.stopAnimationNumberFrame) {
        this.currentAnimationFrame = 0;
    }

    this.animationLoop = setTimeout(function () {
        this.stop();
    }.bind(this), 100);
};


Sonic.prototype.animate = function () {
    if (physics.isInAir()) {
        if (physics.speed > 0) {
            this.startBallRight();
        } else if (physics.speed < 0) {
            this.startBallLeft();
        } else {
            if (gamepad.lastDirection == gamepad.LEFT) {
                this.startBallLeft();
            } else {
                this.startBallRight();
            }
        }

    } else if (physics.isStanding()) {
        if (gamepad.lastDirection == gamepad.LEFT) {
            this.standLeft();
        } else {
            this.standRight();
        }
    } else if (physics.isRunningRight()) {
        this.startRunRight();
    } else if (physics.isRunningLeft()) {
        this.startRunLeft();
    } else if (physics.isDashingRight()) {
        this.startDashRight();
    } else if (physics.isDashingLeft()) {
        this.startDashLeft();
    }
}