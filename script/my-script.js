const images = document.querySelectorAll('img');
const tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
document.body.appendChild(tooltip);

images.forEach(image => {
    image.addEventListener('mouseenter', function () {
        const tooltipText = this.dataset.tooltip;
        if (tooltipText) {
            tooltip.textContent = tooltipText;
            tooltip.style.display = 'block';
        }
    });

    image.addEventListener('mousemove', function (e) {
        const tooltipText = this.dataset.tooltip;
        if (tooltipText) {
            const x = e.pageX + 10;
            const y = e.pageY + 10;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        }
    });

    image.addEventListener('mouseleave', function () {
        tooltip.style.display = 'none';
    });
});