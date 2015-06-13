function Rings() {

    // Position de l'animation courante parmi les frames
    this.currentAnimationFrame = 0;

    // Taille en pixels d'une frame d'animation
    this.animationFrameWidth = 16;

    this.totalFrames = 16;

    // Sert à controler la boucle d'animation
    this.animationLoop;

    this.animate();
}


Rings.prototype.drawRing = function (context, x, y) {
    context.drawImage(resources.images['ring'], this.currentAnimationFrame * this.animationFrameWidth, 0, 16, 16, x, y, 16, 16);
};

Rings.prototype.animate = function () {

    this.currentAnimationFrame += 1;
    if (this.currentAnimationFrame == this.totalFrames) {
        this.currentAnimationFrame = 0;
    }

    this.animationLoop = setTimeout(function () {
        this.animate();
    }.bind(this), 100);
};