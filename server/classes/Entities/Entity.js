
const { world } = require("../modules/Data.js");
const Data = require("../modules/Data.js");
const update_data = require("../modules/update_data.js");
const Update_data = require("../modules/update_data.js");
class Entity {
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
    watch_direction = "front";
    upTime = 0;
    creationDate = "";
    updates = [];
    //all block_ids in this array will be blocked for collisions
    collisionTable = ["2"];
    //everything other client should see you need to put it in the list
    //the own player has access to all
    public_data_list = [];
    constructor(name) {
        this.initial(name);
    }
    initial(name) {
        this.name = name;
        this.creationDate = new Date().getTime();
        this.getUUID();
        this.add_public_data("x");
        this.add_public_data("y");
        this.add_public_data("UUID");
        this.add_public_data("chunk_x");
        this.add_public_data("chunk_y");
        this.add_public_data("name");
        this.add_public_data("isPlayer");
        this.add_public_data("watch_direction");
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
        return this.updates;
    }

    add_public_data(data_s) {
        this.public_data_list.push(data_s);
    }
    remove_public_data(data_s) {
        this.public_data_list.forEach((public_data, index) => {
            if (public_data == data_s) {
                this.public_data_list.splice(index, 1);
            }
        })
    }
    filter_and_get_public_data() {
        let public_data = {};
        this.public_data_list.forEach((public_data_s, index) => {
            //everything other client should see you need to update this
            if (public_data_s == "x") {
                public_data.x = this.x;
            }
            if (public_data_s == "y") {
                public_data.y = this.y;
            }
            if (public_data_s == "UUID") {
                public_data.UUID = this.UUID;
            }
            if (public_data_s == "chunk_y") {
                public_data.chunk_y = this.chunk_y;
            }
            if (public_data_s == "chunk_x") {
                public_data.chunk_x = this.chunk_x;
            }
            if (public_data_s == "name") {
                public_data.name = this.name;
            }
            if (public_data_s == "isPlayer") {
                public_data.isPlayer = this.isPlayer;
            }
            if (public_data_s == "watch_direction") {
                public_data.watch_direction = this.watch_direction;
            }
        })
        return public_data;
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
    add_update(data) {
        this.updates.push(data);
    }
    set_watch_direction(move) {
        if (move === "ArrowDown") {
            let watch_direction = "front";
            if (watch_direction !== this.watch_direction) {
                this.watch_direction = watch_direction;
                let data = new update_data(true, "watch_direction");
                data.player = this.filter_and_get_public_data();
                this.add_update(data);
            }
        }
        if (move === "ArrowUp") {
            let watch_direction = "back";
            if (watch_direction !== this.watch_direction) {
                this.watch_direction = watch_direction;
                let data = new update_data(true, "watch_direction");
                data.player = this.filter_and_get_public_data();
                this.add_update(data);
            }
        }
        if (move === "ArrowRight") {
            let watch_direction = "right";
            if (watch_direction !== this.watch_direction) {
                this.watch_direction = watch_direction;
                let data = new update_data(true, "watch_direction");
                data.player = this.filter_and_get_public_data();
                this.add_update(data);
            }
        }
        if (move === "ArrowLeft") {
            let watch_direction = "left";
            if (watch_direction !== this.watch_direction) {
                this.watch_direction = watch_direction;
                let data = new update_data(true, "watch_direction");
                data.player = this.filter_and_get_public_data();
                this.add_update(data);
            }
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
module.exports = Entity;