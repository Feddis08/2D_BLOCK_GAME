"use strict";
var express = require("express");
var app = express();
var port = 80;
var socket = require("socket.io");
const GameServer = require("./classes/modules/GameServer");
const ConnectPacket = require("./classes/modules/ConnectPacket");
var server = app.listen(port, function () {
    console.log("|WebServer: starting at port: " + port + " ...");
});
app.use(express.static("../client"));
var io = socket(server);
var gameServer = new GameServer(io, "New World", 16);
var server_info = "this is a dev server";
var server_max_player = 32;
var server_name = "test_name";
var server_title = "test_title";
var server_world_name = gameServer.name;

io.on("connection", (stream) => {
    let socketId = stream.id;
    console.log("[Socket Stream]:someone connected to the server:", socketId);
    let packet = new ConnectPacket(server_info, server_max_player, server_name, server_title, true);
    io.to(socketId).emit("startUp", packet);
    stream.on("join", (dataPacket) => {
        gameServer.addPlayer(dataPacket.player_name, socketId);
    })
    stream.on("move_request", (dataPacket) => {
        gameServer.player_move_set(dataPacket, socketId);
    })
    stream.on("settings_request", (dataPacket) => {
        gameServer.changeSettings(dataPacket, socketId);

    })
    stream.on("setup_accepted", (dataPacket) => {
        gameServer.setup_accepted(dataPacket, socketId);
    })
    stream.on("disconnect", (socket) => {
        gameServer.removePLayerBySocketId(socketId);
    })

})
