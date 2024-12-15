// John Napoleon Cortes  ITE18 - AD1

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);

renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    100, // fov
    sizes.width / sizes.height, // aspect ratio
    .1, // near limit
    1000 // far limit
);
camera.position.set(4, 7, 7);
scene.add(camera);


// Lights
// Ambient Lights
const ambientLight = new THREE.AmbientLight(0xffffff, .3);
scene.add(ambientLight);

// Directional Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
lightSphere.position.copy(directionalLight.position);
scene.add(lightSphere);

// SpotLight
const spotLight = new THREE.SpotLight('pink', 200, 20, Math.PI / 10, 0, 1.5)
spotLight.position.set(5, 7, 2)
spotLight.target.position.set(-90, -90, 0);
spotLight.castShadow = true;

spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 30;

scene.add(spotLight);
scene.add(spotLight.target);

// Helpers
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);
scene.add(directionalLightHelper);


// Cube Object
const sideColors = {
    top: 0xffff00,      // yellow
    bottom: 0xffffff,     // white
    left: 0xff0000,     // red
    right: 0xff5500,   // orange
    back: 0x0000ff,    // blue
    front: 0x00ff00,    // green
}

const materials = [
    new THREE.MeshStandardMaterial({ color: sideColors.right }),
    new THREE.MeshStandardMaterial({ color: sideColors.left }),
    new THREE.MeshStandardMaterial({ color: sideColors.top }),
    new THREE.MeshStandardMaterial({ color: sideColors.bottom }),
    new THREE.MeshStandardMaterial({ color: sideColors.front }),
    new THREE.MeshStandardMaterial({ color: sideColors.back }),
];

const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials);
cube.castShadow = true;

const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const lineSegments = new THREE.LineSegments(edges, lineMaterial);
cube.add(lineSegments);

// Ground Object
const groundMesh = new THREE.Mesh(
    new THREE.BoxGeometry(20, .01, 20),
    new THREE.MeshStandardMaterial({ color: 0x2e2e2e, roughness: .2 })
);
groundMesh.rotation.y = THREE.MathUtils.degToRad(45);
groundMesh.position.y = - 2
groundMesh.receiveShadow = true;

scene.add(cube, groundMesh)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock()

const planeSize = 10;
// Initial and target positions for the spotlight target
const targetPosition = new THREE.Vector3(
    (Math.random() - 0.5) * planeSize, 0,
    (Math.random() - 0.5) * planeSize);

const currentTargetPosition = spotLight.target.position.clone(); // Start at the current target position

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Cube rotation
    cube.rotation.y = 0.5 * elapsedTime
    cube.rotation.x = 0.5 * elapsedTime

    //  Randomly movethe spotlight 
    currentTargetPosition.lerp(targetPosition, 0.02);
    spotLight.target.position.copy(currentTargetPosition);
    spotLight.target.updateMatrixWorld();

    if (currentTargetPosition.distanceTo(targetPosition) < 0.1) {
        targetPosition.set(
            (Math.random() - 0.5) * planeSize, 0,
            (Math.random() - 0.5) * planeSize);
    }

    // Update spotlight helper
    spotLightHelper.update();

    // Update controls
    controls.update();

    // Render 
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
