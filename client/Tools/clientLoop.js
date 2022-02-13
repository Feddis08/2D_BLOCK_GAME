
GameLoop = {
    player: {},
    move: false,
    stepIntervalCount: 0,
    updateCount: 0,
    loop() {
        this.checkStepInterval();
        this.autoScroll();
    },
    autoScroll() {
        let chatOutput1 = document.querySelector("#chatOutput1");
        chatOutput1.scrollTop = chatOutput1.scrollHeight;
        let chatOutput2 = document.querySelector("#chatOutput2");
        chatOutput2.scrollTop = chatOutput2.scrollHeight;
    },
    checkStepInterval() {
        if (this.move) this.stepIntervalCount = 0; this.move = false;
        if (this.stepIntervalCount < this.player.step_speed) {
            if (this.updateCount == 10) {
                this.stepIntervalCount = this.stepIntervalCount + 100;
                let stepInterval = document.querySelector("#stepInterval");
                stepInterval.innerHTML = `next step in ms: ${this.stepIntervalCount}/${this.player.step_speed}`;
                this.updateCount = 0;
            } else {
                this.updateCount = this.updateCount + 1;

            }
        }
    }

}