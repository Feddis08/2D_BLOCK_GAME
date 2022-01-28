const Grid = require("./Grid");
class World {
    entities = [];
    negative_chunks = [];
    chunks = [];
    name = "New world";
    dim = 0;
    constructor(name, dim) {
        this.name = name;
        this.dim = dim;
        this.create();
    }
    create() {
        let grid = new Grid(this.dim)
        this.chunks = grid.chunks;
        console.log("[Server]: World created!");
    }
    getBlock(want_x, want_y) {
        let c_x = Math.trunc(want_x / 8);
        let c_y = Math.trunc(want_y / 8);
        let x = want_x % 8;
        let y = want_y % 8;
        if (c_x < 0 || c_y < 0 || x < 0 || y < 0) {
            return false;
        }
        if (this.chunks.length > c_x || this.chunks.length > c_y && 8 >= x || y >= 8) {
            let chunk = this.chunks[c_x][c_y];
            let block = chunk.blocks[x][y];
            return block;
        } else {
            return false;
        }
    }
    getChunkByBlock(want_x, want_y) {
        let c_x = Math.trunc(want_x / 8);
        let c_y = Math.trunc(want_y / 8);
        if (c_x < 0 || c_y < 0) {
            return false;
        }
        if (this.chunks.length < c_x || this.chunks.length < c_y) {
            return false;
        } else {
            let chunk = this.chunks[c_x][c_y];
            return { chunk, c_x, c_y };
        }
    }
}
module.exports = World;