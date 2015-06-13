function TitleScreen() {

    this.imageWidth = 320;
    this.backgrounds = [];

    this.backgrounds[0] = {
        background: resources.images['title_bg'],
        scrollValue: 0.1,
        y: 0
    };

    this.scrolledValue = 0;
}

TitleScreen.prototype.paint = function (context) {

    for (var i = 0; i < this.backgrounds.length; i++) {

        // Décallage de chaque image, le modulo permet de boucler quand on a scrollé la taille du canvas
        var offset = this.scrolledValue * this.backgrounds[i].scrollValue % this.imageWidth;
        context.drawImage(this.backgrounds[i].background, offset, this.backgrounds[i].y);

        // Pour les calques qui bougent
        if (this.backgrounds[i].scrollValue > 0) {

            // Si on n'a pas fini un cycle total, affiche une image à côté
            if (offset > 0) {
                context.drawImage(this.backgrounds[i].background, offset - this.imageWidth, this.backgrounds[i].y);
            } else if (offset < 0) {
                context.drawImage(this.backgrounds[i].background, offset + this.imageWidth, this.backgrounds[i].y);
            }
        }
    }
    context.drawImage(resources.images['title_sonic'], 25, 20);

    this.scrolledValue--;
};