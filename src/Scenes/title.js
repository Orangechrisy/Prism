class Title extends Phaser.Scene {
    constructor() {
        super("title");
    }
    preload() {
        // Load font
        this.load.setPath("./assets/");
        this.load.image("titleCard", "titleScreen.png")
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.add.image(500, 300, "titleCard");

        this.startText = this.add.bitmapText(500, 500, "publicPixel",
        "Press S to start!", 24).setOrigin(0.5);

        this.start = this.input.keyboard.addKey("S");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.start)) {
            this.scene.start("loadScene");
        }
    }
}