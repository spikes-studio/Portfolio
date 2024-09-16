
// Scene, Camera, and Renderer Setup
let scene, camera, renderer, cube, sphere, torus, controls;

function init() {
    // Create a scene
    scene = new THREE.Scene();

    // Set up the camera with a perspective view
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Create a WebGL renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#heroCanvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Create a Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x007bff });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff5733 });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 3;
    scene.add(sphere);

    // Create a Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff77 });
    torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.x = -3;
    scene.add(torus);

    // Add Orbit Controls for camera movement
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add Post-processing effects (bloom)
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    animate(composer);
}

// Animate and render scene
function animate(composer) {
    requestAnimationFrame(() => animate(composer));

    // Rotate cube, sphere, and torus
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    controls.update();
    composer.render();
}

init();

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Interactive mouse movement for 3D objects
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Apply mouse interaction to the cube
    cube.position.x = mouseX * 2;
    cube.position.y = mouseY * 2;
});

// Custom shader material for advanced visual effects
const vertexShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    void main() {
        float intensity = pow(0.9 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.2, 0.7, 1.0, 1.0) * intensity;
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

// Additional 3D object with custom shader
const shaderCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const shaderCube = new THREE.Mesh(shaderCubeGeometry, shaderMaterial);
shaderCube.position.set(0, 2, -5);
scene.add(shaderCube);

// Add point light with dynamic intensity based on scroll position
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    pointLight.intensity = (scrollY / window.innerHeight) * 2;
});

    

