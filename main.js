import * as THREE from 'three';

let scene, camera, renderer, dvdLogo;
let velocity = { x: 0.03, y: 0.02 }; // Speed of the logo

// Colors for the logo that will change on each bounce
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
let currentColor = 0;

// Set the bounds (we'll update dynamically later)
let bounds = {
  xMin: -window.innerWidth / 200,
  xMax: window.innerWidth / 200,
  yMin: -window.innerHeight / 200,
  yMax: window.innerHeight / 200
};

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(
    window.innerWidth / -200,
    window.innerWidth / 200,
    window.innerHeight / 200,
    window.innerHeight / -200,
    0.1,
    1000
  );
  
  camera.position.z = 5;

  // Renderer setup
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create the DVD logo as a simple box
  const geometry = new THREE.BoxGeometry(1, 0.5);
  const material = new THREE.MeshBasicMaterial({ color: colors[currentColor] });
  dvdLogo = new THREE.Mesh(geometry, material);
  scene.add(dvdLogo);

  // Update bounds
  updateBounds();

  // Start animation
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Move the logo
  dvdLogo.position.x += velocity.x;
  dvdLogo.position.y += velocity.y;

  // Check for collisions with the window edges
  checkCollision();

  renderer.render(scene, camera);
}

function checkCollision() {
  // If it hits the left or right side, reverse X direction
  if (dvdLogo.position.x <= bounds.xMin || dvdLogo.position.x >= bounds.xMax) {
    velocity.x = -velocity.x;
    changeColor(); // Change color on collision
  }

  // If it hits the top or bottom, reverse Y direction
  if (dvdLogo.position.y <= bounds.yMin || dvdLogo.position.y >= bounds.yMax) {
    velocity.y = -velocity.y;
    changeColor(); // Change color on collision
  }
}

function changeColor() {
  currentColor = (currentColor + 1) % colors.length;
  dvdLogo.material.color.set(colors[currentColor]);
}

function updateBounds() {
  // Dynamically adjust the bounds based on window size
  bounds.xMin = window.innerWidth / -200;
  bounds.xMax = window.innerWidth / 200;
  bounds.yMin = window.innerHeight / -200;
  bounds.yMax = window.innerHeight / 200;
}

window.addEventListener('resize', () => {
  // Update the camera and bounds when the window is resized
  camera.left = window.innerWidth / -200;
  camera.right = window.innerWidth / 200;
  camera.top = window.innerHeight / 200;
  camera.bottom = window.innerHeight / -200;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  updateBounds();
});

// Initialize the scene
init();