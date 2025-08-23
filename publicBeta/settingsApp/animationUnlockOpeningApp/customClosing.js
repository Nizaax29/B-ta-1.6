const timeTransformClosinginput = document.getElementById(
  "timeTransformClosing"
);
const timeTransformClosingVal = document.getElementById(
  "timeTransformClosingVal"
);

timeTransformClosinginput.value =
  parseFloat(localStorage.getItem("timeTransformClosing")) || 0.5;
timeTransformClosingVal.textContent =
  parseFloat(localStorage.getItem("timeTransformClosing")) || 0.5;
timeTransformClosinginput.addEventListener("input", (e) => {
  const time = parseFloat(e.target.value);
  timeTransformClosing = time * currentSpeed;

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    if (loopTransformClosing)
      previewTransformClosing.classList.add("animation");
    else previewTransformClosing.classList.remove("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  timeTransformClosingVal.textContent = time;
  localStorage.setItem("timeTransformClosing", time);
});

const previewTransformClosing = document.getElementById(
  "previewTransformClosing"
);

let loopTransformClosing = true;

previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
let idLoopTransformClosing = setInterval(() => {
  if (loopTransformClosing) previewTransformClosing.classList.add("animation");
  else previewTransformClosing.classList.remove("animation");
  loopTransformClosing = !loopTransformClosing;
}, timeTransformClosing * 1000);

//damping

const dampingTransformClosinginput = document.getElementById(
  "dampingTransformClosing"
);
const dampingTransformClosingVal = document.getElementById(
  "dampingTransformClosingVal"
);

dampingTransformClosinginput.value =
  parseFloat(localStorage.getItem("dampingTransformClosing")) || 0;
dampingTransformClosingVal.textContent =
  parseFloat(localStorage.getItem("dampingTransformClosing")) || 0;

dampingTransformClosinginput.addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);

  cubicTransformClosing = `cubic-bezier(.25,.1,${
    parseFloat(localStorage.getItem("easingScaleClosing")) || 0.25
  },${1 + val})`;

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    if (loopTransformClosing)
      previewTransformClosing.classList.add("animation");
    else previewTransformClosing.classList.remove("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  dampingTransformClosingVal.textContent = val;
  localStorage.setItem("dampingTransformClosing", val);
});

const reset_anim_close_app_btn = document.getElementById(
  "reset_anim_close_app_btn"
);
reset_anim_close_app_btn.addEventListener(
  "click",
  resetBtnClosingAppAnimCustom
);
function resetBtnClosingAppAnimCustom() {
  const valTimeTransform = 0.5;
  timeTransformClosing = valTimeTransform * currentSpeed;
  timeTransformClosingVal.textContent = valTimeTransform;
  timeTransformClosinginput.value = valTimeTransform;

  const valDampingTransform = 0;
  cubicTransformClosing = `cubic-bezier(.25,.1,.25,${1 + valDampingTransform})`;
  dampingTransformClosinginput.value = valDampingTransform;
  dampingTransformClosingVal.textContent = valDampingTransform;

  localStorage.setItem("timeTransformClosing", valTimeTransform);
  localStorage.setItem("dampingTransformClosing", valDampingTransform);

  clearInterval(idLoopTransformClosing);
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;
  idLoopTransformClosing = setInterval(() => {
    if (loopTransformClosing)
      previewTransformClosing.classList.add("animation");
    else previewTransformClosing.classList.remove("animation");
    loopTransformClosing = !loopTransformClosing;
  }, timeTransformClosing * 1000);

  //scale
  const time = 0.5;
  timeScaleClosing = time * currentSpeed;
  timeScaleClosingVal.textContent = time;
  timeScaleClosinginput.value = time;

  const valScaleClosing = 0;
  cubicScaleClosing = `cubic-bezier(.25,.1,.25,${1 + valScaleClosing})`;
  dampingScaleClosinginput.value = valScaleClosing;
  dampingScaleClosingVal.textContent = valScaleClosing;

  localStorage.setItem("timeScaleClosing", time);
  localStorage.setItem("dampingScaleClosing", valScaleClosing);

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  idLoopScaleClosing = setInterval(() => {
    if (loopScaleClosing) previewScaleClosing.classList.add("animation");
    else previewScaleClosing.classList.remove("animation");
    loopScaleClosing = !loopScaleClosing;
  }, timeScaleClosing * 1000);

  // easing

  const valeasing = 0.25;
  easingScaleClosinginput.value = 0.75;

  cubicScaleClosing = `cubic-bezier(.25,.1,${valeasing},${
    1 + (parseFloat(localStorage.getItem("dampingScaleClosing")) || 0)
  })`;

  cubicTransformClosing = `cubic-bezier(.25,.1,${valeasing},${
    1 + (parseFloat(localStorage.getItem("dampingTransformClosing")) || 0)
  })`;

  clearInterval(idLoopScaleClosing);
  previewScaleClosing.style.transition = `all ${timeScaleClosing}s ${cubicScaleClosing}`;
  previewTransformClosing.style.transition = `all ${timeTransformClosing}s ${cubicTransformClosing}`;

  idLoopScaleClosing = setInterval(() => {
    if (loopScaleClosing) previewScaleClosing.classList.add("animation");
    else previewScaleClosing.classList.remove("animation");
    loopScaleClosing = !loopScaleClosing;
  }, (timeScaleClosing + 0.1) * 1000);

  easingScaleClosingVal.textContent = 0.75;
  localStorage.setItem("easingScaleClosing", valeasing.toFixed(2));
}
