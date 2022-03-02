console.log("hello")
var grid;
var UUID;
var images = [
    "res/Blocks/grass_block/but.png",
    "res/Blocks/grass_block/side.png",
    "res/Blocks/grass_block/top.png",
    "res/Blocks/sand_block/side.png",
    "res/Blocks/stone_block/side.png",
    "res/Blocks/water_block/side.png",
    "res/Entities/Player/front.png",
    "res/Entities/Player/back.png",
    "res/Entities/Player/right.png",
    "res/Entities/Player/left.png",
];
var image_counter = 0;
update_loading_status_images = () => {
    let status_bar = document.querySelector("#loading_status");
    image_counter = image_counter + 1;
    status_bar.innerHTML = "Loading images: " + image_counter + "/" + images.length;
}
const preloadImage = src =>
    new Promise(r => {
        const image = new Image()
        image.onload = r
        image.onerror = r
        image.src = src
        update_loading_status_images();
    })

moveByKeyCode = (key) => {
    if (key == "ArrowRight") grid.xPos++;
}
function loadPage(href) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();

    return xmlhttp.responseText;
}
const loadPage2 = (href) => {
    return fetch(href)
        .then((response) => {
            return response.text();
        })

}
var Server = {
    entities: [],
    grid: null,
    socket: "",
    serverAddress: "",
    grid: null,
    block_scale: null,
    go_to_disc_page: true,
    initServer() {

    },
    infoChat(text) {
        this.socket.emit("infoChat", { text })
    },
    playerChat(text) {
        this.socket.emit("playerChat", { text })
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
            this.grid.drawGrid(true);
            display_remove_all_entities();
            this.grid.chunks = dataPacket.viewport;
            this.grid.drawGrid(false);
        })
        this.socket.on("self_player_update", (dataPacket) => {
            let entities = [];
            entities.push(dataPacket.player)
            display_remove_entity(dataPacket.player.UUID);
            display_entities(entities);
            GameLoop.player = dataPacket.player;
        })
        this.socket.on("entity_move_update", (dataPacket) => {
            let entities = [];
            entities.push(dataPacket.player)
            display_remove_entity(dataPacket.player.UUID);
            display_entities(entities);
        })
        this.socket.on("entities_view_update", (dataPacket) => {
            display_remove_all_entities();
            display_entities(dataPacket);
        })
        this.socket.on("playerChat", (dataPacket) => {
            console.log(dataPacket.message);
            let chatOutput2 = document.querySelector("#chatOutput2");
            console.log(chatOutput2);
            chatOutput2.innerHTML = chatOutput2.innerHTML + "<br>" + dataPacket.message;
            autoScroll();
        })
        this.socket.on("infoChat", (dataPacket) => {
            console.log(dataPacket.message);
            let chatOutput1 = document.querySelector("#chatOutput1");
            chatOutput1.innerHTML = chatOutput1.innerHTML + "<br>" + dataPacket.message;
            autoScroll();
        })
        this.socket.on("watch_direction", (dataPacket) => {
            display_remove_entity(dataPacket.player.UUID);
            display_entities([dataPacket.player]);
        })
        this.socket.on("disconnect", () => {
            this.socket.close();
            if (this.go_to_disc_page) document.body.innerHTML = loadPage("MultiPlayer/cannot_connect.html"); document.body.style = "background-color: red";
        })
        this.socket.on("player_disconnect", (player_UUID) => {
            display_remove_entity(player_UUID);
        })
    },
    startGame(dataPacket) {
        document.body.innerHTML = loadPage("MultiPlayer/game.html");
        let name_tag = document.querySelector("#name_tag");
        name_tag.innerHTML = "Your name: " + dataPacket.player.name;
        blockSize(this.block_scale);
        this.grid = new Grid(0, 0, 0, dataPacket.player.viewRange, false);
        setInterval(() => {
            GameLoop.loop();
        }, 1);

    },
    sleep(ms = 2000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    , startUp(dataPacket) {
        console.log(dataPacket);

        if (dataPacket.connect_allowed) {
            loadPage2("MultiPlayer/loggin.html").then(res => {
                document.body.innerHTML = res;
            })
                .then(
                    () => {
                        Promise.all(images.map(x => preloadImage(x))).then(
                            (x) => {
                                let status_bar = document.querySelector("#loading_status");
                                status_bar.innerHTML = "Loading images finished!"
                            }
                        );
                        const html_server_info = document.querySelector("#server_info");
                        const html_server_name = document.querySelector("#server_name");
                        const html_server_max_player = document.querySelector("#server_max_player");
                        const html_server_title = document.querySelector("#server_title");
                        html_server_info.innerHTML = `Info: ${dataPacket.server_info}`;
                        html_server_name.innerHTML = `Name: ${dataPacket.server_name}`;
                        html_server_max_player.innerHTML = `MAX_PLAYER: ${dataPacket.server_max_player}`;
                        html_server_title.innerHTML = `Title: ${dataPacket.server_title}`;

                    }
                )

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
autoScroll = () => {
    let chatOutput1 = document.querySelector("#chatOutput1");
    chatOutput1.scrollTop = chatOutput1.scrollHeight;
    let chatOutput2 = document.querySelector("#chatOutput2");
    chatOutput2.scrollTop = chatOutput2.scrollHeight;
}