import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = id => document.getElementById(id);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fb4d2);
scene.fog = new THREE.Fog(0x8fb4d2, 45, 230);

const camera = new THREE.PerspectiveCamera(
  65, innerWidth / innerHeight, 0.1, 500
);
camera.position.set(0, 5.3, 10.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
$('scene').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd9edff, 0x51402e, 2.2));

const sun = new THREE.DirectionalLight(0xffe0b5, 2.8);
sun.position.set(-20, 30, 12);
sun.castShadow = true;
scene.add(sun);

const material = (color, roughness = 0.7, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 600),
  material(0x858b77)
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.2, -120);
scene.add(ground);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 500),
  material(0x303740, 0.95)
);
road.rotation.x = -Math.PI / 2;
road.position.set(0, -0.1, -180);
scene.add(road);

for (const x of [-7, 7]) {
  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.12, 500),
    material(0xc4b6a0)
  );
  edge.position.set(x, -0.03, -180);
  scene.add(edge);
}

const laneDashes = [];

for (let z = 20; z > -450; z -= 10) {
  for (const x of [-2.3, 2.3]) {
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.025, 4.5),
      material(0xf4e9cc)
    );
    dash.position.set(x, -0.035, z);
    scene.add(dash);
    laneDashes.push(dash);
  }
}

// مباني المدينة
const buildings = [];
const buildingMats = [
  0xc1b29c, 0x9b8b78, 0x8a9297,
  0xd0c2ad, 0x777f87
].map(c => material(c));

const windowsMat = new THREE.MeshStandardMaterial({
  color: 0x9ddcff,
  emissive: 0x20384a,
  emissiveIntensity: 0.45
});

for (const side of [-1, 1]) {
  for (let i = 0; i < 45; i++) {
    const width = 4 + Math.random() * 5;
    const height = 7 + Math.random() * 19;
    const depth = 5 + Math.random() * 5;
    const z = 18 - i * 10;

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      buildingMats[
        Math.floor(Math.random() * buildingMats.length)
      ]
    );

    building.position.set(
      side * (9 + width / 2 + Math.random() * 5),
      height / 2,
      z
    );

    building.castShadow = true;
    scene.add(building);
    buildings.push(building);

    for (let y = 1.5; y < height - 1; y += 2.5) {
      for (
        let wx = -width / 2 + 0.7;
        wx < width / 2 - 0.4;
        wx += 1.3
      ) {
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(0.45, 0.65),
          windowsMat
        );

        win.position.set(
          building.position.x - side * (width / 2 + 0.012),
          y,
          z + wx
        );

        win.rotation.y =
          side === 1 ? Math.PI / 2 : -Math.PI / 2;

        scene.add(win);
      }
    }
  }
}

// أهرامات مصر في الأفق
for (let i = 0; i < 3; i++) {
  const pyramid = new THREE.Mesh(
    new THREE.ConeGeometry(10 - i, 15 - i, 4),
    material(0xa28b70)
  );

  pyramid.rotation.y = Math.PI / 4;
  pyramid.position.set(-30 + i * 16, 7, -150 - i * 4);
  scene.add(pyramid);
}

// إنشاء عربية ثلاثية الأبعاد
function makeCar(color = 0xe51c2a) {
  const car = new THREE.Group();

  const paint = material(color, 0.25, 0.45);
  const glass = material(0x19364a, 0.2, 0.3);
  const tire = material(0x101216, 0.9);
  const chrome = material(0xb8c3ca, 0.25, 0.7);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.58, 3.7),
    paint
  );
  body.position.y = 0.7;
  car.add(body);

  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.2, 1.1),
    paint
  );
  hood.position.set(0, 0.95, -1.25);
  car.add(hood);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.62, 1.55),
    glass
  );
  cabin.position.set(0, 1.18, 0.1);
  car.add(cabin);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.12, 0.9),
    paint
  );
  roof.position.set(0, 1.53, 0.1);
  car.add(roof);

  for (const x of [-0.98, 0.98]) {
    for (const z of [-1.15, 1.15]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.24, 18),
        tire
      );

      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.4, z);
      car.add(wheel);

      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.17, 0.25, 12),
        chrome
      );

      hub.rotation.z = Math.PI / 2;
      hub.position.copy(wheel.position);
      car.add(hub);
    }
  }

  for (const x of [-0.58, 0.58]) {
    const headlight = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.13, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xe2faff })
    );

    headlight.position.set(x, 0.82, -1.88);
    car.add(headlight);

    const tail = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.13, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xff1525 })
    );

    tail.position.set(x, 0.82, 1.88);
    car.add(tail);
  }

  car.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return car;
}

const player = makeCar(0xe7e7e7);
player.position.set(0, 0, 3);
scene.add(player);

const traffic = [];
const coins = [];
const keys = {};

let running = false;
let speed = 0;
let score = 0;
let coinCount = 0;
let trafficTimer = 0;
let coinTimer = 0;

function showMessage(text) {
  const el = $('message');
  if (!el) return;

  el.textContent = text;

  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => {
    el.textContent = '';
  }, 1000);
}

function spawnTraffic() {
  const lane = [-4.5, 0, 4.5][
    Math.floor(Math.random() * 3)
  ];

  const colors = [
    0x1674c7, 0xf0eee6, 0x20242b,
    0xe5a321, 0x9c202a
  ];

  const car = makeCar(
    colors[Math.floor(Math.random() * colors.length)]
  );

  car.scale.setScalar(0.85);
  car.position.set(lane, 0, -125);
  scene.add(car);
  traffic.push(car);
}

function spawnCoin() {
  const coin = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.12, 10, 20),
    new THREE.MeshStandardMaterial({
      color: 0xffc62e,
      metalness: 0.6,
      roughness: 0.25
    })
  );

  coin.position.set(
    [-4.5, 0, 4.5][Math.floor(Math.random() * 3)],
    1.1,
    -115
  );

  scene.add(coin);
  coins.push(coin);
}

// التحكم بأزرار الموبايل
function bindHold(id, key) {
  const button = $(id);
  if (!button) return;

  button.addEventListener('pointerdown', e => {
    e.preventDefault();
    keys[key] = true;

    if (button.setPointerCapture) {
      button.setPointerCapture(e.pointerId);
    }
  });

  for (const eventName of [
    'pointerup',
    'pointercancel',
    'lostpointercapture'
  ]) {
    button.addEventListener(eventName, () => {
      keys[key] = false;
    });
  }
}

bindHold('left', 'left');
bindHold('right', 'right');
bindHold('gas', 'gas');
bindHold('brake', 'brake');
bindHold('nitro', 'nitro');

addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.code === 'Space') keys.nitro = true;
});

addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
  if (e.code === 'Space') keys.nitro = false;
});

$('startBtn').addEventListener('click', () => {
  $('start').style.display = 'none';
  running = true;
  showMessage('يلا بينا يا بطل!');
});

function resetGame() {
  traffic.forEach(car => scene.remove(car));
  coins.forEach(coin => scene.remove(coin));

  traffic.length = 0;
  coins.length = 0;

  player.position.x = 0;
  speed = 0;
  score = 0;
  coinCount = 0;

  $('score').textContent = '0';
  $('coins').textContent = '0';
  $('start').style.display = 'none';
  running = true;
}

function endGame() {
  running = false;
  speed = 0;
  $('start').style.display = 'grid';
  $('startBtn').textContent = 'العب من جديد 🏁';
  showMessage('خبطت! حاول تاني');
}

// حلقة تشغيل اللعبة
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.04);
  lastTime = now;

  if (running) {
    const boosting = keys.nitro;
    const targetSpeed =
      keys.brake || keys.arrowdown || keys.s ? 5 :
      keys.gas || keys.arrowup || keys.w ? 38 : 20;

    const desired = targetSpeed * (boosting ? 1.65 : 1);
    speed += (desired - speed) * dt * 1.7;

    const left = keys.left || keys.arrowleft || keys.a;
    const right = keys.right || keys.arrowright || keys.d;
    const steering = (right ? 1 : 0) - (left ? 1 : 0);

    player.position.x = THREE.MathUtils.clamp(
      player.position.x + steering * dt * (3.4 + speed * 0.11),
      -5.1,
      5.1
    );

    player.rotation.z = -steering * 0.055;
    player.rotation.y = -steering * 0.06;

    const movement = speed * dt * 0.75;

    laneDashes.forEach(dash => {
      dash.position.z += movement;
      if (dash.position.z > 25) dash.position.z -= 475;
    });

    buildings.forEach(building => {
      building.position.z += movement;
      if (building.position.z > 35) building.position.z -= 450;
    });

    trafficTimer += dt;
    coinTimer += dt;

    if (trafficTimer > 1.65) {
      trafficTimer = 0;
      spawnTraffic();
    }

    if (coinTimer > 2.5) {
      coinTimer = 0;
      spawnCoin();
    }

    for (let i = traffic.length - 1; i >= 0; i--) {
      const car = traffic[i];
      car.position.z += movement * 0.9;

      if (car.position.z > 16) {
        scene.remove(car);
        traffic.splice(i, 1);
        score += 10;
      } else if (
        Math.abs(car.position.z - player.position.z) < 2.3 &&
        Math.abs(car.position.x - player.position.x) < 1.5
      ) {
        endGame();
        break;
      }
    }

    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      coin.position.z += movement * 0.9;
      coin.rotation.z += dt * 2;

      if (coin.position.z > 16) {
        scene.remove(coin);
        coins.splice(i, 1);
      } else if (
        Math.abs(coin.position.z - player.position.z) < 2 &&
        Math.abs(coin.position.x - player.position.x) < 1.4
      ) {
        scene.remove(coin);
        coins.splice(i, 1);
        coinCount++;
        score += 50;
        $('coins').textContent = coinCount;
        showMessage('+50 🪙');
      }
    }

    $('score').textContent = Math.floor(score);
    $('speed').textContent = Math.floor(speed * 3.2);
  }

  camera.position.x +=
    (player.position.x * 0.25 - camera.position.x) * dt * 2;

  camera.lookAt(player.position.x * 0.18, 1, -7);
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});