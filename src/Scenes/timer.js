class Timer extends Phaser.Scene {
    constructor() {
        super("timer");
    }
    init (timer)
    {
        this.timer = timer.time;
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.timerString = "0"
        this.timerText = this.add.bitmapText(20, 10, "publicPixel", `${this.timerString}`, 16).setOrigin(0);
    }
    update(time) {
        this.timerString = this.formatTime(time - this.timer);
        this.timerText.setText(`${this.timerString}`)
    }

    // thank you friendo jyh <3
    formatTime(milliseconds) {
        let minutes = Math.floor(milliseconds / 60000);
        let seconds = Math.floor((milliseconds % 60000) / 1000);
        let millis = milliseconds % 1000;
    
        // Add leading zeros if necessary
        let formattedMinutes = minutes.toString().padStart(2, '0');
        let formattedSeconds = seconds.toString().padStart(2, '0');
        let formattedMillis = millis.toString().padStart(3, '0');
    
        return `${formattedMinutes}:${formattedSeconds}:${formattedMillis}`;
    }
}