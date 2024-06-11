class Sign extends Phaser.Scene {
    constructor() {
        super("sign");
    }
    init (sign)
    {
        this.signNumber = Number(sign);
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.add.image(500, 300, "signShade");

        switch(this.signNumber) {
            case 1:
                this.signText = this.add.bitmapText(500, 200, "publicPixel",
                "Have a colorful day!\n\n\n\nUse arrow keys for movement\nPress P to pause", 24, 1).setOrigin(0.5);
                break;
            default:
                this.signText = this.add.bitmapText(500, 200, "publicPixel",
                "Oop sign broke :(", 24, 1).setOrigin(0.5);
        }

        this.resume = this.input.keyboard.addKey("E");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.resume)) {
            this.scene.resume("level");
            this.scene.stop();
        }
    }
}