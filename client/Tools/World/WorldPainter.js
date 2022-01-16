WorldPainter = {
    world: {},
    grid: {},
    mouseDown: false,
    type: 2,
    startPainting() {
        document.body.innerHTML = loadPage("./MultiPlayer/World_design.html");
        this.world = new World("WorldPainter_World", 128);
        this.grid = new Grid(0, 0, 16, 0, false, {});
        this.grid.chunks = this.world.chunks;
        this.grid.update();
        blockSize("8")
        this.init();
    }
    , init() {
        const gridNode = document.querySelector("#Grid");
        window.addEventListener('mousedown', () => this.mouseDown = true)
        window.addEventListener('mouseup', () => this.mouseDown = false)
        gridNode.addEventListener('mouseover', evt => {
            if (this.mouseDown) {
                const block = evt.target;
                const parts = block.id.split('-')
                const xChunk = parts[1]
                const yChunk = parts[2]
                const xBlock = parts[4]
                const yBlock = parts[5]
                this.world.chunks[xChunk][yChunk].blocks[xBlock][yBlock].block_of = this.type;
                block.classList.add(`block-t-${this.type}-0`)
            }
        })
    }
    , export() {
        const data = JSON.stringify(this.world)
        const url = 'data:application/octet-stream,' + encodeURIComponent(data);
        window.open(url)
    },
    change_type(type) {
        this.type = type;
    }
}