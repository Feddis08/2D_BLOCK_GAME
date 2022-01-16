const Entity = require("./Entity");
const Data = require("../modules/Data.js");
class Player extends Entity {
    socketId = "";
    setup_finished = false;
    setup_accepted = false;
    isPlayer = true;
    viewRange = 32;
    chunks_to_see = [];
    chunks_string = "";
    viewChange = false;
    socketId = "";
    constructor(player_name, socketId) {
        super(player_name)
        this.socketId = socketId;
        this.isPlayer = true;
    }
    personalTick() {
        this.checkViewport();
    }
    chunks_to_string(blocks) {
        let s_chunks = [];
        blocks.forEach((row, index) => {
            let s_row = row.map(chunk => chunk.id).join("-");
            s_chunks.push(s_row);
        })
        let result;
        s_chunks.forEach((s, index) => {
            result = result + s;
        })
        return result;

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
        let chunkData = Data.world.getChunkByBlock(this.x, this.y)
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