
const Data = require("../modules/Data.js");
class Player {
    UUID = "";
    x = 50;
    y = 50;
    name = "no_name";
    health = 10;
    //step_speed ms in block
    step_speed = 250;
    step_count = 0;
    move = "idle";
    upTime = 0;
    creationDate = "";
    //all ids in this array will be blocked for collisions
    collisionTable = [];
    constructor(name) {
        this.name = name;
        this.creationDate = new Date().getTime();
        this.getUUID();
    }

    personalTick() {
    }
    tick() {
        this.upTime + 10;
        this.personalTick();
        this.moving();
    }
    getUUID() {
        const rand = Math.random().toString();
        this.UUID = "UUID-" + new Date().getTime() + rand.split(".")[1];
    }
    check_block_collision(x, y) {
        let block = Data.world.blocks[x][y];
        return block;
    }
    check_block_for_collision(block) {
        let result = false;
        this.collisionTable.forEach((block_type, index) => {
            if (block.block_type == block_type) {
                result = true;
            }
        })
        return result;
    }
    check_move(x, y) {
        return this.check_block_for_collision(this.check_block_collision(x, y));
    }
    moving() {
        if (this.step_count == this.step_speed) {
            this.step_count = 0;
            if (this.move !== "idle") {
                if (this.move == "ArrowRight") {
                    this.x++;
                    if (this.check_move(this.x, this.y)) {
                        this.x--;
                        this.move = "idle";
                    };
                }
                if (this.move == "ArrowLeft") {
                    this.x--;
                    if (this.check_move(this.x, this.y)) {
                        this.x++;
                        this.move = "idle";
                    };
                }
                if (this.move == "ArrowUp") {
                    this.y--;
                    if (this.check_move(this.x, this.y)) {
                        this.y++;
                        this.move = "idle";
                    };
                }
                if (this.move == "ArrowDown") {
                    this.y++;
                    if (this.check_move(this.x, this.y)) {
                        this.y--;
                        this.move = "idle";
                    };
                }
            }
        } else {
            this.step_count = this.step_count + 10;
        }
    }
}
module.exports = Player;