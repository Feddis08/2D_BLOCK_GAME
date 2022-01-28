console.log("hello")
var grid;
var UUID;
moveByKeyCode = (key) => {
    if (key == "ArrowRight") grid.xPos++;
}
function loadPage(href) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}
let Server = {
    grid: null,
    socket: "",
    serverAddress: "",
    grid: null,
    block_scale: null,
    go_to_disc_page: true,
    initServer() {

    },
    connectServer() {
        this.serverAddress = document.querySelector("#serverAddress").value;
        this.socket = io.connect(this.serverAddress, { autoConnect: false });
        this.socket.open();
        document.body.innerHTML = loadPage("MultiPlayer/cannot_connect.html");
        this.socket.on("startUp", (dataPacket) => {
            this.startUp(dataPacket);
        })
        this.socket.on("join", (dataPacket) => {
            if (dataPacket.join_allowed) {
                console.log("join allowed! Setting up...");
                console.log(dataPacket.player);
                let render_distance = document.querySelector("#render_distance").value
                this.block_scale = document.querySelector("#block_scale").value
                let packet = new SettingsPacket(render_distance);
                this.socket.emit("settings_request", packet);
            }
        })
        this.socket.on("settings_response", (dataPacket) => {
            if (dataPacket.allowed) {
                this.socket.emit("setup_accepted", true);
                this.startGame(dataPacket)
            } else {
                console.log(dataPacket)
                this.go_to_disc_page = false;
                this.socket.close();
                document.body.innerHTML = loadPage("MultiPlayer/settings_error.html");
            }
        })
        this.socket.on("view_update", (dataPacket) => {
            //console.log(dataPacket)
            this.grid.chunks = dataPacket.viewport;
            this.grid.update();
        })
        this.socket.on("self_entity_update", (dataPacket) => {
            //dataPacket = player
            console.log(dataPacket.player)
            let entities = [];
            entities.push(dataPacket.player)
            display_remove_all_entities();
            display_entities(entities);
            GameLoop.player = dataPacket.player;
        })
        this.socket.on("disconnect", () => {
            this.socket.close();
            if (this.go_to_disc_page) document.body.innerHTML = loadPage("MultiPlayer/cannot_connect.html"); document.body.style = "background-color: red";
        })
    },
    startGame(dataPacket) {
        document.body.innerHTML = loadPage("MultiPlayer/game.html");
        let name_tag = document.querySelector("#name_tag");
        let domNodeGrid = document.querySelector("#Grid");
        domNodeGrid.style.height = (this.block_scale * 8) * dataPacket.player.viewRange;
        domNodeGrid.style.width = (this.block_scale * 8) * dataPacket.player.viewRange;
        name_tag.innerHTML = "Your name: " + dataPacket.player.name;
        blockSize(this.block_scale);
        this.grid = new Grid(0, 0, 0, dataPacket.player.viewRange, false);
        setInterval(() => {
            GameLoop.loop();
        }, 1);

    },
    startUp(dataPacket) {
        console.log(dataPacket);

        if (dataPacket.connect_allowed) {
            document.body.innerHTML = loadPage("MultiPlayer/loggin.html");
            const html_server_info = document.querySelector("#server_info");
            const html_server_name = document.querySelector("#server_name");
            const html_server_max_player = document.querySelector("#server_max_player");
            const html_server_title = document.querySelector("#server_title");
            html_server_info.innerHTML = `Info: ${dataPacket.server_info}`;
            html_server_name.innerHTML = `Name: ${dataPacket.server_name}`;
            html_server_max_player.innerHTML = `MAX_PLAYER: ${dataPacket.server_max_player}`;
            html_server_title.innerHTML = `Title: ${dataPacket.server_title}`;

        }
    },
    joinServer() {
        let name = document.querySelector("#player_name").value;
        console.log(name)
        let packet = new JoinPacket(name);
        Server.socket.emit("join", packet)
    }
}
startMP = () => {
    Server.go_to_disc_page = true;
    document.body.innerHTML = loadPage("MultiPlayer/connect.html");
    let server_address = document.querySelector("#serverAddress")
    server_address.value = location.hostname + ":" + location.port;
}
visit_me = () => {
    location.href = "https://github.com/Feddis08";
}




startSP = () => {
    document.body.innerHTML = loadPage("SinglePlayer/SinglePlayer.html");
    grid = new Grid(5, 5, 128, 32, true);
    grid.update();
}
goHome = () => {
    Server.go_to_disc_page = false;
    document.body.innerHTML = loadPage("index.html");
    Server.socket.close();
    Server.go_to_disc_page = true;
}