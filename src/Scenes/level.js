class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 700;
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 700;
        this.JUMP_VELOCITY = -500;
        this.MAX_SPEED = 175;

        this.colorCooldown = 15;
        this.colorCooldownMax = 15;
        this.greenFlag = true;
        this.blueFlag = false;
        this.orangeFlag = false;
        this.pinkFlag = false;
        this.pauseScene = false;
    }

    create() {
        // Create a new tilemap game object which uses 16x16 pixel tiles
        this.map = this.add.tilemap("coloredLevel", 16, 16, 140, 60);
        this.physics.world.setBounds(0, 0, 2240, 960); // cause fuck the camera

        // Adding Tilesets
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tilemap_main = this.map.addTilesetImage("monochrome_tilemap_packed", "main_tiles");

        // Create layers
        this.ground = this.map.createLayer("ground", this.tilemap_main, 0, 0);
        this.blue = this.map.createLayer("ground-blue", this.tilemap_main, 0, 0);
        this.orange = this.map.createLayer("ground-orange", this.tilemap_main, 0, 0);
        this.pink = this.map.createLayer("ground-pink", this.tilemap_main, 0, 0);

        // Set initial visibility
        this.blue.setAlpha(0);
        this.orange.setAlpha(0);
        this.pink.setAlpha(0);

        // changing colors (maybe put in functions outside and just call those functions here)
        this.input.keyboard.on('keydown-ONE', () => {
            if (this.colorCooldown <= 0 && !this.greenFlag) {
                this.colorCooldown = this.colorCooldownMax;
                this.greenFlag = true;
                this.blueFlag = this.orangeFlag = this.pinkFlag = false;
                console.log("change color to green/nothing");
                
                // do animation
                this.tweens.add({
                    targets: this.cam,
                    duration: 50,
                    zoom: 2.2,
                    yoyo: true,
                    onStart: () => {
                        this.pauseScene = true;
                        this.physics.pause();
                    },
                    onUpdate: (tween) => {
                        if (tween.progress > 0.5 && !this.cam.bgColorChanged) {
                            this.cam.setBackgroundColor('rgba(221, 226, 201, 0.7)');
                            this.blue.setAlpha(0);
                            this.orange.setAlpha(0);
                            this.pink.setAlpha(0);
                            this.cam.bgColorChanged = true;
                        }
                    },
                    onComplete: () => {
                        this.scene.resume("level1");
                        this.cam.bgColorChanged = false;
                        this.pauseScene = false;
                        this.physics.resume();
                    }
                });
                // set collisions
            }
        }, this);

        this.input.keyboard.on('keydown-TWO', () => {
            if (this.colorCooldown <= 0 && this.blueFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                this.blueFlag = true;
                this.greenFlag = this.orangeFlag = this.pinkFlag = false;
                console.log("change color to blue");
                this.cam.setBackgroundColor('rgba(66, 69, 153, 0.7)');
                this.blue.setAlpha(1);
                this.orange.setAlpha(0);
                this.pink.setAlpha(0);
                // do animation
                // set collisions
            }
        }, this);

        this.input.keyboard.on('keydown-THREE', () => {
            if (this.colorCooldown <= 0 && this.orangeFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                this.orangeFlag = true;
                this.blueFlag = this.greenFlag = this.pinkFlag = false;
                console.log("change color to orange");
                this.cam.setBackgroundColor('rgba(242, 137, 103, 0.8)');
                this.blue.setAlpha(0);
                this.orange.setAlpha(1);
                this.pink.setAlpha(0);
                // do animation
                // set collisions
            }
        }, this);

        this.input.keyboard.on('keydown-FOUR', () => {
            if (this.colorCooldown <= 0 && this.pinkFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                this.pinkFlag = true;
                this.blueFlag = this.orangeFlag = this.greenFlag = false;
                console.log("change color to pink");
                this.cam.setBackgroundColor('rgba(137, 21, 98, 0.7)');
                this.blue.setAlpha(0);
                this.orange.setAlpha(0);
                this.pink.setAlpha(1);
                // do animation
                // set collisions
            }
        }, this);

        // Set up player avatar
        my.sprite.player = this.physics.add.sprite(50, 50, "characters", 260); // 70, 1100
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(this.MAX_SPEED, 1000);

        // Enable collision handling
        this.ground.forEachTile(tile => {
            if (tile.properties["ground"]) {
                tile.setCollision(true, true, true, true);
            }
        });
        this.physics.add.collider(my.sprite.player, this.ground);

        // camera stuff
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cam.setViewport(0, 0, 1000, 600);
        this.cameras.main.setZoom(2);
        this.cam.startFollow(my.sprite.player, true, .25, .25);
        this.cam.setBackgroundColor('rgba(221, 226, 201, 0.7)');
        console.log("tinting");
        this.cam.bgColorChanged = false;

        cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
        if (!this.pauseScene) {
            this.colorCooldown -= 1;

            if(cursors.left.isDown) {
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
                
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);

            } else if(cursors.right.isDown) {
                my.sprite.player.body.setAccelerationX(this.ACCELERATION);

                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);

            } else {
                my.sprite.player.body.setAccelerationX(0);
                my.sprite.player.body.setDragX(this.DRAG);

                my.sprite.player.anims.play('idle');
            }
        }
    }
}