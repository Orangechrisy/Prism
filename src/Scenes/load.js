class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.spritesheet("tilemap_sprites", "monochrome_tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        // Load tilemap information
        this.load.image("main_tiles", "monochrome_tilemap_packed.png");
        this.load.tilemapTiledJSON("coloredLevel", "coloredLevel.tmj");   // Tilemap in JSON
        this.load.image("background", "background.png");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 261, end: 263 })
        });

        this.anims.create({
            key: 'idle',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 260, end: 260 })
        });

        this.anims.create({
            key: 'jump',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 264, end: 264 })
        });

        // enemy animations
        this.anims.create({
            key: 'enemyWalk',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 341, end: 342 })
        });

        this.anims.create({
            key: 'enemySleep',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 344, end: 344 })
        });

         // ...and pass to the next Scene
        this.scene.start("level1");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}