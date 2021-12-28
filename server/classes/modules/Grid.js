const Block = require("./Block");
class Grid {
    dim = 20;
    blocks = [];
    constructor(dim) {
        this.dim = dim;
        this.generate();
    }
    generate() {
        let row = [];
        [...Array(this.dim)].forEach((_, xRow) => {
            let a_collumn = [];
            [...Array(this.dim)].forEach((_, collumn) => {
                let min = Math.ceil(0);
                let max = Math.floor(4);
                let block = new Block(Math.floor(Math.floor(Math.random() * (max - min + 1)) + min), 0);
                a_collumn.push(block);

            })
            row.push(a_collumn);
        })
        this.blocks = row;
    }
}
module.exports = Grid;