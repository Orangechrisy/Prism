class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        //this.load.atlas("platformer_characters", "platformer_characters.png", "monochrome_tilemap_packed.json");

        // Load tilemap information
        this.load.image("main_tiles", "monochrome_tilemap_packed.png");
        this.load.image("colors", "colors_tilemap_packed.png");
        this.load.tilemapTiledJSON("coloredLevel", "coloredLevel.tmj");   // Tilemap in JSON
    }

    create() {
        /*
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 261,
                end: 263,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0260.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0264.png" }
            ],
        });
        */
         // ...and pass to the next Scene
         this.scene.start("level1");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}