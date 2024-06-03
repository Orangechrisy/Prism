class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 700;
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -500;
        this.MAX_SPEED = 175;
    }

    create() {
        // Create a new tilemap game object which uses 16x16 pixel tiles
        this.map = this.add.tilemap("coloredLevel", 16, 16, 140, 60);
        this.physics.world.setBounds(0, 0, 3240, 1860); // cause fuck the camera

        // Adding Tilesets
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tilemap_main = this.map.addTilesetImage("monochrome_tilemap_packed", "main_tiles");
        this.tilemap_colors = this.map.addTilesetImage("colors_tilemap_packed", "colors");

        // Create layers
        this.white_background = this.map.createLayer("white-background", this.tilemap_main, 0, 0);
        this.blue_background = this.map.createLayer("blue-background", this.tilemap_colors, 0, 0);
        this.orange_background = this.map.createLayer("orange-background", this.tilemap_colors, 0, 0);
        this.pink_background = this.map.createLayer("pink-background", this.tilemap_colors, 0, 0);
        this.ground = this.map.createLayer("ground", this.tilemap_main, 0, 0);
        this.blue = this.map.createLayer("blue", this.tilemap_main, 0, 0);
        this.orange = this.map.createLayer("orange", this.tilemap_main, 0, 0);
        this.pink = this.map.createLayer("pink", this.tilemap_main, 0, 0);
        this.colorLayers = [this.white_background, this.blue_background, this.orange_background, this.pink_background];
        this.colorGroundLayers = [this.blue, this.orange, this.pink];
        this.allColorLayers = this.colorLayers.concat(this.colorGroundLayers);

        // Set initial visibility
        this.blue_background.setAlpha(0);
        this.blue.setAlpha(0);
        this.orange_background.setAlpha(0);
        this.orange.setAlpha(0);
        this.pink_background.setAlpha(0);
        this.pink.setAlpha(0);

        this.input.keyboard.on('keydown-1', () => {
            this.allColorLayers.forEach(layer => {
                layer.setAlpha(0)
            });
            this.allColorLayers.forEach(layer => {
                layer.setAlpha(0)
            });
            this.blue_background.setAlpha(1);
            this.blue.setAlpha(1);
            // set collisions
        }, this);

        this.input.keyboard.on('keydown-2', () => {
            this.allColorLayers.forEach(layer => {
                layer.setAlpha(0)
            });
            this.allColorLayers.forEach(layer => {
                layer.setAlpha(0)
            });
            this.orange_background.setAlpha(1);
            this.orange.setAlpha(1);
            // set collisions
        }, this);

        this.input.keyboard.on('keydown-3', () => {
            this.allColorLayers.forEach(layer => {
                layer.setAlpha(0)
            });
            this.allColorLayers.forEach(layer => {
                layer.setAlpha(0)
            });
            this.pink_background.setAlpha(1);
            this.pink.setAlpha(1);
            // set collisions
        }, this);

        // Set up player avatar
        // my.sprite.player = this.physics.add.sprite(78, 880, "platformer_characters", "tile_0006.png"); // 70, 1100
        // my.sprite.player.setCollideWorldBounds(true);
        // my.sprite.player.setMaxVelocity(this.MAX_SPEED, 1000);

        // Enable collision handling
        //this.physics.add.collider(my.sprite.player, this.groundLayer);
    }
    update() {

    }
}