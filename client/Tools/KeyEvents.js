let old_key;
document.addEventListener("keydown", (evt) => {
    if (evt.code !== old_key) {
        old_key = evt.code;
        switch (evt.code) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowRight":
            case "ArrowLeft":
                let packet = new MovePacket(evt.code);
                Server.socket.emit("move_request", packet);
                GameLoop.move = true;
        }
    }
})
document.addEventListener("keyup", (evt) => {
    switch (evt.code) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowRight":
        case "ArrowLeft":
            old_key = "idle";
            let packet = new MovePacket("idle");
            Server.socket.emit("move_request", packet);
    }
})