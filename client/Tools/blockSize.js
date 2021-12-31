const blockSize = (size) => {
    const grid = document.querySelector('#Grid');
    grid.classList.remove('x64')
    grid.classList.remove('x32')
    grid.classList.remove('x16')
    grid.classList.remove('x8')
    grid.classList.add(`x${size}`)
}