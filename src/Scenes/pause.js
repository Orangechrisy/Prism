class Pause extends Phaser.Scene {
    constructor() {
        super("pause");
    }
    create() {
        this.add.image(500, 300, "pauseMenu");

        this.resume = this.input.keyboard.addKey("R");
        this.title = this.input.keyboard.addKey("T");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.resume)) {
            this.scene.resume("level");
            this.scene.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(this.title)) {
            this.scene.stop("level");
            this.scene.stop("timer")
            this.scene.start("title");
            this.scene.stop();
        }
    }
}