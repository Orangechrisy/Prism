class Credits extends Phaser.Scene {
    constructor() {
        super("endCredits");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.creditsText = this.add.bitmapText(500, 300, "publicPixel",
        "Congrats, you did it!\nPress R to restart!", 24, 1).setOrigin(0.5);

        this.restart = this.input.keyboard.addKey("R");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.start("title");
        }
    }
}