
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
loader.setPath('res/');

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
const geometry = new THREE.BoxGeometry(1, 1, 1);

var cubes = [];
[...Array(10000)].forEach((_, index) => {
    const cube = new THREE.Mesh(geometry, textureGrassBlock);
    cube.overdraw = true;
    cube.position.z = 0;

    cube.position.y = cube.geometry.parameters.width * index;
    cube.position.x = cube.geometry.parameters.depth * index;


    scene.add(cube);
    cubes.push(cube);
    //scene.remove(cube);
})

camera.position.z = 0;
camera.position.x = 0;
camera.position.y = 0;
camera.rotation.z += 0;
camera.rotation.y += 4;
var ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

function animate() {
    requestAnimationFrame(animate);
    cubes.forEach((cube, _) => {
        cube.rotation.x += 0.05;
        cube.rotation.y += 0.005;

    })

    renderer.render(scene, camera);
}
animate();
