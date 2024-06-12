class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    init(timer) {
        this.loadTimer = timer.time;
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

        // Load particle (single pixel lol)
        this.load.image("pixel", "1x1.png");
        this.load.image("pauseMenu", "pauseMenu.png");
        this.load.image("signShade", "shade.png");
    }

    create() {
        if (!this.anims.exists('walk')) {
            this.anims.create({
                key: 'walk',
                frameRate: 8,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 261, end: 263 })
            });

            this.anims.create({
                key: 'idle',
                repeat: -1,
                frames: [{key: 'tilemap_sprites', frame: 260}]
            });

            this.anims.create({
                key: 'jump',
                repeat: -1,
                frames: [{key: 'tilemap_sprites', frame: 264}]
            });
            this.anims.create({
                key: 'jumpUp',
                repeat: -1,
                frames: [{key: 'tilemap_sprites', frame: 265}]
            });

            this.anims.create({
                key: 'sit',
                repeat: -1,
                frames: [{key: 'tilemap_sprites', frame: 266}]
            });

            // enemy animations
            // enemy variant 1
            this.anims.create({
                key: 'enemyWalk1',
                frameRate: 8,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 321, end: 322 })
            });

            this.anims.create({
                key: 'enemySleep1',
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 324, end: 324 })
            });

            // enemy variant 2
            this.anims.create({
                key: 'enemyWalk2',
                frameRate: 8,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 341, end: 342 })
            });

            this.anims.create({
                key: 'enemySleep2',
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 344, end: 344 })
            });

            // enemy variant 3
            this.anims.create({
                key: 'enemyWalk3',
                frameRate: 8,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 361, end: 362 })
            });

            this.anims.create({
                key: 'enemySleep3',
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 364, end: 364 })
            });

            // checkpoint animation
            this.anims.create({
                key: 'checkpoint',
                frameRate: 8,
                repeat: -1,
                frames: this.anims.generateFrameNumbers('tilemap_sprites', { start: 369, end: 370 })
            });
        }

         // ...and pass to the next Scene
        this.scene.start("level", {time: this.loadTimer});
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}