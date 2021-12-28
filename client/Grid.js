class Grid {
    dim = 20;
    viewRange = 5
    xPos = 0;
    yPos = 0;
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
        let oldRowDomNodes = document.querySelectorAll(".row");
        oldRowDomNodes.forEach((domNodeRow, index) => {
            domNodeRow.remove();
        })
        let domNodeGrid = document.querySelector("#Grid");
        this.blocks.forEach((collumn, xRow) => {
            const domNodeRow = document.createElement("div");
            domNodeRow.classList.add("row");
            collumn.forEach((block, y) => {
                let old_block_domNode = document.querySelector("#block-x" + xRow + "-y" + y);
                if (old_block_domNode !== null) old_block_domNode.remove();
                const domNodeBlock = document.createElement("div");
                domNodeBlock.id = "block-x" + xRow + "-y" + y;
                domNodeBlock.classList.add("block");
                domNodeBlock.classList.add("block-t-" + block.block_of + "-" + block.block_type);
                domNodeRow.appendChild(domNodeBlock);
            })
            domNodeGrid.appendChild(domNodeRow);
        })
    }
    update() {
        this.drawGrid();
        this.drawViewport();
    }
}