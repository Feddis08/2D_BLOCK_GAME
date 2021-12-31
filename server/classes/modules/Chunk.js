class Chunk {
    blocks = [];
    id = "";
    entities = [];
    constructor(blocks, id) {
        this.blocks = blocks;
        this.id = id;
    }
}
module.exports = Chunk;