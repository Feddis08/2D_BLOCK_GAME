class update_data {
    in_same_chunk = false;
    emit = "s";

    constructor(in_same_chunk, emit) {
        this.in_same_chunk = in_same_chunk;
        this.emit = emit;
    }

}
module.exports = update_data;