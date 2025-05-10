document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;

    let labels = [];
    let data = [];
    let price = 1000;
    let intervalId = null;

    // 資産・エントリー情報
    let balance = 10000;
    let entryPrice = null;
    let entryIndex = null;
    let isHolding = false;
    let history = [];

    // 初期データ
    for (let i = 0; i < 60; i++) {
        labels.push(i.toString());
        data.push(price);
        price += Math.round((Math.random() - 0.5) * 10);
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '株価',
                    data: data,
                    borderColor: 'rgba(40,167,69,1)',
                    backgroundColor: 'rgba(40,167,69,0.1)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'エントリーポイント',
                    data: Array(data.length).fill(null),
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    borderDash: [5, 5],
                    order: 0
                }
            ]
        },
        options: {
            animation: false,
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });

    // UI生成
    function updateInfo(newPrice) {
        let info = document.getElementById('stock-info');
        if (!info) {
            info = document.createElement('div');
            info.id = 'stock-info';
            info.className = 'mt-3 text-center';
            ctx.parentNode.appendChild(info);
        }
        let diff = (isHolding && entryPrice !== null) ? newPrice - entryPrice : 0;
        info.innerHTML = `
            <span class="fw-bold me-3">資産: ${balance}円</span>
            <span class="fw-bold me-3">現在株価: ${newPrice}円</span>
            <span class="fw-bold me-3">保有: ${isHolding ? 'あり' : 'なし'}</span>
            ${isHolding ? `<span class="fw-bold ${diff >= 0 ? 'text-success' : 'text-danger'}">評価損益: ${diff >= 0 ? '+' : ''}${diff}円</span>` : ''}
            <div class="mt-2">
                <button id="buyBtn" class="btn btn-success me-2" ${isHolding ? 'disabled' : ''}>買う</button>
                <button id="sellBtn" class="btn btn-danger" ${isHolding ? '' : 'disabled'}>売る</button>
            </div>
            <div class="mt-4">
                <h5>売買履歴</h5>
                <table class="table table-sm table-bordered mx-auto" style="max-width:500px;">
                    <thead class="table-light">
                        <tr>
                            <th>購入金額</th>
                            <th>売却金額</th>
                            <th>損益</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map(h => `
                            <tr>
                                <td>${h.buy}円</td>
                                <td>${h.sell}円</td>
                                <td class="${h.profit >= 0 ? 'text-success' : 'text-danger'}">${h.profit >= 0 ? '+' : ''}${h.profit}円</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('buyBtn').onclick = buyStock;
        document.getElementById('sellBtn').onclick = sellStock;
    }

    // チャート更新
    function updateChart() {
        let lastPrice = chart.data.datasets[0].data.slice(-1)[0];
        let newPrice = lastPrice + Math.round((Math.random() - 0.5) * 10);
        chart.data.datasets[0].data.push(newPrice);
        chart.data.labels.push((chart.data.labels.length).toString());

        // エントリーポイント線も延長
        if (isHolding && entryIndex !== null && entryPrice !== null) {
            chart.data.datasets[1].data.push(entryPrice);
        } else {
            chart.data.datasets[1].data.push(null);
        }

        if (chart.data.datasets[0].data.length > 60) {
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
            chart.data.labels.shift();
            if (entryIndex !== null) entryIndex--;
            if (entryIndex !== null && entryIndex < 0) {
                // 強制売却処理
                sellStock(true); // trueを渡して「自動売却」扱いに
            }
        }

        chart.update();
        updateInfo(newPrice);
    }

    // 買う
    function buyStock() {
        if (isHolding) return;
        entryIndex = chart.data.datasets[0].data.length - 1;
        entryPrice = chart.data.datasets[0].data[entryIndex];
        if (balance < entryPrice) {
            alert("資産が足りません");
            return;
        }
        balance -= entryPrice;
        isHolding = true;
        // エントリーポイント線を再描画
        chart.data.datasets[1].data = chart.data.datasets[0].data.map((_, i) => i >= entryIndex ? entryPrice : null);
        updateInfo(entryPrice);
    }

    // 売る
    function sellStock(isAuto = false) {
        if (!isHolding) return;
        let nowIndex = chart.data.datasets[0].data.length - 1;
        let nowPrice = chart.data.datasets[0].data[nowIndex];
        balance += nowPrice;
        let profit = nowPrice - entryPrice;
        history.unshift({ buy: entryPrice, sell: nowPrice, profit: profit, auto: isAuto });
        isHolding = false;
        entryIndex = null;
        entryPrice = null;
        // エントリーポイント線を消す
        chart.data.datasets[1].data = chart.data.datasets[0].data.map(() => null);
        updateInfo(nowPrice);
    }

    // 初期表示
    updateInfo(chart.data.datasets[0].data.slice(-1)[0]);
    intervalId = setInterval(updateChart, 500);
});