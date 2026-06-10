const root = document.documentElement;
const body = document.body;
const segmentCount = 20;
const angles = Array.from({ length: segmentCount }, () => 0);
const points = Array.from({ length: segmentCount }, () => ({ x: 0, y: 0 }));

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let lastPointerX = pointerX;
let lastPointerY = pointerY;
let lastPointerTime = performance.now();
let targetAngle = 0;
let latestSpeed = 0;
let displaySpeed = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shortestAngleDelta(target, current) {
  return ((((target - current) % 360) + 540) % 360) - 180;
}

function getSegmentSpacing() {
  if (window.matchMedia("(max-height: 680px), (max-width: 520px)").matches) {
    return 22;
  }

  return 28;
}

function angleToPointer(x, y) {
  const baseX = window.innerWidth / 2;
  const baseY = window.innerHeight;
  const dx = x - baseX;
  const dy = baseY - y;

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return 0;
  }

  return Math.atan2(dx, Math.max(dy, 0)) * (180 / Math.PI);
}

function updatePointer(x, y) {
  const now = performance.now();
  const elapsed = Math.max(now - lastPointerTime, 16);
  const dx = x - lastPointerX;
  const dy = y - lastPointerY;
  const distance = Math.hypot(dx, dy);

  pointerX = x;
  pointerY = y;
  targetAngle = angleToPointer(pointerX, pointerY);
  latestSpeed = clamp((distance / elapsed) * 100, 0, 520);

  lastPointerX = x;
  lastPointerY = y;
  lastPointerTime = now;
}

function updateChain() {
  const spacing = getSegmentSpacing();

  angles[0] = targetAngle;
  points[0].x = 0;
  points[0].y = 0;

  for (let index = 1; index < segmentCount; index += 1) {
    const stiffness = clamp(0.31 - index * 0.006, 0.18, 0.31);
    angles[index] += shortestAngleDelta(angles[index - 1], angles[index]) * stiffness;

    const previousRadians = angles[index - 1] * (Math.PI / 180);
    points[index].x = points[index - 1].x + Math.sin(previousRadians) * spacing;
    points[index].y = points[index - 1].y - Math.cos(previousRadians) * spacing;
  }

  displaySpeed += (latestSpeed - displaySpeed) * 0.22;
  latestSpeed *= 0.86;

  root.style.setProperty("--shake", `${(displaySpeed / 55).toFixed(2)}px`);
  root.style.setProperty("--shake-left", `${(-displaySpeed / 70).toFixed(2)}px`);
  root.style.setProperty("--shake-up", `${(-displaySpeed / 95).toFixed(2)}px`);
  root.style.setProperty("--shake-soft", `${(displaySpeed / 125).toFixed(2)}px`);
  body.classList.toggle("is-frantic", displaySpeed > 190);

  for (let index = 0; index < segmentCount; index += 1) {
    root.style.setProperty(`--x-${index}`, `${points[index].x.toFixed(2)}px`);
    root.style.setProperty(`--y-${index}`, `${points[index].y.toFixed(2)}px`);
    root.style.setProperty(`--a-${index}`, `${angles[index].toFixed(2)}deg`);
  }

  requestAnimationFrame(updateChain);
}

window.addEventListener("pointermove", (event) => {
  updatePointer(event.clientX, event.clientY);
});

window.addEventListener("pointerleave", () => {
  body.classList.remove("is-frantic");
});

window.addEventListener("resize", () => {
  targetAngle = angleToPointer(pointerX, pointerY);
});

updatePointer(pointerX, pointerY);
requestAnimationFrame(updateChain);
