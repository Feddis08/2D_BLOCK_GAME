const Entity = require("./Entity");
const Data = require("../modules/Data.js");
class Player extends Entity {
    socketId = "";
    setup_finished = false;
    setup_accepted = false;
    isPlayer = true;
    entityViewChange = false;
    viewRange = 1;
    chunks_to_see = [];
    chunks_string = "";
    entities_to_see = [];
    entities_string = "";
    viewChange = false;
    socketId = "";
    constructor(player_name, socketId) {
        super(player_name)
        this.socketId = socketId;
        this.isPlayer = true;
    }
    personalTick() {
        let entities = this.entities_UUID_string(this.chunks_to_see);
        this.entities_to_see = entities.s_entities;
        if (this.entities_string !== entities.result) {
            this.entityViewChange = true;
            this.entities_string = entities.result;
        }
    }
    chunks_to_string(chunks) {
        let s_chunks = [];
        chunks.forEach((row, index) => {
            let s_row = row.map(chunk => chunk.id).join("-");
            s_chunks.push(s_row);
        })
        let result;
        s_chunks.forEach((s, index) => {
            result = result + s;
        })
        return result;

    }
    entities_UUID_string(chunks) {
        let s_entities = [];
        chunks.forEach((row, index) => {
            row.forEach((chunk, index) => {
                chunk.entitiesUUIDs.forEach((UUID, index) => {
                    s_entities.push(UUID);
                })
            })
        })
        let result;
        s_entities.forEach((s, index) => {
            result = result + s;
        })
        return { s_entities, result };


    }
    checkViewport() {
        this.getViewport();
        let new_chunks = this.chunks_to_string(this.chunks_to_see);
        //console.log(new_blocks, this.block_string)
        if (new_chunks !== this.chunks_string) {
            this.chunks_string = this.chunks_to_string(this.chunks_to_see);
            this.viewChange = true;
        } else {
        }
    }
    calculateViewport() {
        let x = this.x - ((this.viewRange * 8) / 2);
        let y = this.y - ((this.viewRange * 8) / 2);
        let chunkData = Data.world.getChunkByBlock(x, y)
        if (chunkData == false) {
            return false;
        } else {
            let rowBegin = chunkData.c_x;
            let rowEnd = chunkData.c_x + this.viewRange;
            let columnBegin = chunkData.c_y;
            let columnEnd = chunkData.c_y + this.viewRange;
            return { rowBegin: rowBegin, rowEnd: rowEnd, columnBegin: columnBegin, columnEnd: columnEnd };
        }
    }
    getViewport() {
        let viewport = this.calculateViewport();
        if (viewport == false) {

        }
        else {
            let a_row = [];
            [...Array(this.viewRange)].forEach((_, row) => {
                let a_column = [];
                [...Array(this.viewRange)].forEach((_, column) => {
                    if (!(Data.world.chunks.length <= viewport.rowBegin + row || Data.world.chunks.length <= viewport.columnBegin + column)) {
                        //console.log("ad", viewport.rowBegin, row, viewport.columnBegin, column)
                        let chunks = Data.world.chunks[viewport.rowBegin + row]
                        //console.log(chunks)
                        let chunk = chunks[viewport.columnBegin + column];
                        a_column.push(chunk);
                    }

                })
                a_row.push(a_column);
            })
            this.chunks_to_see = a_row;
        }
    }
}
module.exports = Player;