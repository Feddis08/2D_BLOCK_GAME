display_entities = (entities) => {
    entities.forEach((entity, index) => {
        let coords = getChunkByBlock(entity.x, entity.y);
        //const domNodeChunk = document.querySelector("#chunk-" + coords.c_x + "-" + coords.c_y);
        const domNodeChunk = document.querySelector("#chunk-0-0");
        const domNodeEntity = document.createElement("div");
        domNodeChunk.appendChild(domNodeEntity)
        domNodeEntity.classList.add("entity");
        domNodeEntity.style.left = coords.x * 64;
        domNodeEntity.style.top = coords.y * 64;
        console.log(entity.x)
    })
}
getChunkByBlock = (want_x, want_y) => {
    let c_x = Math.trunc(want_x / 8);
    let c_y = Math.trunc(want_y / 8);
    let x = want_x % 8;
    let y = want_y % 8;
    return { c_x, c_y, x, y };
}
display_remove_entity = () => {

}
display_remove_all_entities = () => {
    let entities = document.querySelectorAll(".entity");
    entities.forEach((entity, index) => {
        entity.remove();
    })
}