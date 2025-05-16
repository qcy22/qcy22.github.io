// 动画相关功能
function startDonutAnimation(durationInSeconds = 5) {
    const width = 80;
    const height = 24;
    const frameRate = 50;

    let A = 0;
    let B = 0;
    let intervalId;

    const luminanceChars = '.,-~:;=!*#$@';
    const donutContainer = document.createElement('pre');
    donutContainer.style.color = '#0ff';
    donutContainer.style.fontFamily = 'monospace';
    donutContainer.style.marginBottom = '20px';
    donutContainer.style.whiteSpace = 'pre';
    shell.appendChild(donutContainer);

    function renderFrame() {
        const z = Array(width * height * 4).fill(0);
        const b = Array(width * height).fill(' ');

        for (let j = 0; j < 6.28; j += 0.07) {
            for (let i = 0; i < 6.28; i += 0.02) {
                const sinA = Math.sin(A), cosA = Math.cos(A);
                const sinB = Math.sin(B), cosB = Math.cos(B);
                const sini = Math.sin(i), cosi = Math.cos(i);
                const cosj = Math.cos(j), sinj = Math.sin(j);

                const cosj2 = cosj + 2;
                const mess = 1 / (sini * cosj2 * sinA + sinj * cosA + 5);
                const t = sini * cosj2 * cosA - sinj * sinA;

                const x = Math.floor(width / 2 + 30 * mess * (cosi * cosj2 * cosB - t * sinB));
                const y = Math.floor(height / 2 + 15 * mess * (cosi * cosj2 * sinB + t * cosB));
                const o = x + width * y;

                const N = Math.floor(8 * ((sinj * sinA - sini * cosj * cosA) * cosB - sini * cosj * sinA - sinj * cosA - cosi * cosj * sinB));

                if (y >= 0 && y < height && x >= 0 && x < width && z[o] < mess) {
                    z[o] = mess;
                    b[o] = luminanceChars[Math.max(0, N)];
                }
            }
        }

        let frame = '';
        for (let i = 0; i < b.length; i++) {
            frame += b[i];
            if ((i + 1) % width === 0) frame += '\n';
        }

        donutContainer.innerText = frame;
        A += 0.04;
        B += 0.02;
    }

    intervalId = setInterval(renderFrame, frameRate);

    setTimeout(() => {
        clearInterval(intervalId);

        // Append the completion message
        const endMsgDiv = document.createElement('div');
        endMsgDiv.className = 'cmd-info';
        endMsgDiv.textContent = `Donut animation ended after ${durationInSeconds}s 🎉`;
        shell.appendChild(endMsgDiv);

        // Append the spacer
        const spacerDiv = document.createElement('div');
        spacerDiv.style.marginBottom = '15px';
        shell.appendChild(spacerDiv);

        shell.scrollTop = shell.scrollHeight;
    }, durationInSeconds * 1000);
}