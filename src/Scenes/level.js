class Level1 extends Phaser.Scene {
    constructor() {
        super("level");
    }

    init(timer) {
        // variables and settings
        this.ACCELERATION = 1000;
        this.DRAG = 2000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 800;
        this.JUMP_VELOCITY = -300;
        this.MAX_SPEED = 200;

        this.colorCooldown = 5;
        this.colorCooldownMax = 5;
        this.greenFlag = true;
        this.blueFlag = false;
        this.orangeFlag = false;
        this.pinkFlag = false;
        this.blueUnlock = false;
        this.orangeUnlock = false;
        this.pinkUnlock = false;
        this.currentColor = 1; // 1-4: green, blue, orange, pink

        this.colorGreen = Phaser.Display.Color.RGBStringToColor('rgba(220, 228, 204, 1)');
        this.colorBlue = Phaser.Display.Color.RGBStringToColor('rgba(66, 69, 153, 0.7)');
        this.colorOrange = Phaser.Display.Color.RGBStringToColor('rgba(242, 137, 103, 0.8)');
        this.colorPink = Phaser.Display.Color.RGBStringToColor('rgba(137, 21, 98, 0.7)');

        this.pauseScene = false;

        this.lastAlive = [80, 100];
        this.isDeadFlag = false;
        this.deathCounter = 0;

        this.signOverlapFlag = false;

        this.levelTimer = timer.time;
        this.levelTimer2 = timer.time;
    }

    preload() {
        // Load animated tiles
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
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
        this.background = this.map.createLayer("background", this.tilemap_main, 0, 0);
        this.ground = this.map.createLayer("ground", this.tilemap_main, 0, 0);
        //this.groundDeadly = this.map.createLayer("ground-deadly", this.tilemap_main, 0, 0);
        this.groundHiding = this.map.createLayer("ground-hiding", this.tilemap_main, 0, 0);
        this.groundDeadly = this.map.createLayer("ground-deadly-pit", this.tilemap_main, 0, 0);
        this.blue = this.map.createLayer("ground-blue", this.tilemap_main, 0, 0);
        this.blueDeadly = this.map.createLayer("ground-blue-deadly", this.tilemap_main, 0, 0);
        this.orange = this.map.createLayer("ground-orange", this.tilemap_main, 0, 0);
        this.orangeDeadly = this.map.createLayer("ground-orange-deadly", this.tilemap_main, 0, 0);
        this.pink = this.map.createLayer("ground-pink", this.tilemap_main, 0, 0);   
        this.pinkDeadly = this.map.createLayer("ground-pink-deadly", this.tilemap_main, 0, 0);
        this.deadZones = this.map.getObjectLayer("dead-zones");
        this.spikeZones = this.map.getObjectLayer("pit-spikes");
        // put layers into some arrays for later
        this.groundLayers = [this.ground, this.groundHiding, this.blue, this.orange, this.pink];
        this.collidingLayers = [this.ground, this.groundDeadly, this.groundHiding, this.blue, this.blueDeadly, this.orange, this.orangeDeadly, this.pink, this.pinkDeadly];
        this.colorLayers = [this.groundHiding, this.groundDeadly, this.blue, this.blueDeadly, this.orange, this.orangeDeadly, this.pink, this.pinkDeadly];
        // set their colors
        this.ground.setTint(this.colorGreen.color);
        this.groundDeadly.setTint(this.colorGreen.color);
        this.blue.setTint(this.colorBlue.color);
        this.blueDeadly.setTint(this.colorBlue.color);
        this.orange.setTint(this.colorOrange.color);
        this.orangeDeadly.setTint(this.colorOrange.color);
        this.pink.setTint(this.colorPink.color);
        this.pinkDeadly.setTint(this.colorPink.color);
        // turn off others to start
        this.blue.setAlpha(0);
        this.orange.setAlpha(0);
        this.pink.setAlpha(0);
        this.blueDeadly.setAlpha(0);
        this.orangeDeadly.setAlpha(0);
        this.pinkDeadly.setAlpha(0);
        // make the animated tiles on the map animated
        this.animatedTiles.init(this.map);


        // changing colors (maybe put in functions outside and just call those functions here)
        this.input.keyboard.on('keydown-ONE', () => { // GREEN
            if (this.colorCooldown <= 0 && !this.greenFlag) {
                this.colorCooldown = this.colorCooldownMax;
                //console.log("change color to green/nothing");
                
                // do animation
                this.tweens.add({
                    targets: this.cam,
                    duration: 100,
                    zoom: 2.2,
                    yoyo: true,
                    onStart: () => {
                        this.pauseScene = true;
                        this.inDeadZoneCheck(false);
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

        this.input.keyboard.on('keydown-TWO', () => { // BLUE
            if (this.blueUnlock && this.colorCooldown <= 0 && this.blueFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                //console.log("change color to blue");

                // do animation
                this.tweens.add({
                    targets: this.cam,
                    duration: 100,
                    zoom: 2.2,
                    yoyo: true,
                    onStart: () => {
                        this.pauseScene = true;
                        this.inDeadZoneCheck(true);
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

        this.input.keyboard.on('keydown-THREE', () => { // ORANGE
            if (this.orangeUnlock && this.colorCooldown <= 0 && this.orangeFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                //console.log("change color to orange");
                
                // do animation
                this.tweens.add({
                    targets: this.cam,
                    duration: 100,
                    zoom: 2.2,
                    yoyo: true,
                    onStart: () => {
                        this.pauseScene = true;
                        this.inDeadZoneCheck(false);
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

        this.input.keyboard.on('keydown-FOUR', () => { // PINK
            if (this.pinkUnlock && this.colorCooldown <= 0 && this.pinkFlag == false) {
                this.colorCooldown = this.colorCooldownMax;
                //console.log("change color to pink");

                // do animation
                this.tweens.add({
                    targets: this.cam,
                    duration: 100,
                    zoom: 2.2,
                    yoyo: true,
                    onStart: () => {
                        this.pauseScene = true;
                        this.inDeadZoneCheck(false);
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
        my.sprite.player = this.physics.add.sprite(840, 810, "tilemap_sprites", 260); // 80, 108 // 840 810
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(this.MAX_SPEED, 1000);
        my.sprite.player.setDepth(2);

        // Enable collision handling
        this.groundLayers.forEach(layer => {
            layer.forEachTile(tile => {
                if (tile.properties["ground"]) {
                    tile.setCollision(false, false, false, false);
                }
            });
        });
        this.ground.forEachTile(tile => {
            if (tile.properties["ground"]) {
                tile.setCollision(true, true, true, true);
            }
            if (tile.properties["platform"]) {
                tile.setCollision(false, false, true, false);
            }
        });
        this.groundHiding.forEachTile(tile => {
            if (tile.properties["ground"]) {
                tile.setCollision(true, true, true, true);
            }
            if (tile.properties["platform"]) {
                tile.setCollision(false, false, true, false);
            }
        });
        this.physics.add.collider(my.sprite.player, this.groundLayers);

        // camera stuff
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cam.setViewport(0, 0, 1000, 600);
        this.cam.setZoom(2);
        this.cam.startFollow(my.sprite.player, true, .25, .25);
        //this.cam.setBackgroundColor('rgba(221, 226, 201, 0.7)');
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
        this.unlockBlue[0].setTint(this.colorBlue.color);
        this.unlockOrange[0].setTint(this.colorOrange.color);
        this.unlockPink[0].setTint(this.colorPink.color);
        this.physics.world.enable(this.unlockBlue, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.unlockOrange, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.unlockPink, Phaser.Physics.Arcade.STATIC_BODY);
        let emitterBlue = this.add.particles(this.unlockBlue.x, this.unlockBlue.y, 'pixel', {
            tint: this.colorBlue.color,
            scale: { start: 3, end: 2},
            alpha: { start: 1, end: 0.5},
            speed: { start: 100, end: 20, random: true},
            lifespan: {min: 500, max: 750, random: true},
            emitting: false
        });
        let emitterOrange = this.add.particles(this.unlockOrange.x, this.unlockOrange.y, 'pixel', {
            tint: this.colorOrange.color,
            scale: { start: 3, end: 2},
            alpha: { start: 1, end: 0.5},
            speed: { start: 100, end: 20, random: true},
            lifespan: {min: 500, max: 750, random: true},
            emitting: false
        });
        let emitterPink = this.add.particles(this.unlockPink.x, this.unlockPink.y, 'pixel', {
            tint: this.colorPink.color,
            scale: { start: 3, end: 2},
            alpha: { start: 1, end: 0.5},
            speed: { start: 100, end: 20, random: true},
            lifespan: {min: 500, max: 750, random: true},
            emitting: false
        });
        this.physics.add.overlap(my.sprite.player, this.unlockBlue, (player, unlockBlue) => {
            emitterBlue.emitParticleAt(unlockBlue.x, unlockBlue.y, 50);

            unlockBlue.destroy();
            this.blueUnlock = true;
            this.blueUnlockText = this.add.bitmapText(camTextX, camTextY, "publicPixel",
            "Unlocked Blue, press 2 to swap\n(press 1 to go back to green)", 24, 1)
            .setOrigin(0.5).setFontSize(12).setScrollFactor(0, 0);
            this.time.addEvent({
                delay: 3000,
                callback: this.blueUnlockText.destroy,
                callbackScope: this.blueUnlockText
            });
            // sound effect?
            // this.drankEffects(this.DRANKS);
            // this.dranking.play();
        });
        this.physics.add.overlap(my.sprite.player, this.unlockOrange, (player, unlockOrange) => {
            emitterOrange.emitParticleAt(unlockOrange.x, unlockOrange.y, 50);
            unlockOrange.destroy();
            this.orangeUnlock = true;
            this.orangeUnlockText = this.add.bitmapText(camTextX, camTextY, "publicPixel",
            "Unlocked Orange, press 3 to swap", 24, 1)
            .setOrigin(0.5).setFontSize(12).setScrollFactor(0, 0);
            this.time.addEvent({
                delay: 2000,
                callback: this.orangeUnlockText.destroy,
                callbackScope: this.orangeUnlockText
            });
        });
        this.physics.add.overlap(my.sprite.player, this.unlockPink, (player, unlockPink) => {
            emitterPink.emitParticleAt(unlockPink.x, unlockPink.y, 50);
            unlockPink.destroy();
            this.pinkUnlock = true;
            this.pinkUnlockText = this.add.bitmapText(camTextX, camTextY, "publicPixel",
            "Unlocked Pink, press 4 to swap", 24, 1)
            .setOrigin(0.5).setFontSize(12).setScrollFactor(0, 0);
            this.time.addEvent({
                delay: 2000,
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
            // cause it needs to be passed in as an object for some reason
            this.scene.stop("timer");
            this.scene.start("endCredits", {deaths: this.deathCounter, time: this.levelTimer2});
        });

        // enemy collider
        this.groundEnemies = this.physics.add.group();
        this.physics.add.collider(this.groundEnemies, this.ground); // change for all layers
        this.physics.add.collider(my.sprite.player, this.groundEnemies, this.hitEnemy, null, this);
        this.createEnemies();
        
        // checkpoint
        this.checkpoints = this.map.createFromObjects("items", {
            name: "checkpoint",
            key: "tilemap_sprites",
            frame: 369
        });
        this.physics.world.enable(this.checkpoints, Phaser.Physics.Arcade.STATIC_BODY);
        this.colorYellow = Phaser.Display.Color.RGBStringToColor('rgba(255, 216, 0, 0.7)');
        this.physics.add.overlap(my.sprite.player, this.checkpoints, (obj1, obj2) => {
            this.lastAlive = [obj1.x, obj1.y];
            for (let checkpoint of this.checkpoints) { // turn off the anims for other checkpoints so the player knows which one is active
                if (checkpoint != obj2) {
                    checkpoint.anims.pause();
                }
            }
            obj2.anims.play('checkpoint', true);
        });
        this.checkpoints.forEach(checkpoint => {
            checkpoint.setTint(this.colorYellow.color);
        });

        // particles emitted on death
        this.emitterDeath = this.add.particles(0, 0, 'pixel', {
            tint: [this.colorGreen.color, this.colorBlue.color, this.colorOrange.color, this.colorPink.color],
            scale: { start: 3, end: 2},
            alpha: { start: 1, end: 0.5},
            speed: { start: 100, end: 20, random: true},
            lifespan: {min: 500, max: 750, random: true},
            emitting: false
        });

        // pause menu key
        this.pauseMenu = this.input.keyboard.addKey("P");

        // sign interaction
        this.signGroup = this.map.createFromObjects("signs", {
            key: "tilemap_sprites",
            frame: 77
        });
        this.physics.world.enable(this.signGroup, Phaser.Physics.Arcade.STATIC_BODY);
        this.currentSign = null;
        this.physics.add.overlap(my.sprite.player, this.signGroup, (player, sign) => {
            if (this.signOverlapFlag == false) {
                this.signOverlapFlag = true;
                this.signText = this.add.bitmapText(sign.x, sign.y + 24, "publicPixel", "Press E", 8, 1).setOrigin(0.5);
            }
            this.currentSign = sign;
        });
        this.input.keyboard.on('keydown-E', () => {
            if (this.currentSign) {
                this.scene.launch("sign", this.currentSign.name);
                this.scene.pause("level");
            }
        }, this);
        this.signGroup.forEach(sign => {
            sign.setTint(this.colorYellow.color);
        });

        this.scene.launch("timer", {time: this.levelTimer});

        // set all the things to base color as needed
        this.setColors(this.colorGreen.color);
    }

    update(time) {
        if (Phaser.Input.Keyboard.JustDown(this.pauseMenu)) {
            this.scene.launch("pause");
            this.scene.pause();
        }

        this.levelTimer2 = time - this.levelTimer;

        if (!this.pauseScene) {
            this.colorCooldown -= 1;

            let anyOverlap = false;
            this.signGroup.forEach (sign => {
                if (this.physics.overlap(my.sprite.player, sign)) {
                    anyOverlap = true;
                }
            });
            if (this.signText && !anyOverlap) {
                this.signOverlapFlag = false;
                this.currentSign = null;
                this.signText.destroy();
            }

            // movement
            if(cursors.left.isDown && !this.isDeadFlag) {
                my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
                
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);

            } else if(cursors.right.isDown && !this.isDeadFlag) {
                my.sprite.player.body.setAccelerationX(this.ACCELERATION);

                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);

            } else {
                my.sprite.player.body.setAccelerationX(0);
                my.sprite.player.body.setDragX(this.DRAG);

                my.sprite.player.anims.play('idle');
            }
            if(!my.sprite.player.body.blocked.down) {
                if (my.sprite.player.body.velocity.x == 0) {
                    my.sprite.player.anims.play('jumpUp');
                }
                else {
                    my.sprite.player.anims.play('jump');
                }
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && !this.isDeadFlag) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }
            if (cursors.down.isDown && my.sprite.player.body.blocked.down && !cursors.left.isDown && !cursors.right.isDown) {
                my.sprite.player.anims.play('sit', true);
            }

            // enemy movement
            for (let enemy of this.groundEnemies.getChildren()) {
                if (enemy.awake) {
                    //console.log(enemy.direction);
                    if ((Math.abs(my.sprite.player.x - enemy.x) > 220) || (Math.abs(my.sprite.player.y - enemy.y) > 150)) {
                        enemy.awake = false; // player too far go sleep
                        enemy.anims.stop();
                        if (enemy.variant == 1) {
                            enemy.anims.play('enemySleep1');
                        }
                        else if (enemy.variant == 2) {
                            enemy.anims.play('enemySleep2');
                        }
                        else if (enemy.variant == 3) {
                            enemy.anims.play('enemySleep3');
                        }
                        enemy.setVelocityX(0);
                    }
                    else {
                        if (this.enemyTurnAround(enemy)) {
                            enemy.direction = !enemy.direction;
                            this.enemySetVelocity(enemy);
                        }
                    }
                }
                else if ((Math.abs(my.sprite.player.x - enemy.x) < 220) && (Math.abs(my.sprite.player.y - enemy.y) < 150)) {
                    enemy.awake = true; // not awake and player nearby so wake up
                    if (enemy.variant == 1) {
                        enemy.anims.play('enemyWalk1');
                    }
                    else if (enemy.variant == 2) {
                        enemy.anims.play('enemyWalk2');
                    }
                    else if (enemy.variant == 3) {
                        enemy.anims.play('enemyWalk3');
                    }
                    this.enemySetVelocity(enemy);
                }
            }

            // run the update to check if hitting a spike
            this.spikePitRectangles();
        }
    }



    // change the color to green
    changeToGreen() {
        this.greenFlag = true;
        this.blueFlag = this.orangeFlag = this.pinkFlag = false;
        this.currentColor = 1;
        this.setColors(this.colorGreen.color);
        this.colorLayers.forEach(layer => {
            if (layer != this.groundHiding && /*layer != this.groundDeadly &&*/ layer != this.groundDeadly) {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/ || tile.properties["platform"]) {
                        tile.setCollision(false, false, false, false);
                    }
                });
                layer.setAlpha(0);
            }
            else {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/) {
                        tile.setCollision(true, true, true, true);
                    }
                    if (tile.properties["platform"]) {
                        tile.setCollision(false, false, true, false);
                    }
                });
                layer.setAlpha(1);
            }
        });
        this.cam.bgColorChanged = true;
        // trigger animation?
    }

    // change the color to blue
    changeToBlue() {
        this.blueFlag = true;
        this.greenFlag = this.orangeFlag = this.pinkFlag = false;
        this.currentColor = 2;
        this.setColors(this.colorBlue.color);
        this.colorLayers.forEach(layer => {
            if (layer != this.blue && layer != this.blueDeadly) {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/ || tile.properties["platform"]) {
                        tile.setCollision(false, false, false, false);
                    }
                });
                //console.log(layer);
                layer.setAlpha(0);
            }
            else {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/) {
                        tile.setCollision(true, true, true, true);
                    }
                    if (tile.properties["platform"]) {
                        tile.setCollision(false, false, true, false);
                    }
                });
                layer.setAlpha(1);
            }
        });
        this.cam.bgColorChanged = true;
    }

    // change the color to orange
    changeToOrange() {
        this.orangeFlag = true;
        this.blueFlag = this.greenFlag = this.pinkFlag = false;
        this.currentColor = 3;
        this.setColors(this.colorOrange.color);
        this.colorLayers.forEach(layer => {
            if (layer != this.orange && layer != this.orangeDeadly) {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/ || tile.properties["platform"]) {
                        tile.setCollision(false, false, false, false);
                    }
                });
                layer.setAlpha(0);
            }
            else {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/) {
                        tile.setCollision(true, true, true, true);
                    }
                    if (tile.properties["platform"]) {
                        tile.setCollision(false, false, true, false);
                    }
                });
                layer.setAlpha(1);
            }
        });
        this.cam.bgColorChanged = true;
    }

    // change the color to pink
    changeToPink() {
        this.pinkFlag = true;
        this.blueFlag = this.orangeFlag = this.greenFlag = false;
        this.currentColor = 4;
        this.setColors(this.colorPink.color);
        this.colorLayers.forEach(layer => {
            if (layer != this.pink && layer != this.pinkDeadly) {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/ || tile.properties["platform"]) {
                        tile.setCollision(false, false, false, false);
                    }
                });
                layer.setAlpha(0);
            }
            else {
                layer.forEachTile(tile => {
                    if (tile.properties["ground"] /*|| tile.properties["deadly"]*/) {
                        tile.setCollision(true, true, true, true);
                    }
                    if (tile.properties["platform"]) {
                        tile.setCollision(false, false, true, false);
                    }
                });
                layer.setAlpha(1);
            }
        });
        this.cam.bgColorChanged = true;
    }

    // sets all the things that need to be changed colored in each swap
    setColors(color) {
        my.sprite.player.setTint(color);
        this.groundEnemies.setTint(color);
        this.ground.setTint(color);
        //this.groundDeadly.setTint(color);
        this.endItem[0].setTint(color);
        this.background.setTint(color);
        this.groundHiding.setTint(color);
    }

    // the enemy AI so it turns around when it should
    enemyTurnAround(enemy) {
        let wallAhead = false;
        let groundAhead = false;
        //console.log(this.collidingLayers);
        this.collidingLayers.forEach(layer => {
            if (layer.alpha != 0) { 
                if (enemy.direction) { // going left
                    if (layer.getTileAtWorldXY((enemy.x - enemy.displayWidth/2 - 1), enemy.y)) {
                        wallAhead = true;
                        return false;
                    }
                    else if (layer.getTileAtWorldXY((enemy.x - enemy.displayWidth/2 - 1), (enemy.y + enemy.displayHeight/2 + 1))) {
                        groundAhead = true;
                    }
                }
                else { // going right
                    if (layer.getTileAtWorldXY((enemy.x + enemy.displayWidth/2 + 1), enemy.y)) {
                        wallAhead = true;
                        return false;
                    }
                    else if (layer.getTileAtWorldXY((enemy.x + enemy.displayWidth/2 + 1), (enemy.y + enemy.displayHeight/2 + 1))) {
                        groundAhead = true;
                    }
                }
            }
        });
        return (wallAhead || !groundAhead);
    }

    // player hit deadly tile
    hitObstacle(player, obstacle) {
        if (player.visible == true) {
            this.setDead(player);
        }
    }

    // player hit enemy
    hitEnemy(player, enemy) {
        if (player.visible == true) {
            this.setDead(player);
            this.enemySetVelocity(enemy);
        }
    }

    // set enemy velocity
    enemySetVelocity(enemy) {
        if (enemy.direction) {
            enemy.setVelocityX(-50);
        }
        else {
            enemy.setVelocityX(50);
        }
    }

    // do the dead stuff
    setDead(player) {
        player.setVelocity(0, 0);
        player.setAcceleration(0, 0);
        player.setVisible(0);
        this.physics.world.gravity.y = 0;
        this.cam.stopFollow();
        this.deathCounter += 1;
        this.isDeadFlag = true;
        this.emitterDeath.emitParticleAt(player.x, player.y, 75);
        this.time.addEvent({
            delay: 1000,
            callback: this.respawn,
            callbackScope: this
        });
    }

    // respawn the player once event finishes
    respawn() {
        my.sprite.player.setPosition(this.lastAlive[0], this.lastAlive[1]);
        my.sprite.player.setVisible(1);
        this.physics.world.gravity.y = 800;
        this.cam.startFollow(my.sprite.player, true, .25, .25);
        this.isDeadFlag = false;
    }

    // to check if the player is in a hidden area when the wall returns
    inDeadZoneCheck(boolZoneCheck) {
        let inDeadZone = false;
        this.deadZones.objects.forEach(rectangle => {
            const bounds = new Phaser.Geom.Rectangle(rectangle.x + 1, rectangle.y + 1, rectangle.width - 2, rectangle.height - 2);
            if (Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.player.getBounds(), bounds)) {
                if (rectangle.name == "deadZoneBlueCase" && !boolZoneCheck) {
                    inDeadZone = false;
                }
                else {
                    inDeadZone = true;
                }
            }
        });
        if (inDeadZone == true) {
            this.hitObstacle(my.sprite.player);
        }
    }

    // deadly spikes (and water) hitting
    spikePitRectangles() {
        let hitSpike = false;
        this.spikeZones.objects.forEach(rectangle => {
            const bounds = new Phaser.Geom.Rectangle(rectangle.x + 1, rectangle.y + 1, rectangle.width - 2, rectangle.height - 2);
            if (my.sprite.player.visible && Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.player.getBounds(), bounds)) {
                switch(this.currentColor) {
                    case 1: // green
                        //console.log("green spikes");
                        if (rectangle.name == "greenSpikes" || rectangle.name == "alwaysSpikes") {
                            hitSpike = true;
                        }
                        break;
                    case 2: // blue
                        //console.log("blue spikes");
                        //console.log(this.blueDeadly.visible);
                        if (rectangle.name == "blueSpikes" || rectangle.name == "alwaysSpikes") {
                            //console.log("hitspite true");
                            hitSpike = true;
                        }
                        break;
                    case 3: // orange
                        //console.log("orange spikes");
                        if (rectangle.name == "orangeSpikes" || rectangle.name == "alwaysSpikes") {
                            hitSpike = true;
                        }
                        break;
                    case 4: // pink
                        //console.log("pink spikes");
                        if (rectangle.name == "pinkSpikes" || rectangle.name == "alwaysSpikes") {
                            hitSpike = true;
                        }
                        break;
                }
            }
        });

        if (hitSpike == true) {
            this.hitObstacle(my.sprite.player);
        }
    }

    // create all the enemies
    createEnemies() {
        // direction left is true, right is false
        let enemy1 = this.groundEnemies.create(352, 184, "tilemap_sprites", 344);
        enemy1.direction = true; enemy1.awake = false; enemy1.variant = 2;
        let enemy2 = this.groundEnemies.create(592, 88, "tilemap_sprites", 364);
        enemy2.direction = true; enemy2.awake = false; enemy2.variant = 3;
        let enemy3 = this.groundEnemies.create(320, 712, "tilemap_sprites", 324);
        enemy3.direction = true; enemy3.awake = false; enemy3.variant = 1;
        let enemy4 = this.groundEnemies.create(336, 936, "tilemap_sprites", 324);
        enemy4.direction = false; enemy4.awake = false; enemy4.variant = 1;
        let enemy5 = this.groundEnemies.create(176, 472, "tilemap_sprites", 344);
        enemy5.direction = true; enemy5.awake = false; enemy5.variant = 2;
        let enemy6 = this.groundEnemies.create(1088, 136, "tilemap_sprites", 364);
        enemy6.direction = true; enemy6.awake = false; enemy6.variant = 3;
        let enemy7 = this.groundEnemies.create(976, 360, "tilemap_sprites", 364);
        enemy7.direction = false; enemy7.awake = false; enemy7.variant = 3;
        let enemy8 = this.groundEnemies.create(2096, 632, "tilemap_sprites", 344);
        enemy8.direction = false; enemy8.awake = false; enemy8.variant = 2;
        let enemy9 = this.groundEnemies.create(848, 920, "tilemap_sprites", 324);
        enemy9.direction = true; enemy9.awake = false; enemy9.variant = 1;
        let enemy10 = this.groundEnemies.create(2016, 536, "tilemap_sprites", 324);
        enemy10.direction = true; enemy10.awake = false; enemy10.variant = 1;
        let enemy11 = this.groundEnemies.create(1440, 392, "tilemap_sprites", 364);
        enemy11.direction = false; enemy11.awake = false; enemy11.variant = 3;
    }
}