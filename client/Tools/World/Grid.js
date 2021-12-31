class World_Grid {
    chunks_dim = 0;
    chunks = [];
    constructor(dim) {
        this.chunks_dim = dim;
        this.generate();
    }
    generate() {
        let c_row = [];
        [...Array(this.chunks_dim)].forEach((_, chunk_row) => {
            let c_column = [];
            [...Array(this.chunks_dim)].forEach((_, chunk_column) => {
                let b_row = [];
                [...Array(8)].forEach((_, xRow) => {
                    let b_collumn = [];
                    [...Array(8)].forEach((_, collumn) => {
                        let block = new Block(0, 0);
                        b_collumn.push(block);
                    })
                    b_row.push(b_collumn);
                })
                let chunk = new Chunk(b_row, Math.random().toString());
                c_column.push(chunk)
            })
            c_row.push(c_column);
            this.chunks = c_row;
        })
    }
}