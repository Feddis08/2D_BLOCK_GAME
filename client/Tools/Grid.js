class Grid {
    dim = 20;
    viewRange = 5
    xPos = 0;
    yPos = 0;
    chunks = [];
    blocks = [];
    block_px = 32;
    constructor(xPos, yPos, dim, viewRange, SP, blocks) {
        this.dim = dim;
        this.blocks = blocks;
        this.viewRange = viewRange;
        this.yPos = yPos;
        this.xPos = xPos;
        if (SP) this.generate();
    }
    generate() {
        let row = [];
        [...Array(this.dim)].forEach((_, xRow) => {
            let a_collumn = [];
            [...Array(this.dim)].forEach((_, collumn) => {
                let min = Math.ceil(0);
                let max = Math.floor(4);
                let block = new Block(xRow, collumn, Math.floor(Math.floor(Math.random() * (max - min + 1)) + min), 0);
                a_collumn.push(block);

            })
            row.push(a_collumn);
        })
        this.blocks = row;
    }
    getViewport() {
        let rowBegin = this.xPos;
        let rowEnd = this.xPos + this.viewRange;
        let columnBegin = this.yPos;
        let columnEnd = this.yPos + this.viewRange;
        return { rowBegin: rowBegin, rowEnd: rowEnd, columnBegin: columnBegin, columnEnd: columnEnd };
    }
    drawViewport() {
        let oldViewportDomNodes = document.querySelectorAll(".block_in_Viewport");
        oldViewportDomNodes.forEach((domNodeBlock, index) => {
            domNodeBlock.classList.remove("block_in_Viewport");
        })
        let viewport = this.getViewport();
        [...Array(this.viewRange)].forEach((_, row) => {
            [...Array(this.viewRange)].forEach((_, column) => {
                let block = this.blocks[viewport.rowBegin + row][viewport.columnBegin + column];
                const domNodeBlock = document.querySelector("#block-x" + (this.xPos + row) + "-y" + (this.yPos + column));
                domNodeBlock.classList.add("block_in_Viewport");

            })
        })

    }
    drawGrid() {
        let oldChunkDomNodes = document.querySelectorAll(".chunk");
        oldChunkDomNodes.forEach((domNodeChunk, index) => {
            domNodeChunk.remove();
        })
        let oldChunkRowDomNodes = document.querySelectorAll(".chunk_row");
        oldChunkRowDomNodes.forEach((chunkRow, index) => {
            chunkRow.remove();
        })
        this.chunks.forEach((c_row, c_x) => {
            const domNodeC_Row = document.createElement("div");
            domNodeC_Row.classList.add("chunk_row");
            c_row.forEach((chunk, c_y) => {
                const domNodeChunk = document.createElement("div");
                domNodeChunk.classList.add("chunk");
                domNodeChunk.id = `chunk-${c_x}-${c_y}`;
                chunk.blocks.forEach((collumn, xRow) => {
                    const domNodeRow = document.createElement("div");
                    domNodeRow.classList.add("row");
                    collumn.forEach((block, y) => {
                        //let old_block_domNode = document.querySelector("#block-x" + xRow + "-y" + y);
                        //if (old_block_domNode !== null) old_block_domNode.remove();
                        const domNodeBlock = document.createElement("div");
                        //domNodeBlock.id = "block-x" + (xRow + c_y) + "-y" + (y + c_x);
                        domNodeBlock.id = `chunk-${c_x}-${c_y}-block-${xRow}-${y}`;
                        domNodeBlock.classList.add("block");
                        domNodeBlock.classList.add("block-t-" + block.block_of + "-" + block.block_type);
                        domNodeRow.appendChild(domNodeBlock);
                    })
                    domNodeChunk.appendChild(domNodeRow);
                })
                domNodeC_Row.appendChild(domNodeChunk);
            })
            const domNodeGrid = document.querySelector("#Grid");
            domNodeGrid.appendChild(domNodeC_Row);
        })

    }
    update() {
        this.drawGrid();
        //this.drawViewport();
    }
}