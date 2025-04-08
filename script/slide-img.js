const container = document.getElementById('compareContainer');
const slider = document.getElementById('slider');
const afterImg = document.getElementById('afterImg');

let isDragging = false;

const setSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let offset = x - rect.left;
    offset = Math.max(0, Math.min(offset, rect.width));
    const percent = (offset / rect.width) * 100;
    slider.style.left = `${percent}%`;
    afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
};

const startDrag = (e) => {
    isDragging = true;
    setSlider(e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX);
};

const stopDrag = () => {
    isDragging = false;
};

const onDrag = (e) => {
    if (!isDragging) return;
    setSlider(e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX);
};

slider.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', onDrag);
document.addEventListener('mouseup', stopDrag);

slider.addEventListener('touchstart', startDrag);
document.addEventListener('touchmove', onDrag);
document.addEventListener('touchend', stopDrag);