const root = document.documentElement;
const body = document.body;

let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let lastTime = performance.now();
let lastAngle = 0;
let rafId = 0;
let pendingPointer = { x: lastX, y: lastY };

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function paintPointer() {
  rafId = 0;

  const { x, y } = pendingPointer;
  const now = performance.now();
  const elapsed = Math.max(now - lastTime, 16);
  const dx = x - lastX;
  const dy = y - lastY;
  const distance = Math.hypot(dx, dy);
  const speed = clamp((distance / elapsed) * 100, 0, 520);

  if (distance > 0.1) {
    lastAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  }

  root.style.setProperty("--mouse-x", `${x}px`);
  root.style.setProperty("--mouse-y", `${y}px`);
  root.style.setProperty("--speed", speed.toFixed(2));
  root.style.setProperty("--tilt", `${lastAngle.toFixed(2)}deg`);
  root.style.setProperty("--shake", `${(speed / 55).toFixed(2)}px`);
  root.style.setProperty("--scale", (1 + speed / 1600).toFixed(3));
  root.style.setProperty("--eye-x", `${clamp(dx / 22, -7, 7).toFixed(2)}px`);
  root.style.setProperty("--eye-y", `${clamp(dy / 22, -6, 6).toFixed(2)}px`);

  body.classList.toggle("is-frantic", speed > 190);

  lastX = x;
  lastY = y;
  lastTime = now;
}

function queuePointerUpdate(x, y) {
  pendingPointer = { x, y };

  if (!rafId) {
    rafId = requestAnimationFrame(paintPointer);
  }
}

window.addEventListener("pointermove", (event) => {
  queuePointerUpdate(event.clientX, event.clientY);
});

window.addEventListener("pointerleave", () => {
  body.classList.remove("is-frantic");
});

queuePointerUpdate(lastX, lastY);
