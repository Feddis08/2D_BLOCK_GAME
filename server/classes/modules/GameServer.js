const Player = require("../Entities/Player.js");
const World = require("./World.js");
const Data = require("./Data.js");
const e = require("cors");
class GameServer {
    entities = [];
    players = [];
    loadedChunks = [];
    io;
    //tickspeed in ms
    tickSpeed = 10;
    constructor(io, name, dim) {
        this.start(name, dim);
        this.io = io;
        setInterval(() => {
            this.gameLoop();
        }, this.tickSpeed);
    }
    start(name, dim) {
        Data.world = new World(name, dim);
    };
    gameLoop() {
        this.players.forEach((player, index) => {
            this.remove_players_from_all_loaded_chunks();
            this.loadedChunks = [];
            if (player.setup_accepted) {
                this.add_loaded_chunks_by_player(player);
                player.tick();

                if (player.viewChange) {
                    this.io.to(player.socketId).emit("view_update", { viewport: player.chunks_to_see });
                    player.viewChange = false;
                }
            }
        })
    };
    remove_players_from_all_loaded_chunks() {
        this.loadedChunks.forEach((chunk, index) => {
            chunk.chunk.entitiesUUIDs.forEach((entityUUID, index) => {
                if (this.getPlayerByUUID(entityUUID).isPlayer) {
                    chunk.chunk.entitiesUUIDs.splice(index, 1)
                }
            })
        })

    }
    add_loaded_chunks_by_player(player) {
        let chunk = Data.world.getChunkByBlock(player.x, player.y)
        if (chunk == false) {
            return false;
        } else {
            chunk.chunk.entitiesUUIDs.push(player.UUID);
            [...Array(player.viewRange)].forEach((_, row) => {
                [...Array(player.viewRange)].forEach((_, column) => {
                    let chunk = Data.world.getChunkByBlock((player.x + row), (player.y + column));
                    if (chunk == false) { } else {
                        this.loadedChunks.push(chunk);
                    }
                })

            })
        }
    };
    getPlayerByUUID(UUID) {
        let result = false;
        this.entities.forEach((entity, index) => {
            if (entity.UUID == UUID) {
                result = entity;
            }
        })
        return result;
    }
    addPlayer(player_name, socketId) {
        let player = new Player(player_name, socketId);
        this.entities.push(player);
        Data.world.entities.push(player);
        this.players.push(player);
        this.io.to(player.socketId).emit("join", { join_allowed: true, player: player });
        console.log("[Server]: player joined:", player_name);
    }
    changeSettings(dataPacket, socketId) {
        let allowed = true;
        let playeR;
        this.players.forEach((player, index) => {
            playeR = player;
            if (player.socketId == socketId) {
                if (dataPacket.render_distance <= 32 || dataPacket.render_distance >= 0) {
                    player.viewRange = parseInt(dataPacket.render_distance);
                } else {
                    allowed = false
                }
            }
        })
        if (allowed) {
            this.io.to(socketId).emit("settings_response", { allowed: true, player: playeR })
            playeR.setup_finished = true;
        } else {
            this.removePLayerBySocketId(socketId);
            this.io.to(socketId).emit("settings_response", { allowed: false })
        }
    }
    setup_accepted(dataPacket, socketId) {
        this.players.forEach((player, index) => {
            if (player.socketId == socketId) {
                if (player.setup_finished) {
                    if (dataPacket) player.setup_accepted = true;
                }
            }
        })
    }
    removePLayerBySocketId(socketId) {

        this.players.forEach((player, index) => {
            if (player.socketId == socketId) {
                console.log("[Server:] player disconnected: " + player.name);
                this.players.splice(index, 1)
            }
        })
        this.entities.forEach((player, index) => {
            if (player.socketId == socketId) {
                this.players.splice(index, 1)
            }
        })
        Data.world.entities.forEach((player, index) => {
            if (player.socketId == socketId) {
                this.players.splice(index, 1)
            }
        })
    }
    player_move_set(dataPacket, socketId) {
        this.players.forEach((player, index) => {
            if (player.socketId == socketId) {
                player.move = dataPacket.move;
            }
        })
    }


}
module.exports = GameServer;