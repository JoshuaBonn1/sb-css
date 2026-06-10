const root = document.documentElement;
const body = document.body;
const topSegmentIndex = 19;

let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let lastTime = performance.now();
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
  const maxBend = Math.min(window.innerWidth * 0.32, 360);
  const verticalAttention = clamp((window.innerHeight - y) / (window.innerHeight * 0.55), 0.35, 1);
  const headOffset = clamp((x - window.innerWidth / 2) * 0.55 * verticalAttention, -maxBend, maxBend);
  const visualHeight = window.innerHeight * 0.42;
  const angle = Math.atan2(headOffset, visualHeight) * (180 / Math.PI);

  for (let index = 0; index <= topSegmentIndex; index += 1) {
    const progress = index / topSegmentIndex;
    root.style.setProperty(`--x-${index}`, `${(headOffset * progress).toFixed(2)}px`);
  }

  root.style.setProperty("--speed", speed.toFixed(2));
  root.style.setProperty("--eel-angle", `${angle.toFixed(2)}deg`);
  root.style.setProperty("--shake", `${(speed / 55).toFixed(2)}px`);
  root.style.setProperty("--shake-left", `${(-speed / 70).toFixed(2)}px`);
  root.style.setProperty("--shake-up", `${(-speed / 95).toFixed(2)}px`);
  root.style.setProperty("--shake-soft", `${(speed / 125).toFixed(2)}px`);

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

window.addEventListener("resize", () => {
  queuePointerUpdate(lastX, lastY);
});

queuePointerUpdate(lastX, lastY);
