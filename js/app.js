let pre_Sec = 0;
const modelPath = "models/gltf/smart city.gltf";

// Scene
const scene = new THREE.Scene();

// Background color
scene.background = new THREE.Color(0x000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
});

var mixer;
var clock = new THREE.Clock();

// Lights

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(30, 20, 0);
scene.add(light1);

const loader = new THREE.GLTFLoader();

// Camera
camera.position.set(5, 0, 5);

controls.update();

let delta = 0;

// fps
let interval = 1 / 240;

function animate() {
    requestAnimationFrame(animate);
    delta += clock.getDelta();

    if (delta > interval) {

        try {
            if (mixer && mixer._actions[0] && mixer._actions[0].time) {
                let currentTime = parseFloat(toFixed(mixer._actions[0].time, 1));

                if (currentTime !== pre_Sec) {
                    // Sync timed animation here
                }

                pre_Sec = currentTime;
            }
        } catch (err) {

        }

        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
        controls.update();

        delta = delta % interval;
    }
}
animate();

loader.load(modelPath,
    // called when the resource is loaded
    function (gltf) {

        document.getElementById('loadOverlay').style.display = "none";

        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        gltf.scene.children.forEach(c => {
            c.frustumCulled = false;
            c.renderOrder = 1;
        })

        gltf.scene.traverse((object) => {
            object.frustumCulled = false;
        });

        gltf.scene.frustumCulled = false;
        scene.add(gltf.scene);

        animate();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}