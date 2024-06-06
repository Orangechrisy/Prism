class Title extends Phaser.Scene {
    constructor() {
        super("title");
    }
    preload() {
    }
    create() {
        this.blueUnlockText = this.add.text(500, 300, "title!", {
            fontFamily: 'Arial Black', align: "center"
        }).setOrigin(0.5).setFontSize(16).setScrollFactor(0, 0);

        this.start = this.input.keyboard.addKey("S");
    }
    update() {
        //if (Phaser.Scenes.SceneManager.getScene("loadScene")) {
        //    console.log("already loaded");
        //}
        if (Phaser.Input.Keyboard.JustDown(this.start)) {
            this.scene.start("loadScene");
        }
    }
}