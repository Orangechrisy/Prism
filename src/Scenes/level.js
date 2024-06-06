class Level1 extends Phaser.Scene {
    constructor() {
        super("level1");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 1000;
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 800;
        this.JUMP_VELOCITY = -300;
        this.MAX_SPEED = 200;

        this.colorCooldown = 15;
        this.colorCooldownMax = 15;
        this.greenFlag = true;
        this.blueFlag = false;
        this.orangeFlag = false;
        this.pinkFlag = false;
        this.blueUnlock = false;
        this.orangeUnlock = false;
        this.pinkUnlock = false;
        this.pauseScene = false;

        this.lastAlive = [50, 108];
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
        this.groundLayers = [this.ground, this.blue, this.orange, this.pink];

        // Set initial visibility
        this.blue.setAlpha(0);
        this.orange.setAlpha(0);
        this.pink.setAlpha(0);

        // changing colors (maybe put in functions outside and just call those functions here)
        this.input.keyboard.on('keydown-ONE', () => {
            if (this.colorCooldown <= 0 && !this.greenFlag) {
                this.colorCooldown = this.colorCooldownMax;
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
                            this.changeToGreen();
                        }
                    },
                    onComplete: () => {
                        this.scene.resume("level1");
                        this.cam.bgColorChanged = false;
                        this.pauseScene = false;
                        this.physics.resume();
                    }
                });
            }
        }, this);

        this.input.keyboard.on('keydown-TWO', () => {
            if (this.blueUnlock && this.colorCooldown <= 0 && this.blueFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                console.log("change color to blue");

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
                            this.changeToBlue();
                        }
                    },
                    onComplete: () => {
                        this.scene.resume("level1");
                        this.cam.bgColorChanged = false;
                        this.pauseScene = false;
                        this.physics.resume();
                    }
                });
            }
        }, this);

        this.input.keyboard.on('keydown-THREE', () => {
            if (this.orangeUnlock && this.colorCooldown <= 0 && this.orangeFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                console.log("change color to orange");
                
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
                            this.changeToOrange();
                        }
                    },
                    onComplete: () => {
                        this.scene.resume("level1");
                        this.cam.bgColorChanged = false;
                        this.pauseScene = false;
                        this.physics.resume();
                    }
                });
            }
        }, this);

        this.input.keyboard.on('keydown-FOUR', () => {
            if (this.pinkUnlock && this.colorCooldown <= 0 && this.pinkFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                console.log("change color to pink");

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
                            this.changeToPink();
                        }
                    },
                    onComplete: () => {
                        this.scene.resume("level1");
                        this.cam.bgColorChanged = false;
                        this.pauseScene = false;
                        this.physics.resume();
                    }
                });
            }
        }, this);

        // Set up player avatar
        my.sprite.player = this.physics.add.sprite(50, 108, "tilemap_sprites", 260);
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
        let camTextX = this.cam.worldView.x + this.cam.width / 2;
        let camTextY = this.cam.worldView.y + this.cam.height / 3;

        // movement keys
        cursors = this.input.keyboard.createCursorKeys();

        // color change items (cant seem to check properties so is like 3x as long as it needs to be)
        this.unlockBlue = this.map.createFromObjects("items", {
            name: "unlockBlue",
            key: "tilemap_sprites",
            frame: 22
        });
        this.unlockOrange = this.map.createFromObjects("items", {
            name: "unlockOrange",
            key: "tilemap_sprites",
            frame: 22
        });
        this.unlockPink = this.map.createFromObjects("items", {
            name: "unlockPink",
            key: "tilemap_sprites",
            frame: 22
        });
        this.physics.world.enable(this.unlockBlue, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.unlockOrange, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.unlockPink, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.add.overlap(my.sprite.player, this.unlockBlue, (obj1, obj2) => {
            obj2.destroy();
            this.blueUnlock = true;
            // get better font
            this.blueUnlockText = this.add.text(camTextX, camTextY, "Unlocked Blue, press 2 to swap\n(press 1 to go back to green)", {
                fontFamily: 'Arial Black', align: "center"
            }).setOrigin(0.5).setFontSize(12).setScrollFactor(0, 0);
            this.time.addEvent({
                delay: 1600,
                callback: this.blueUnlockText.destroy,
                callbackScope: this.blueUnlockText
            });
            // sound effect?
            // this.drankEffects(this.DRANKS);
            // this.dranking.play();
        });
        this.physics.add.overlap(my.sprite.player, this.unlockOrange, (obj1, obj2) => {
            obj2.destroy();
            this.orangeUnlock = true;
            this.orangeUnlockText = this.add.text(camTextX, camTextY, "Unlocked Orange, press 3 to swap", {
                fontFamily: 'Arial Black', align: "center"
            }).setOrigin(0.5).setFontSize(12).setScrollFactor(0, 0);
            this.time.addEvent({
                delay: 1200,
                callback: this.orangeUnlockText.destroy,
                callbackScope: this.orangeUnlockText
            });
        });
        this.physics.add.overlap(my.sprite.player, this.unlockPink, (obj1, obj2) => {
            obj2.destroy();
            this.pinkUnlock = true;
            this.pinkUnlockText = this.add.text(camTextX, camTextY, "Unlocked Pink, press 4 to swap", {
                fontFamily: 'Arial Black', align: "center"
            }).setOrigin(0.5).setFontSize(12).setScrollFactor(0, 0);
            this.time.addEvent({
                delay: 1200,
                callback: this.pinkUnlockText.destroy,
                callbackScope: this.pinkUnlockText
            });
        });

        // end goal
        this.endItem = this.map.createFromObjects("items", {
            name: "endGoal",
            key: "tilemap_sprites",
            frame: 59
        });
        this.physics.world.enable(this.endItem, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.add.overlap(my.sprite.player, this.endItem, (obj1, obj2) => {
            this.scene.start("endCredits");
        });

        // make group
        // collider platform
        // collider player
        // create enemies in group
        this.groundEnemies = this.physics.add.group();
        this.physics.add.collider(this.groundEnemies, this.ground); // change for all layers
        this.physics.add.collider(my.sprite.player, this.groundEnemies, this.hitEnemy, null, this);
        let enemy = this.groundEnemies.create(340, 190, "tilemap_sprites", 344); // put in separate function later to make all the enemies at once
        enemy.direction = true; // left is true, right is false
        enemy.awake = false;
        
        // checkpoint
        this.checkpoints = this.map.createFromObjects("items", {
            name: "checkpoint",
            key: "tilemap_sprites",
            frame: 369
        });
        this.physics.world.enable(this.checkpoints, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.add.overlap(my.sprite.player, this.checkpoints, (obj1, obj2) => {
            this.lastAlive = [obj1.x, obj1.y];
            console.log(this.lastAlive);
            // for (let checkpoint of this.checkpoints) {
            //     checkpoint.anims.pause();
            // }
            obj2.anims.play('checkpoint', true);
        });

    }
    update() {
        if (!this.pauseScene) {
            this.colorCooldown -= 1;

            // movement
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
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }

            // enemy movement
            // in update go through group, check if awake or not
            // if not check if player is close, if so wake up
            // if awake, if player is close then move forward
            // if ground edge reached, turn around
            // if player is far then sleep
            for (let enemy of this.groundEnemies.getChildren()) {
                if (enemy.awake) {
                    console.log(enemy.direction);
                    if ((Math.abs(my.sprite.player.x - enemy.x) > 400) || (Math.abs(my.sprite.player.y - enemy.y) > 150)) {
                        enemy.awake = false; // player too far go sleep
                        enemy.anims.stop(); // how to stop specific animation?
                        enemy.anims.play('enemySleep');
                        enemy.setVelocityX(0);
                    }
                    else {
                        if (this.enemyTurnAround(enemy)) {
                            enemy.direction = !enemy.direction;
                            this.enemySetVelocity(enemy);
                        }
                    }
                }
                else if ((Math.abs(my.sprite.player.x - enemy.x) < 400) && (Math.abs(my.sprite.player.y - enemy.y) < 150)) {
                    enemy.awake = true; // not awake and player nearby so wake up
                    enemy.anims.play('enemyWalk');
                    this.enemySetVelocity(enemy);
                }
            }
        }
    }

    changeToGreen() {
        this.greenFlag = true;
        this.blueFlag = this.orangeFlag = this.pinkFlag = false;
        this.cam.setBackgroundColor('rgba(221, 226, 201, 0.7)');
        this.blue.setAlpha(0);
        this.orange.setAlpha(0);
        this.pink.setAlpha(0);
        this.cam.bgColorChanged = true;
        // set collisions
    }

    changeToBlue() {
        this.blueFlag = true;
        this.greenFlag = this.orangeFlag = this.pinkFlag = false;
        this.cam.setBackgroundColor('rgba(66, 69, 153, 0.7)');
        this.blue.setAlpha(1);
        this.orange.setAlpha(0);
        this.pink.setAlpha(0);
        this.cam.bgColorChanged = true;
    }

    changeToOrange() {
        this.orangeFlag = true;
        this.blueFlag = this.greenFlag = this.pinkFlag = false;
        this.cam.setBackgroundColor('rgba(242, 137, 103, 0.8)');
        this.blue.setAlpha(0);
        this.orange.setAlpha(1);
        this.pink.setAlpha(0);
        this.cam.bgColorChanged = true;
    }

    changeToPink() {
        this.pinkFlag = true;
        this.blueFlag = this.orangeFlag = this.greenFlag = false;
        this.cam.setBackgroundColor('rgba(137, 21, 98, 0.7)');
        this.blue.setAlpha(0);
        this.orange.setAlpha(0);
        this.pink.setAlpha(1);
        this.cam.bgColorChanged = true;
    }

    enemyTurnAround(enemy) {
        let wallAhead = false;
        let groundAhead = false;
        this.groundLayers.forEach(layer => {
            if (layer.alpha != 0) { // possibly check tile properties somewhere?
                if (enemy.direction) {
                    if (layer.getTileAtWorldXY((enemy.x - enemy.displayWidth/2 - 1), enemy.y)) {
                        wallAhead = true;
                        return false;
                    }
                    else if (layer.getTileAtWorldXY((enemy.x - enemy.displayWidth/2), (enemy.y + enemy.displayHeight/2 + 1))) {
                        groundAhead = true;
                    }
                }
                else {
                    if (layer.getTileAtWorldXY((enemy.x + enemy.displayWidth/2 + 1), enemy.y)) {
                        wallAhead = true;
                        return false;
                    }
                    else if (layer.getTileAtWorldXY((enemy.x + enemy.displayWidth/2), (enemy.y + enemy.displayHeight/2 + 1))) {
                        groundAhead = true;
                    }
                }
            }
        });
        return (wallAhead || !groundAhead);
    }

    hitEnemy(player, enemy) {
        // game pause
        // do animation
        // respawn player
        console.log("RESPAWNING");
        player.setVelocity(0, 0);
        player.setPosition(this.lastAlive[0], this.lastAlive[1])
        this.enemySetVelocity(enemy);
        }

    enemySetVelocity(enemy) {
        if (enemy.direction) {
            enemy.setVelocityX(-50);
        }
        else {
            enemy.setVelocityX(50);
        }
    }
}