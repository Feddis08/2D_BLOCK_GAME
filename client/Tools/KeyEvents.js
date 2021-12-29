let old_key;
keyHandles = () => {
    document.addEventListener("keydown", (evt) => {
        if (evt.code !== old_key) {
            old_key = evt.code;
            switch (evt.code) {
                case "ArrowUp":
                case "ArrowDown":
                case "ArrowRight":
                case "ArrowLeft":
                    let packet = new MovePacket(evt.code);
                    console.log(packet)
                    Server.socket.emit("move_request", packet);
            }
        }
        document.addEventListener("keyup", (evt) => {
            switch (evt.code) {
                case "ArrowUp":
                case "ArrowDown":
                case "ArrowRight":
                case "ArrowLeft":
                    old_key = "idle";
                //let packet = new MovePacket("idle");
                //console.log(packet)
                //Server.socket.emit("move_request", packet);
            }
        })
    })
}
keyHandles();