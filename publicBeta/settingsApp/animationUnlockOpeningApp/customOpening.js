const previewAspect = document.getElementById("previewAspect");
const previewAll = document.getElementById("previewAll");
const timeAllInput = document.getElementById("timeAll");
const timeAllVal = document.getElementById("timeAllVal");

function saveSettings() {
  localStorage.setItem("time_all", time_all);
  localStorage.setItem("cubic_ratio", cubic_ratio);
  localStorage.setItem("cubic_all", cubic_all);
}

function updatePreviewTransition() {
  previewAspect.style.transition = `all ${time_all}s ${cubic_ratio}`;
  previewAll.style.transition = `all ${time_all}s ${cubic_all}`;
}

function setCustomCubic(x1, y1, x2, y2, typeCubic) {
  const cubic = `cubic-bezier(${x1},${y1},${x2},${y2})`;
  if (typeCubic === "ratio") {
    cubic_ratio = cubic;
  } else {
    cubic_all = cubic;
  }
  saveSettings();
  updatePreviewTransition();
}

function parseCubic(cubicStr) {
  const match = cubicStr.match(/cubic-bezier\(([^)]+)\)/);
  if (!match) return null;
  const nums = match[1].split(",").map((n) => parseFloat(n));
  return {
    p1: { x: nums[0], y: 1 - nums[1] },
    p2: { x: nums[2], y: 1 - nums[3] },
  };
}

function initBezier(sectionId, isRatio, cubicInit) {
  const section = document.getElementById(sectionId);
  const canvas = section.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const handles = section.querySelectorAll(".handle");
  const cubicLabel = section.querySelector("span[id^=cubic]");

  let points = parseCubic(cubicInit);
  if (!points) {
    points = isRatio
      ? { p1: { x: 0.07, y: 0.26 }, p2: { x: 0.37, y: 0.02 } }
      : { p1: { x: 0.25, y: 0.9 }, p2: { x: 0.75, y: 0.0 } };
  }

  function drawBezier() {
    ctx.clearRect(0, 0, 300, 300);
    ctx.strokeStyle = "#777";
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(points.p1.x * 300, points.p1.y * 300);
    ctx.lineTo(points.p2.x * 300, points.p2.y * 300);
    ctx.lineTo(300, 0);
    ctx.stroke();

    ctx.strokeStyle = "#ff9800";
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.bezierCurveTo(
      points.p1.x * 300,
      points.p1.y * 300,
      points.p2.x * 300,
      points.p2.y * 300,
      300,
      0
    );
    ctx.stroke();

    const cubicText = `${points.p1.x.toFixed(2)}, ${(1 - points.p1.y).toFixed(
      2
    )}, ${points.p2.x.toFixed(2)}, ${(1 - points.p2.y).toFixed(2)}`;
    cubicLabel.textContent = cubicText;

    setCustomCubic(
      points.p1.x.toFixed(2),
      (1 - points.p1.y).toFixed(2),
      points.p2.x.toFixed(2),
      (1 - points.p2.y).toFixed(2),
      isRatio ? "ratio" : "all"
    );
  }

  function setHandlePosition(handle, point) {
    handle.style.left = point.x * 300 + "px";
    handle.style.top = point.y * 300 + "px";
  }

  function startDrag(handle, pointName) {
    const move = (e) => {
      let rect = canvas.getBoundingClientRect();
      let x =
        ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) / 300;
      let y = ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top) / 300;
      points[pointName].x = Math.min(Math.max(x, 0), 1);
      points[pointName].y = Math.min(Math.max(y, 0), 1);
      setHandlePosition(handle, points[pointName]);
      drawBezier();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
  }

  handles.forEach((h, i) => {
    let name = i === 0 ? "p1" : "p2";
    h.addEventListener("mousedown", () => startDrag(h, name));
    h.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startDrag(h, name);
    });
  });

  setHandlePosition(handles[0], points.p1);
  setHandlePosition(handles[1], points.p2);
  drawBezier();
}

// Sự kiện thay đổi time_all
timeAllInput.value = time_all;
timeAllVal.textContent = time_all;
timeAllInput.addEventListener("input", (e) => {
  time_all = parseFloat(e.target.value);
  time_opening_app = time_all * currentSpeed;
  time_aspect_ratio_app = time_all * currentSpeed * 0.9;

  timeAllVal.textContent = time_all;
  saveSettings();
  updatePreviewTransition();
});

// Khởi tạo
updatePreviewTransition();
initBezier("section-aspect", true, cubic_ratio);
initBezier("section-all", false, cubic_all);

// Animation loop preview
let toggle = true;
setInterval(() => {
  previewAspect.style.aspectRatio = toggle ? "1 / 1" : "1 /2";
  previewAspect.style.width = "110px";
  previewAll.style.transform = toggle ? "scale(0.5)" : "scale(1.2)";
  toggle = !toggle;
}, 1000);

const scaleWallpaperAniminput = document.getElementById("scaleWallpaperAnim");
const scaleWallpaperAnimVal = document.getElementById("scaleWallpaperAnimVal");

scaleWallpaperAniminput.value =
  parseFloat(localStorage.getItem("scaleWallpaperAnim")) || 110;
scaleWallpaperAnimVal.textContent =
  parseFloat(localStorage.getItem("scaleWallpaperAnim")) || 110;
document.getElementById("wallpaperPreviewAnim").style.scale = `${
  parseFloat(localStorage.getItem("scaleWallpaperAnim")) || 110
}%`;

function scaleWallpaperAnimEvent(e) {
  const val = parseFloat(e.target.value);

  document.getElementById("wallpaperPreviewAnim").style.scale = `${val}%`;
  scaleWallpaper = val;

  scaleWallpaperAnimVal.textContent = val;
  localStorage.setItem("scaleWallpaperAnim", val);
}

const scaleAllAppinput = document.getElementById("scaleAllAppAnim");
const scaleAllAppVal = document.getElementById("scaleAllAppVal");

scaleAllAppinput.value = parseFloat(localStorage.getItem("scaleAllApp")) || 86;
scaleAllAppVal.textContent =
  parseFloat(localStorage.getItem("scaleAllApp")) || 86;
document.getElementById("scaleAllAppPreivew").style.scale = `${
  parseFloat(localStorage.getItem("scaleAllApp")) || 86
}%`;

function scaleAllAppEvent(e) {
  const val = parseFloat(e.target.value);

  document.getElementById("scaleAllAppPreivew").style.scale = `${val}%`;

  scaleAllApp = val;
  scaleAllAppReverse = 100 / val;

  scaleAllAppVal.textContent = val;
  localStorage.setItem("scaleAllApp", val);
}
function scaleAllAppEventUp() {
  if (currentOpeningBtn) {
    currentOpeningBtn.style.transition = "none";
    allApp.style.transition = "none";
    currentOpeningBtn.style.transform = `scale(${scaleAllAppReverse})`;
    allApp.style.scale = `${scaleAllApp}%`;
    lp.style.scale = `${scaleAllAppReverse}`;
  }
}

const blurAllAppinput = document.getElementById("blurAllAppAnim");
const blurAllAppVal = document.getElementById("blurAllAppVal");

blurAllAppinput.value = localStorage.getItem("blurAllApp") || 20;
blurAllAppVal.textContent = localStorage.getItem("blurAllApp") || 20;
document.getElementById("blurAllAppPreivew").style.filter = `blur(calc(${
  localStorage.getItem("blurAllApp") || 20
}px - ${localStorage.getItem("blurAllApp") || 20}px / 2))`;

function blurAllAppEvent(e) {
  const val = parseFloat(e.target.value);

  document.getElementById(
    "blurAllAppPreivew"
  ).style.filter = `blur(calc(${val}px - ${val}px / 2))`;

  blurCustomOpeing = val;
  if (localStorage.getItem("blur_App_saved"))
    lp.style.filter = `blur(${blurCustomOpeing}px)`;

  blurAllAppVal.textContent = val;
  localStorage.setItem("blurAllApp", val);
}

function updateBezierGraphs() {
  initBezier("section-aspect", true, cubic_ratio);
  initBezier("section-all", false, cubic_all);
}

const previewPositionIcon = document.getElementById("previewPositionIcon");
function itemScrollIconPositionEvent(e) {
  const item = e.currentTarget;
  const size = item.getAttribute("data-sizeIcon");
  const position = item.getAttribute("data-positionIcon");
  document.querySelectorAll(".itemScrollIconPosition").forEach((el) => {
    el.classList.remove("active");
  });
  item.classList.add("active");

  document.querySelectorAll(".box").forEach((box) => {
    box.style.setProperty("--bg--sizeIcon", size);
    box.style.setProperty("--bg--positionIcon", position);
  });
  previewPositionIcon.style.setProperty("--bg--sizeIcon", size);
  previewPositionIcon.style.setProperty("--bg--positionIcon", position);

  localStorage.setItem("sizeIcon", size);
  localStorage.setItem("positionIcon", position);
}

const timeHidingIcon = document.getElementById("timeHidingIcon");
const timeHidingIconVal = document.getElementById("timeHidingIconVal");

const delayHidingIcon = document.getElementById("delayHidingIcon");
const delayHidingIconVal = document.getElementById("delayHidingIconVal");

// Hàm riêng cho time
function updateTimeHidingIcon() {
  const val = parseFloat(timeHidingIcon.value).toFixed(2);
  timeHidingIconVal.textContent = val;
  root.style.setProperty("--bg--timeHidingIcon", `${val * currentSpeed}s`);
  localStorage.setItem("timeHidingIcon", `${val}`);
}

// Hàm riêng cho delay
function updateDelayHidingIcon() {
  const val = parseFloat(delayHidingIcon.value).toFixed(2);
  delayHidingIconVal.textContent = val;
  root.style.setProperty("--bg--delayHidingIcon", `${val * currentSpeed}s`);
  localStorage.setItem("delayHidingIcon", `${val}`);
}

function resetAnimOpenAppBtnEvent(e) {
  time_all = 0.5;
  time_opening_app = time_all * currentSpeed;
  time_aspect_ratio_app = time_all * currentSpeed * 0.9;
  cubic_ratio = "cubic-bezier(0.05,0.55,0.2,0.95)";
  cubic_all = "cubic-bezier(0.15,0.45,0.45,0.85)";

  saveSettings();

  // Cập nhật UI
  document.getElementById("timeAll").value = time_all;
  document.getElementById("timeAllVal").textContent = time_all;

  // Cập nhật đồ thị cubic
  updatePreviewTransition(true); // truyền true để ép update đồ thị theo cubic mới
  updateBezierGraphs(); // gọi để vẽ lại đồ thị

  scaleAllAppinput.value = 86;
  scaleAllAppVal.textContent = 86;
  const valScaleApp = 86;
  document.getElementById("scaleAllAppPreivew").style.scale = `${valScaleApp}%`;
  scaleAllApp = valScaleApp;
  scaleAllAppReverse = 100 / valScaleApp;
  scaleAllAppVal.textContent = valScaleApp;
  localStorage.setItem("scaleAllApp", valScaleApp);

  if (currentOpeningBtn) {
    currentOpeningBtn.style.transition = "none";
    allApp.style.transition = "none";
    currentOpeningBtn.style.transform = `scale(${scaleAllAppReverse})`;
    allApp.style.scale = `${scaleAllApp}%`;
    lp.style.scale = `${scaleAllAppReverse}`;
  }

  scaleWallpaperAniminput.value = 110;
  scaleWallpaperAnimVal.textContent = 110;
  const valScaleWallpaper = 110;
  document.getElementById(
    "wallpaperPreviewAnim"
  ).style.scale = `${valScaleWallpaper}%`;
  scaleWallpaper = valScaleWallpaper;
  scaleWallpaperAnimVal.textContent = valScaleWallpaper;
  localStorage.setItem("scaleWallpaperAnim", valScaleWallpaper);
}

function addEventCustomOpening() {
  scaleWallpaperAniminput.addEventListener("input", scaleWallpaperAnimEvent);
  scaleAllAppinput.addEventListener("input", scaleAllAppEvent);
  scaleAllAppinput.addEventListener("pointerup", scaleAllAppEventUp);
  blurAllAppinput.addEventListener("input", blurAllAppEvent);

  document.querySelectorAll(".itemScrollIconPosition").forEach((item) => {
    item.addEventListener("click", itemScrollIconPositionEvent);
  });

  timeHidingIcon.addEventListener("input", updateTimeHidingIcon);
  delayHidingIcon.addEventListener("input", updateDelayHidingIcon);

  document
    .getElementById("reset_anim_open_app_btn")
    .addEventListener("click", resetAnimOpenAppBtnEvent);
}

function removeEventCustomOpening() {
  scaleWallpaperAniminput.removeEventListener("input", scaleWallpaperAnimEvent);
  scaleAllAppinput.removeEventListener("input", scaleAllAppEvent);
  scaleAllAppinput.removeEventListener("pointerup", scaleAllAppEventUp);
  blurAllAppinput.removeEventListener("input", blurAllAppEvent);

  document.querySelectorAll(".itemScrollIconPosition").forEach((item) => {
    item.removeEventListener("click", itemScrollIconPositionEvent);
  });

  timeHidingIcon.removeEventListener("input", updateTimeHidingIcon);
  delayHidingIcon.removeEventListener("input", updateDelayHidingIcon);

  document
    .getElementById("reset_anim_open_app_btn")
    .removeEventListener("click", resetAnimOpenAppBtnEvent);
}
