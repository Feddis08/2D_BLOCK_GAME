const Entity = require("./Entity");
const Data = require("../modules/Data.js");
class Player extends Entity {
    socketId = "";
    setup_finished = false;
    setup_accepted = false;
    isPlayer = true;
    viewRange = 32;
    blocks_to_see = [];
    block_string = "";
    viewChange = false;
    socketId = "";
    constructor(player_name, socketId) {
        super(player_name)
        this.socketId = socketId;
    }
    personalTick() {
        this.checkViewport();
    }
    blocks_to_string(blocks) {
        let s_blocks = [];
        blocks.forEach((row, index) => {
            let s_row = row.map(block => block.block_of).join("-");
            s_blocks.push(s_row);
        })
        let result;
        s_blocks.forEach((s, index) => {
            result = result + s;
        })
        return result;

    }
    checkViewport() {
        this.getViewport();
        let new_blocks = this.blocks_to_string(this.blocks_to_see);
        //console.log(new_blocks, this.block_string)
        if (new_blocks !== this.block_string) {
            this.block_string = this.blocks_to_string(this.blocks_to_see);
            this.viewChange = true;
        } else {
        }
    }
    calculateViewport() {
        let rowBegin = this.x;
        let rowEnd = this.x + this.viewRange;
        let columnBegin = this.y;
        let columnEnd = this.y + this.viewRange;
        return { rowBegin: rowBegin, rowEnd: rowEnd, columnBegin: columnBegin, columnEnd: columnEnd };
    }
    getViewport() {
        let viewport = this.calculateViewport();
        let a_row = [];
        let count_a = 0;
        let count_b = 0;
        [...Array(this.viewRange)].forEach((_, row) => {
            let a_column = [];
            count_a = count_a + 1;
            [...Array(this.viewRange)].forEach((_, column) => {
                count_b = count_b + 1;
                let block = Data.world.blocks[viewport.rowBegin + row][viewport.columnBegin + column];
                a_column.push(block);

            })
            a_row.push(a_column);
        })
        this.blocks_to_see = a_row;
        //`console.log(this.viewRange, count_a, count_b);
    }
}
module.exports = Player;