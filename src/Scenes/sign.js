class Sign extends Phaser.Scene {
    constructor() {
        super("sign");
    }
    init (sign)
    {
        console.log("init");
        this.signNumber = Number(sign);
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.add.image(500, 300, "signShade");
        console.log(this.signNumber);
        switch(this.signNumber) {
            case 1:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "Have a colorful day!\n\n\n\nUse arrow keys for movement\nPress P to pause", 24, 1).setOrigin(0.5);
                break;
            case 2:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "I'm heavily judging the sign\n45 tiles to the right and 1 tile down", 24, 1).setOrigin(0.5);
                break;
            case 3:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "Those on top judge,\nthose on the ground fight\n\n-Khekano Proverb", 24, 1).setOrigin(0.5);
                break;
            case 4:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "*firely sounds*\nSure is lonely here...\n*firefly sounds*", 24, 1).setOrigin(0.5);
                break;
            case 5:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "Hey, go away!\nI'm trying to hide from the\nhorrors of the world here\n\n\nYou're not with them, are you?", 24, 1).setOrigin(0.5);
                break;
            case 6:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "For all the dark that's in this world,\nit's nice that there are\nstill pockets of nature.\n\n\nYet still the mechanical\nage continues...", 24, 1).setOrigin(0.5);
                break;
            case 7:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "A nice, out of the way place to stay,\ninset into a nice wall away from everyone\n\nOnly issue is the occasional\nyelling as someone falls", 24, 1).setOrigin(0.5);
                break;
            case 8:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "They say a less is more, but this\n doesn't feel like more space...", 24, 1).setOrigin(0.5);
                break;
            case 9:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "Good job getting all the way over here,\nloser\n\nYou wasted your time just for this", 24, 1).setOrigin(0.5);
                break;
            case 10:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "The fungi in these parts are predators\nLook away for one second\nand they'll move closer\nThey invade my nightmares\nThey're coming for me!\nPlEAsE hEL-", 24, 1).setOrigin(0.5);
                break;
            case 11:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "Congrats on making it here!\n\n\nGiant Hole Inc. is not responsible for\nany injuries sustained due to falling", 24, 1).setOrigin(0.5);
                break;
            case 12:
                this.signText2 = this.add.bitmapText(500, 250, "publicPixel",
                "I hear the way out of this\nplace is in a big pit!\n\nBut this is a very small pit...", 24, 1).setOrigin(0.5);
                break;
            case 13:
                this.signText = this.add.bitmapText(500, 250, "publicPixel",
                "It sure is loud in here", 24, 1).setOrigin(0.5);
                break;
            default:
                this.signText = this.add.bitmapText(500, 200, "publicPixel",
                "Oop sign broke :(", 24, 1).setOrigin(0.5);
        }

        this.resume = this.input.keyboard.addKey("E");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.resume)) {
            this.signText.destroy();
            this.scene.resume("level");
            this.scene.stop();
        }
    }
}