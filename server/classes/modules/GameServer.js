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
    tickSpeed = 1;
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
            if (player.setup_accepted) {
                let player_dataPackets = player.tick();
                player_dataPackets.forEach((player_dataPacket, index) => {
                    if (player_dataPacket.in_same_chunk) {
                        this.send_data_to_all_players_in_the_same_chunk(player, player_dataPacket.emit, player_dataPacket);
                    }
                    if (player_dataPacket.privat_message) {

                    }
                    if (player_dataPacket.broadcast) {

                    }
                })
                player.updates = [];
                if (player.coords_changed_by_move) {
                    player.coords_changed_by_move = false;
                    this.send_data_to_all_players_in_the_same_chunk(player, "entity_move_update", { player: player.filter_and_get_public_data() });
                }
                if (player.viewChange) {
                    this.remove_player_from_loaded_chunk_by_UUID(player.UUID)
                    this.add_loaded_chunks_by_player(player);
                    this.io.to(player.socketId).emit("view_update", { viewport: player.chunks_to_see });
                    this.io.to(player.socketId).emit("self_entity_update", { player })
                    player.viewChange = false;
                }
                if (player.entityViewChange) {
                    player.entityViewChange = false;
                    let entities = [];
                    player.entities_to_see.forEach((UUID, index) => {
                        entities.push(this.getEntityByUUID(UUID).filter_and_get_public_data());
                    })
                    this.io.to(player.socketId).emit("entities_view_update", entities);
                }
            }
        })
    };
    send_data_to_all_players_in_the_same_chunk(player, emit, data) {
        let chunkData = Data.world.getChunkByBlock(player.x, player.y);
        chunkData.chunk.entitiesUUIDs.forEach((UUID, index) => {
            let other_player = this.getEntityByUUID(UUID);
            this.io.to(other_player.socketId).emit(emit, data);
        })
    }
    playerChat(text, socketId) {
        let player = this.getPLayerBySocketId(socketId);
        let message = "[" + player.name + "]: " + text;
        console.log("[PlayerChat]: " + message);
        this.entities.forEach((player, index) => {
            if (player.isPlayer) {
                this.io.to(player.socketId).emit("playerChat", { message });
            }
        })
    }
    remove_player_from_loaded_chunk_by_UUID(UUID) {
        this.loadedChunks.forEach((chunk, index) => {
            chunk.chunk.entitiesUUIDs.forEach((chunkUUID, index) => {
                if (chunkUUID == UUID) {
                    chunk.chunk.entitiesUUIDs.splice(index, 1)
                }
            })
        })

    }
    remove_players_from_all_loaded_chunks() {
        this.loadedChunks.forEach((chunk, index) => {
            chunk.chunk.entitiesUUIDs.forEach((entityUUID, index) => {
                if (this.getEntityByUUID(entityUUID).isPlayer) {
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
    getEntityByUUID(UUID) {
        let result = false;
        this.entities.forEach((entity, index) => {
            if (entity.UUID == UUID) {
                result = entity;
            }
        })
        return result;
    }
    getPLayerBySocketId(socketId) {
        let result = false;
        this.entities.forEach((entity, index) => {
            if (entity.socketId == socketId) {
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
                    this.io.emit("infoChat", { message: "[Server]: " + player.name + " joined the server!" });
                }
            }
        })
    }
    removePLayerBySocketId(socketId) {
        this.players.forEach((player, index) => {
            if (player.socketId == socketId) {
                console.log("[Server:] player disconnected: " + player.name);
                this.io.emit("infoChat", { message: "[Server]: " + player.name + " disconnected from the server!" });
                this.players.splice(index, 1)
                this.remove_player_from_loaded_chunk_by_UUID(player.UUID);
                this.io.emit("player_disconnected", player.UUID);
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
                player.set_watch_direction(dataPacket.move);
                player.move = dataPacket.move;
            }
        })
    }


}
module.exports = GameServer;