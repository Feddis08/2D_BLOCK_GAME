const Grid = require("./Grid");
class World {
    blocks = [];
    entities = [];
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
        this.blocks = grid.blocks;
        console.log("[Server]: World created!");
    }
}
module.exports = World;