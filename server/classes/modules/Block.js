class Block {
    block_type = 0;
    block_of = 0;
    constructor(block_of, block_type) {
        this.block_of = block_of;
        this.block_type = block_type;
    }
}
module.exports = Block;