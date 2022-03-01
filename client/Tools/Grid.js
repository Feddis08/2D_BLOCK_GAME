class Grid {
    dim = 20;
    viewRange = 5
    xPos = 0;
    yPos = 0;
    chunks = [];
    blocks = [];
    block_px = 32;
    scene = "";
    camera = "";
    renderer = "";
    domNodeGrid = "";
    constructor(xPos, yPos, dim, viewRange, SP, blocks) {
        this.dim = dim;
        this.blocks = blocks;
        this.viewRange = viewRange;
        this.yPos = yPos;
        this.xPos = xPos;
        this.domNodeGrid = document.querySelector("#Grid");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(512, 512);
        this.domNodeGrid.appendChild(this.renderer.domElement);
        this.camera.position.x = 4;
        this.camera.position.y = 5;
        this.camera.position.z = 15;
        //this.camera.rotation.z = Math.PI * 2;
        let ambientLight = new THREE.AmbientLight(0x555555);
        this.scene.add(ambientLight);
        let directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);

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
    /*
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
    */
    drawGrid() {
        this.chunks.forEach((chunk_row, chunk_row_index) => {
            chunk_row.forEach((chunk, chunk_column_index) => {
                chunk.blocks.forEach((blocks, block_row_index) => {
                    blocks.forEach((block, block_column_index) => {
                        let block3 = this.scene.getObjectByName("ID:x" + block_row_index + "y" + block_column_index);
                        this.scene.remove(block3);
                        if (block.block_of == "0") {
                            block3 = this.createStoneBlock("ID:x" + block_row_index + "y" + block_column_index);
                        }
                        if (block.block_of == "1") {
                            block3 = this.createGrassBlock("ID:x" + block_row_index + "y" + block_column_index);
                        }
                        if (block.block_of == "2") {
                            block3 = this.createWaterBlock("ID:x" + block_row_index + "y" + block_column_index);
                        }
                        if (block.block_of == "3") {
                            block3 = this.createSandBlock("ID:x" + block_row_index + "y" + block_column_index);
                        }
                        block3.position.z = block3.geometry.parameters.width * block_column_index;
                        block3.position.x = block3.geometry.parameters.depth * block_row_index;
                        this.scene.add(block3);
                    })
                })
            })
        })
    }
    createSandBlock(id) {
        let loader = new THREE.TextureLoader();
        loader.setPath('res/blocks/sand_block/');
        const textureSandBlock = [
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            })
        ]
        let geometry = new THREE.BoxGeometry(1, 1, 1);

        const cube = new THREE.Mesh(geometry, textureSandBlock);
        cube.overdraw = true;
        cube.name = id;
        return cube;
    }
    createStoneBlock(id) {
        let loader = new THREE.TextureLoader();
        loader.setPath('res/blocks/stone_block/');
        const textureStoneBlock = [
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            })
        ]
        let geometry = new THREE.BoxGeometry(1, 1, 1);

        const cube = new THREE.Mesh(geometry, textureStoneBlock);
        cube.overdraw = true;
        cube.name = id;
        return cube;
    }
    createWaterBlock(id) {
        let loader = new THREE.TextureLoader();
        loader.setPath('res/blocks/water_block/');
        const textureWaterBlock = [
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            })
        ]
        let geometry = new THREE.BoxGeometry(1, 1, 1);

        const cube = new THREE.Mesh(geometry, textureWaterBlock);
        cube.overdraw = true;
        cube.name = id;
        return cube;
    }
    createGrassBlock(id) {
        let loader = new THREE.TextureLoader();
        loader.setPath('res/blocks/grass_block/');
        const textureGrassBlock = [
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("top.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("but.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("side.png")
            })
        ]
        let geometry = new THREE.BoxGeometry(1, 1, 1);

        const cube = new THREE.Mesh(geometry, textureGrassBlock);
        cube.overdraw = true;
        cube.name = id;
        return cube;
    }
    createPlayer(id) {
        let loader = new THREE.TextureLoader();
        loader.setPath('res/Entities/Player/');
        const texturePlayer = [
            new THREE.MeshStandardMaterial({
                map: loader.load("left.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("right.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("right.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("right.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("front.png")
            }),
            new THREE.MeshStandardMaterial({
                map: loader.load("back.png")
            })
        ]
        let geometry = new THREE.BoxGeometry(1, 1, 1);

        const cube = new THREE.Mesh(geometry, texturePlayer);
        cube.overdraw = true;
        cube.name = id;
        return cube;
    }
    animate() {
        this.renderer.render(this.scene, this.camera);

    }
    update() {
        this.drawGrid();
        //this.drawViewport();
    }
}