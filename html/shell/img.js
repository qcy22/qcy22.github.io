// 图像处理相关功能
const imageStore = {};

// 图像上传处理
document.getElementById('imageUploader').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const ascii = imageToAscii(img);
            const filename = file.name;
            imageStore[filename] = ascii;

            const uploadMsg = document.createElement('div');
            uploadMsg.className = 'cmd-info';
            uploadMsg.textContent = `Uploaded image: ${filename}`;
            shell.appendChild(uploadMsg);

            const spacer = document.createElement('div');
            spacer.style.marginBottom = '10px';
            shell.appendChild(spacer);

            shell.scrollTop = shell.scrollHeight;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// 像素画转换函数
function imageToAscii(image, maxWidth = 120, maxHeight = 60) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const aspect = image.width / image.height;
    let width = maxWidth;
    let height = Math.floor(maxWidth / aspect / 2); // 字符宽高比补偿

    if (height > maxHeight) {
        height = maxHeight;
        width = Math.floor(maxHeight * aspect * 2);
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    const chars = '@%#*+=:. '; // 从密到疏
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let ascii = '';

    const boost = 1.25;
    const fontSize = 8;
    const fontWeight = 'normal';
    const letterSpacing = '0px';

    for (let y = 0; y < height; y++) {
        let line = '';
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
            const char = chars[charIndex] || ' ';
            const colorBoost = 1.5;
            const rr = Math.min(255, r * colorBoost);
            const gg = Math.min(255, g * colorBoost);
            const bb = Math.min(255, b * colorBoost);
            line += `<span style="
                            color: rgb(${rr},${gg},${bb});
                            font-size: ${fontSize}px;
                            font-weight: ${fontWeight};
                            letter-spacing: ${letterSpacing};
                        ">${char}</span>`;
        }
        ascii += line + '<br/>';
    }

    return ascii;
}