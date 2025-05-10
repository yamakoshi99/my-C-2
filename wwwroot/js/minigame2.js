// マネーソーター：1-5歳向けコイン仕分けゲーム

document.addEventListener('DOMContentLoaded', function () {
    // コインデータ（色・サイズ・数字で区別）
    const coins = [
        { value: 1, label: "1円", color: "#b0b0b0", size: 140, textColor: "#333" },
        { value: 5, label: "5円", color: "#e0c15a", size: 150, textColor: "#7a5a00" },
        { value: 10, label: "10円", color: "#b87333", size: 160, textColor: "#fff" },
        { value: 100, label: "100円", color: "#a0c4d7", size: 170, textColor: "#222" }
    ];

    let score = 0;
    let time = 60;
    let currentCoin = null;
    let timerId = null;
    let isPlaying = true;

    const scoreSpan = document.getElementById('score');
    const timerSpan = document.getElementById('timer');
    const coinArea = document.getElementById('coin-area');
    const sortingBoxes = document.querySelectorAll('.sorting-box');

    // コインをランダム表示（SVGで色・サイズ・数字を区別）
    function showRandomCoin() {
        coinArea.innerHTML = '';
        const coin = coins[Math.floor(Math.random() * coins.length)];
        currentCoin = coin;
        const coinDiv = document.createElement('div');
        coinDiv.className = 'draggable-coin mx-auto mb-2';
        coinDiv.setAttribute('draggable', true);
        coinDiv.style.width = coin.size + 'px';
        coinDiv.style.height = coin.size + 'px';
        coinDiv.style.cursor = 'grab';
        coinDiv.style.userSelect = 'none';
        coinDiv.innerHTML = `
            <svg width="${coin.size}" height="${coin.size}" viewBox="0 0 ${coin.size} ${coin.size}">
                <circle cx="${coin.size/2}" cy="${coin.size/2}" r="${coin.size/2 - 8}" fill="${coin.color}" stroke="#888" stroke-width="8"/>
                <text x="50%" y="55%" text-anchor="middle" font-size="${coin.size/3}" fill="${coin.textColor}" font-weight="bold" dominant-baseline="middle">${coin.value}</text>
            </svg>
        `;
        coinDiv.dataset.value = coin.value;
        coinArea.appendChild(coinDiv);

        // ドラッグイベント
        coinDiv.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', coin.value);
            setTimeout(() => coinDiv.style.visibility = 'hidden', 0);
        });
        coinDiv.addEventListener('dragend', function () {
            coinDiv.style.visibility = 'visible';
        });
    }

    // 仕分け箱のドロップイベント
    sortingBoxes.forEach(box => {
        box.addEventListener('dragover', function (e) {
            e.preventDefault();
            box.classList.add('border-success');
        });
        box.addEventListener('dragleave', function () {
            box.classList.remove('border-success');
        });
        box.addEventListener('drop', function (e) {
            e.preventDefault();
            box.classList.remove('border-success');
            if (!isPlaying) return;
            const droppedValue = parseInt(e.dataTransfer.getData('text/plain'));
            const boxValue = parseInt(box.dataset.coin);
            if (droppedValue === boxValue) {
                score++;
                scoreSpan.textContent = score;
                box.classList.add('bg-success', 'text-white');
                setTimeout(() => box.classList.remove('bg-success', 'text-white'), 400);
            } else {
                box.classList.add('bg-danger', 'text-white');
                setTimeout(() => box.classList.remove('bg-danger', 'text-white'), 400);
            }
            showRandomCoin();
        });
    });

    // タイマー
    function startTimer() {
        timerId = setInterval(() => {
            time--;
            timerSpan.textContent = time;
            if (time <= 0) {
                clearInterval(timerId);
                isPlaying = false;
                coinArea.innerHTML = '<span class="fs-1 fw-bold text-primary">おわり！</span>';
            }
        }, 1000);
    }

    // 初期化
    showRandomCoin();
    startTimer();
});
