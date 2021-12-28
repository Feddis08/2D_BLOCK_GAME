class ConnectPacket {
    server_info = "";
    server_max_player = 0;
    server_title = "";
    server_name = "";
    connect_allowed = false;
    constructor(server_info, server_max_player, server_name, server_title, connect_allowed) {
        this.server_info = server_info;
        this.server_max_player = server_max_player;
        this.connect_allowed = connect_allowed;
        this.server_name = server_name;
        this.server_title = server_title;
    }
}
module.exports = ConnectPacket;