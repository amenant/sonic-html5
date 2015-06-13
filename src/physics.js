function Physics() {
    // Vitesse de déplacement, si supérieur à 0 -> vers la droite, inférieur à 0 vers la gauche.
    this.speed = 0;
    this.ySpeed = 0;

    // Positions du personnage.
    this.x = 80;
    this.y = 60;
}

Physics.prototype.ACCELERATION_STRENGTH = 0.046875;
Physics.prototype.FRICTION = 0.046875;
Physics.prototype.DECELERATION_STRENGTH = 0.5;
Physics.prototype.MAX_SPEED = 6;
Physics.prototype.BRAKING_ANIMATION_SPEED = 4.5;
Physics.prototype.GRAVITY = 0.21875;


// Applique le frottement du sol
Physics.prototype.applyFriction = function () {
    this.speed = this.speed - Math.min(Math.abs(this.speed), this.FRICTION) * (this.speed > 0 ? 1 : -1);
};

Physics.prototype.jump = function () {
    this.ySpeed = -6.5;
};

Physics.prototype.applyGravity = function () {

    this.ySpeed += this.GRAVITY;
    if (this.ySpeed > 16) {
        this.ySpeed = 16;
    }
};

Physics.prototype.accelerateRight = function (inAir) {
    this.speed = this.speed + (inAir ? this.ACCELERATION_STRENGTH * 2 : this.ACCELERATION_STRENGTH);
    this.speed = Math.min(this.speed, this.MAX_SPEED);
};

Physics.prototype.accelerateLeft = function (inAir) {
    this.speed = this.speed - (inAir ? this.ACCELERATION_STRENGTH * 2 : this.ACCELERATION_STRENGTH);
    this.speed = Math.max(this.speed, this.MAX_SPEED * -1);
};

// Freine quand le perso court à droite
Physics.prototype.decelerateWhenRunningRight = function () {
    this.speed -= this.DECELERATION_STRENGTH;
    this.speed = Math.max(0, this.speed);
};

// Freine quand le perso court à gauche
Physics.prototype.decelerateWhenRunningLeft = function () {
    this.speed += this.DECELERATION_STRENGTH;
    this.speed = Math.min(0, this.speed);
};

Physics.prototype.isDashingLeft = function () {
    return this.speed == this.MAX_SPEED * -1;
};

Physics.prototype.isDashingRight = function () {
    return this.speed == this.MAX_SPEED;
};

Physics.prototype.isStanding = function () {
    return this.speed == 0;
};

Physics.prototype.isRunningLeft = function () {
    return this.speed < 0 && this.speed > this.MAX_SPEED * -1;
};

Physics.prototype.isRunningRight = function () {
    return this.speed > 0 && this.speed < this.MAX_SPEED;
};

Physics.prototype.canMove = function (right) {
    var collisionValueX = level.getCollisionData(this.x + this.speed + (right ? level.tileSize : -level.tileSize), this.y);
    return this.canGo(collisionValueX);
};

Physics.prototype.isInAir = function () {
    var collisionValueY = level.getCollisionData(this.x, this.y + this.ySpeed + level.tileSize);
    return this.canGo(collisionValueY);
};

Physics.prototype.canGo = function (collisionValue) {
    return collisionValue == 0;
};

// Invoqué quand on appuie sur gauche alors qu'on court à droite.
Physics.prototype.shouldBrakeLeft = function () {
    return this.speed >= this.BRAKING_ANIMATION_SPEED;
};

// Invoqué quand on appuie sur gauche alors qu'on court à droite.
Physics.prototype.shouldBrakeRight = function () {
    return this.speed <= this.BRAKING_ANIMATION_SPEED * -1;
};

Physics.prototype.shouldDecelerateLeft = function () {
    return this.speed > 0;
};

Physics.prototype.shouldDecelerateRight = function () {
    return this.speed < 0;
};

Physics.prototype.applyPhysics = function () {

    if (this.isInAir()) {
        this.applyGravity();
        this.y += this.ySpeed;
    } else {
        this.ySpeed = 0;
    }

    if (this.canMove(physics.speed > 0)) {
        this.x += this.speed;
    } else {
        this.speed = 0;
    }
};