class Credits extends Phaser.Scene {
    constructor() {
        super("endCredits");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.image("credits", "credits.png");
    }
    create() {
        this.add.image(500, 300, "credits");

        this.restart = this.input.keyboard.addKey("R");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.start("title");
        }
    }
}