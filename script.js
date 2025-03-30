let camera, scene, renderer, controls;
let objects = []; // Array to store target objects
const raycaster = new THREE.Raycaster();

init();
animate();

function init() {
  // Create the scene and set its background color.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // Set up the camera.
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10; // Eye level

  // Create the renderer.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lights.
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Create a ground plane.
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create target boxes.
  const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  for (let i = 0; i < 10; i++) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    // Randomly place targets ahead of the player.
    box.position.set(Math.random() * 100 - 50, 2, Math.random() * -100 - 20);
    scene.add(box);
    objects.push(box);
  }

  // Set up pointer lock controls for a first-person perspective.
  controls = new THREE.PointerLockControls(camera, document.body);
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
  });

  controls.addEventListener('unlock', () => {
    instructions.style.display = '';
  });

  scene.add(controls.getObject());

  // Movement variables.
  const move = { forward: false, backward: false, left: false, right: false };
  const velocity = new THREE.Vector3();

  // Keyboard events for movement.
  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW': move.forward = true; break;
      case 'KeyS': move.backward = true; break;
      case 'KeyA': move.left = true; break;
      case 'KeyD': move.right = true; break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW': move.forward = false; break;
      case 'KeyS': move.backward = false; break;
      case 'KeyA': move.left = false; break;
      case 'KeyD': move.right = false; break;
    }
  });

  // Shooting: raycast when left mouse button is clicked.
  document.addEventListener('mousedown', (event) => {
    if (event.button === 0 && controls.isLocked === true) {
      // Create a ray from the center of the screen.
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      const intersects = raycaster.intersectObjects(objects);
      if (intersects.length > 0) {
        const target = intersects[0].object;
        scene.remove(target);
        objects = objects.filter(obj => obj !== target);
        console.log('Target hit!');
      }
    }
  });

  // Movement update using delta time.
  const clock = new THREE.Clock();
  function updateMovement() {
    const delta = clock.getDelta();
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    const speed = 50.0;

    if (move.forward) velocity.z -= speed * delta;
    if (move.backward) velocity.z += speed * delta;
    if (move.left) velocity.x -= speed * delta;
    if (move.right) velocity.x += speed * delta;

    controls.moveRight(velocity.x * delta);
    controls.moveForward(velocity.z * delta);
  }

  // Set up the render loop.
  renderer.setAnimationLoop(() => {
    updateMovement();
    renderer.render(scene, camera);
  });

  // Handle window resizing.
  window.addEventListener('resize', onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function animate() {
  // Animation loop is handled in renderer.setAnimationLoop in the init function.
}
