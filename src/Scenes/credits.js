class Credits extends Phaser.Scene {
    constructor() {
        super("endCredits");
    }
    preload() {
    }
    create() {
        this.blueUnlockText = this.add.text(500, 300, "end!", {
            fontFamily: 'Arial Black', align: "center"
        }).setOrigin(0.5).setFontSize(16).setScrollFactor(0, 0);

        this.restart = this.input.keyboard.addKey("R");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.start("title");
        }
    }
}