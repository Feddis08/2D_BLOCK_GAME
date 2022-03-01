let old_key;
document.addEventListener("keydown", (evt) => {
    let chatInput1 = document.querySelector("#chatInput1");
    let chatInput2 = document.querySelector("#chatInput2");
    if (evt.code == "Enter") {
        if (chatInput1 === document.activeElement) {
            if (chatInput1.value !== "") {
                Server.infoChat(chatInput1.value);
                chatInput1.value = "";
            }
        }
        if (chatInput2 === document.activeElement) {
            if (chatInput2.value !== "") {
                Server.playerChat(chatInput2.value);
                chatInput2.value = "";
            }
        }
    };
    switch (evt.code) {
        case "KeyA":
        case "KeyD":
            Server.socket.emit("watch_request", { watch_direction: evt.code });
    }
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