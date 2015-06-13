function Background() {

    this.canvasWidth = 500;
    this.backgrounds = [];

    this.backgrounds[0] = {
        background: resources.images['bg_mer'],
        scrollValue: 0,
        y: 0
    };

    this.backgrounds[1] = {
        background: resources.images['bg_clouds1'],
        scrollValue: 0.5,
        y: 95
    };

    this.backgrounds[2] = {
        background: resources.images['bg_clouds2'],
        scrollValue: 0.8,
        y: 20
    };

}

Background.prototype.paint = function (context, posXCharacter) {

    var scrolledValue = 0;
    if (level.isAtEndOfLevel(posXCharacter)) {
        scrolledValue = -level.endLevel + level.halfScreen * 2;
    } else if (posXCharacter > level.halfScreen) {
        scrolledValue = -posXCharacter + level.halfScreen;
    }

    for (var i = 0; i < this.backgrounds.length; i++) {

        // Décallage de chaque image, le modulo permet de boucler quand on a scrollé la taille du canvas
        var offset = scrolledValue * this.backgrounds[i].scrollValue % this.canvasWidth;
        context.drawImage(this.backgrounds[i].background, offset, this.backgrounds[i].y);

        // Pour les calques qui bougent
        if (this.backgrounds[i].scrollValue > 0) {

            // Si on n'a pas fini un cycle total, affiche une image à côté
            if (offset > 0) {
                context.drawImage(this.backgrounds[i].background, offset - this.canvasWidth, this.backgrounds[i].y);
            } else if (offset < 0) {
                context.drawImage(this.backgrounds[i].background, offset + this.canvasWidth, this.backgrounds[i].y);
            }
        }
    }
};