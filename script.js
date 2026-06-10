const root = document.documentElement;
const body = document.body;

let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let lastTime = performance.now();
let pendingPointer = { x: lastX, y: lastY };
let rafId = 0;
let franticTimer = 0;

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
  const speed = clamp((Math.hypot(dx, dy) / elapsed) * 100, 0, 520);
  const baseX = window.innerWidth / 2;
  const baseY = window.innerHeight;
  const aimX = x - baseX;
  const aimY = Math.max(baseY - y, 1);
  const angle = Math.atan2(aimX, aimY) * (180 / Math.PI);
  const attention = clamp(aimY / (window.innerHeight * 0.55), 0.3, 1);
  const bend = clamp(aimX * 0.46 * attention, -320, 320);

  root.style.setProperty("--aim-angle", `${angle.toFixed(2)}deg`);
  root.style.setProperty("--bend", `${bend.toFixed(2)}px`);
  root.style.setProperty("--shake", `${(speed / 55).toFixed(2)}px`);
  root.style.setProperty("--shake-left", `${(-speed / 70).toFixed(2)}px`);
  root.style.setProperty("--shake-up", `${(-speed / 95).toFixed(2)}px`);
  root.style.setProperty("--shake-soft", `${(speed / 125).toFixed(2)}px`);

  if (speed > 190) {
    body.classList.add("is-frantic");
    clearTimeout(franticTimer);
    franticTimer = setTimeout(() => body.classList.remove("is-frantic"), 140);
  }

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
