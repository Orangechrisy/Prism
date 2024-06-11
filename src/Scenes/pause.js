class Pause extends Phaser.Scene {
    constructor() {
        super("pause");
    }
    preload() {
        // this.load.setPath("./assets/");
        // this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.add.image(500, 300, "pauseMenu");

        // this.creditsText = this.add.bitmapText(500, 200, "publicPixel",
        // "PAUSED\n\nPress R to resume game\nPress T to restart game to the Titlescreen", 24, 1).setOrigin(0.5);

        this.resume = this.input.keyboard.addKey("R");
        this.title = this.input.keyboard.addKey("T");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.resume)) {
            this.scene.resume("level");
            this.scene.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(this.title)) {
            this.scene.stop('level');
            this.scene.start("title");
            this.scene.stop();
        }
    }
}