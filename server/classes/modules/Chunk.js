class Chunk {
    blocks = [];
    id = "";
    entitiesUUIDs = [];
    x = 0;
    y = 0;
    constructor(blocks, id, x, y) {
        this.blocks = blocks;
        this.id = id;
        this.x = x;
        this.y = y;
    }
}
module.exports = Chunk;