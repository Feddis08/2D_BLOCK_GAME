
const { world } = require("../modules/Data.js");
const Data = require("../modules/Data.js");
class Player {
    isPlayer = false;
    UUID = "";
    x = 1;
    chunk_x = 0;
    y = 1;
    chunk_y = 0;
    coords_changed_by_move = false;
    last_x_y_string = "";
    new_x_y_string = "";
    name = "no_name";
    health = 10;
    //step_speed ms in block
    step_speed = 500;
    step_count = 0;
    move = "idle";
    moved = false;
    upTime = 0;
    creationDate = "";
    //all block_ids in this array will be blocked for collisions
    collisionTable = ["0", "1"];
    constructor(name) {
        this.name = name;
        this.creationDate = new Date().getTime();
        this.getUUID();
    }

    personalTick() {
    }
    update_chunk_coords() {
        let chunk = Data.world.getChunkByBlock(this.x, this.y);
        this.chunk_x = chunk.c_x;
        this.chunk_y = chunk.c_y;
    }
    tick() {
        this.upTime + 10;
        this.personalTick();
        this.moving();
        this.check_for_changed_x_y();
    }
    getUUID() {
        const rand = Math.random().toString();
        this.UUID = "UUID-" + new Date().getTime() + rand.split(".")[1];
    }
    check_block_for_collision(block) {
        if (block == false) {
            return false
        } else {
            let result = false;
            this.collisionTable.forEach((block_of, index) => {
                if (block.block_of == block_of) {
                    result = true;
                }
            })
            return result;
        }
    }
    check_move(x, y) {
        return this.check_block_for_collision(Data.world.getBlock(x, y));
    }
    setLastMove() {
        this.last_x_y_string = "x-" + this.x + "-y-" + this.y;
    }
    setNewMove() {
        this.new_x_y_string = "x-" + this.x + "-y-" + this.y;
    }
    check_for_changed_x_y() {
        if (this.last_x_y_string !== this.new_x_y_string) {
            this.coords_changed_by_move = true;
            this.last_x_y_string = this.new_x_y_string;
        } else {
            this.coords_changed_by_move = false;
            this.last_x_y_string = this.new_x_y_string;
        }
    }
    moving() {
        if (this.step_count == this.step_speed) {
            this.setLastMove();
            this.setNewMove();
            if (this.move !== "idle") {
                this.step_count = 0;
                if (this.move == "ArrowRight") {
                    this.setLastMove();
                    this.x++;
                    if (this.check_move(this.x, this.y)) {
                        this.x--;
                        this.setNewMove();
                        this.move = "idle";
                        return;
                    };
                    this.isMoving = true;
                    this.setNewMove();
                }
                if (this.move == "ArrowLeft") {
                    this.setLastMove();
                    this.x--;
                    if (this.check_move(this.x, this.y)) {
                        this.x++;
                        this.setNewMove();
                        this.move = "idle";
                        return;
                    };
                    this.isMoving = true;
                    this.setNewMove();
                }
                if (this.move == "ArrowUp") {
                    this.setLastMove();
                    this.y--;
                    if (this.check_move(this.x, this.y)) {
                        this.y++;
                        this.setNewMove();
                        this.move = "idle";
                        return;
                    };
                    this.isMoving = true;
                    this.setNewMove();
                }
                if (this.move == "ArrowDown") {
                    this.setLastMove();
                    this.y++;
                    if (this.check_move(this.x, this.y)) {
                        this.y--;
                        this.setNewMove();
                        this.move = "idle";
                        return;
                    };
                    this.isMoving = true;
                    this.setNewMove();
                }
            }
        } else {
            this.step_count = this.step_count + 1;
        }
    }
}
module.exports = Player;