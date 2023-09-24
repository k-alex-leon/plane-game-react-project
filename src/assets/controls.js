export let controls = {};

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

window.addEventListener("keydown", (e) => {
  controls[e.key.toLocaleLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  controls[e.key.toLocaleLowerCase()] = false;
});

let maxVelocity = 0.04;
let jawVelocity = 0;
let pitchVelocity = 0;
let planeSpeed = 0.006;
export let turbo = 0;
export function updatePlaneAxis(x, y, z, planePosition, camera) {
  jawVelocity *= 0.95;
  pitchVelocity *= 0.95;

  if (Math.abs(jawVelocity) > maxVelocity) {
    jawVelocity = Math.sign(jawVelocity) * maxVelocity;
  }

  if (Math.abs(pitchVelocity) > maxVelocity) {
    pitchVelocity = Math.sign(pitchVelocity) * maxVelocity;
  }

  // up
  if (controls["w"]) {
    pitchVelocity -= 0.0025;
  }
  // left
  if (controls["a"]) {
    jawVelocity += 0.0025;
  }
  // down
  if (controls["s"]) {
    pitchVelocity += 0.0025;
  }
  // right
  if (controls["d"]) {
    jawVelocity -= 0.0025;
  }

  // restart
  if (controls["r"]) {
    jawVelocity = 0;
    pitchVelocity = 0;
    turbo = 0;
    x.set(1, 0, 0);
    y.set(0, 1, 0);
    z.set(0, 0, 1);
    planePosition.set(0, 3, 7);
  }

  x.applyAxisAngle(z, jawVelocity);
  y.applyAxisAngle(z, jawVelocity);
  y.applyAxisAngle(x, pitchVelocity);
  z.applyAxisAngle(x, pitchVelocity);

  x.normalize();
  y.normalize();
  z.normalize();

  // TURBO STUFF

  if (controls.shift) {
    turbo += 0.025;
  } else {
    turbo *= 0.95;
  }

  turbo = Math.min(Math.max(turbo, 0), 1);

  let turboSpeed = easeOutQuad(turbo) * 0.02;

  camera.fov = 45 + turboSpeed * 900;
  camera.updateProjectionMatrix();

  planePosition.add(z.clone().multiplyScalar(-planeSpeed - turboSpeed));
}
