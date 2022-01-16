class Chunk {
    blocks = [];
    id = "";
    entitiesUUIDs = [];
    constructor(blocks, id) {
        this.blocks = blocks;
        this.id = id;
    }
}
module.exports = Chunk;