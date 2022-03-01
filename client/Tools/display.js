display_entities = (entities) => {
    entities.forEach((entity, index) => {
        let info = document.querySelector("#info");
        info.innerHTML = `coords: x${entity.x}-y${entity.y}`
        let coords = getChunkByBlock(entity.x, entity.y);
        let player = Server.grid.scene.getObjectByName(entity.UUID);
        Server.grid.scene.remove(player);
        player = Server.grid.createPlayer(entity.UUID);
        Server.grid.scene.add(player);
        player.position.x = coords.x;
        player.position.y = 1;
        player.position.z = coords.y;
        if (entity.socketId == Server.socket.id) {
            Server.grid.camera.position.x = coords.x;
            Server.grid.camera.position.y = 1;
            Server.grid.camera.position.z = coords.y;
        }
        if (entity.watch_direction == "back") {
            player.rotation.y = Math.PI;
            if (entity.socketId == Server.socket.id) {
                Server.grid.camera.rotation.y = 0;
            }
        }
        if (entity.watch_direction == "right") {
            player.rotation.y = Math.PI / 2;
            if (entity.socketId == Server.socket.id) {
                Server.grid.camera.rotation.y = (Math.PI * 2) - (Math.PI / 2);
            }
        }
        if (entity.watch_direction == "left") {
            player.rotation.y = (2 * Math.PI) - (Math.PI / 2);
            if (entity.socketId == Server.socket.id) {
                Server.grid.camera.rotation.y = Math.PI / 2;
            }
        }
        if (entity.watch_direction == "front") {
            player.rotation.y = 0;
            if (entity.socketId == Server.socket.id) {
                Server.grid.camera.rotation.y = Math.PI;
            }
        }
    })
}
getChunkByBlock = (want_x, want_y) => {
    let c_x = Math.trunc(want_x / 8);
    let c_y = Math.trunc(want_y / 8);
    let x = want_x % 8;
    let y = want_y % 8;
    return { c_x, c_y, x, y };
}
display_remove_entity = (UUID) => {
    let entity = Server.grid.scene.getObjectByName(UUID);
    if (entity == null) {
        return false;
    } else {
        Server.grid.scene.remove(entity);
    }
}
display_remove_all_entities = () => {
    let entities = Server.grid.chunks[0][0].entitiesUUIDs;
    entities.forEach((entityUUID, index) => {
        let entity3 = Server.grid.scene.getObjectByName(entityUUID);
        Server.grid.scene.remove(entity3);
    })
}