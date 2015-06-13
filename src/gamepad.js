(function (window) {
    'use strict';

    function Gamepad(mapping) {

        this.gamepads = [];
        this.prevTimestamps = [];
        this.prevRawGamepadTypes = [];
        this.ticking = false;
        this.lastDirection;

        this.mapping = mapping || this.defaultMapping;

        // Etat de chaque touche du gamepad
        this.controls = {};

        var gamepadSupportAvailable = !!navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

        if (!gamepadSupportAvailable) {
            alert('Aucun support de la manette');
        } else {
            this.startDetection();
        }
    }

    Gamepad.prototype.defaultMapping = {
        A: 0,
        B: 1,
        LEFT: 14,
        RIGHT: 15
    };
    Gamepad.prototype.A = 'A';
    Gamepad.prototype.B = 'B';
    Gamepad.prototype.LEFT = 'LEFT';
    Gamepad.prototype.RIGHT = 'RIGHT';

    Gamepad.prototype.startDetection = function () {
        if (!this.ticking) {
            this.ticking = true;
            this.tick();
        }
    };

    // Boucle de détection
    Gamepad.prototype.tick = function () {
        window.requestAnimationFrame(this.tick.bind(this));
        this.pollStatus();
    };

    Gamepad.prototype.pollStatus = function () {
        // MAJ de l'état courant des pads
        this.pollGamepads();

        this.gamepads.forEach(function (gamepad) {
            // TODO uniquement pour trouver les mmapings
//            gamepad.buttons.forEach(function (btn, index) {
//                if (btn.pressed) {
//                    console.log(btn, index);
//                    console.log(this.mapping);
//                }
//            }.bind(this));

            var btnA = gamepad.buttons[this.mapping.A];
            if ( btnA.pressed && btnA.value > 0.5) {
                this.controls.A = true;
            } else {
                this.controls.A = false;
            }

            var btnB = gamepad.buttons[this.mapping.B];
            if (btnB.pressed && btnB.value > 0.5) {
                this.controls.B = true;
            } else {
                this.controls.B = false;
            }

            var btnLEFT = gamepad.buttons[this.mapping.LEFT];
            if (btnLEFT.pressed && btnLEFT.value > 0.5) {
                this.controls.LEFT = true;
                this.lastDirection = this.LEFT;
            } else {
                this.controls.LEFT = false;
            }

            var btnRIGHT = gamepad.buttons[this.mapping.RIGHT];
            if (btnRIGHT.pressed && btnRIGHT.value > 0.5) {
                this.controls.RIGHT = true;
                this.lastDirection = this.RIGHT;
            } else {
                this.controls.RIGHT = false;
            }
        }.bind(this));

    };

    // récupère un snapshot de l'état des gamepads courants
    Gamepad.prototype.pollGamepads = function () {
        var rawGamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

        if (rawGamepads) {
            //            console.log(rawGamepads);
            this.gamepads = [];
            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] !== this.prevRawGamepadTypes[i]) {
                    this.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                }

                if (rawGamepads[i]) {
                    this.gamepads.push(rawGamepads[i]);
                }
            }
        }
    };

    window.Gamepad = Gamepad;

})(window);

//var gamePads = {};
//
//function gamepadHandler(event, connecting) {
//  var gamepad = event.gamepad;
//  // Note :
//  // gamepad === navigator.getGamepads()[gamepad.index]
//
//  if (connecting) {
//    gamePads[gamepad.index] = gamepad;
//  } else {
//    delete gamePads[gamepad.index];
//  }
//}
//
//window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
//window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
