document.addEventListener('DOMContentLoaded', function() {
    // 変数の初期化
    let investments = [];
    let portfolioChart = null;
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5',
        '#00BBF9', '#FEE440', '#00F5D4', '#E07A5F', '#3D405B'
    ];
    
    // 投資タイプごとに固定色を割り当て
    const typeColors = {
        'deposit': '#AEDFF7', // 薄い青（預貯金）
        'govbond': '#A2D5F2', // 青（個人向け国債）
        'bondfund': '#7FB3D5', // 青緑（債券ファンド）
        'corpbond': '#5499C7', // 濃い青（社債）
        'reit': '#F9E79F', // 黄色（REIT）
        'balanced': '#FAD7A0', // オレンジ黄（バランス型）
        'stockfund': '#F5CBA7', // 薄いオレンジ（株式ファンド）
        'stock': '#E59866', // オレンジ（個別株式）
        'realestate': '#D5F5E3', // 薄い緑（不動産）
        'commodity': '#ABEBC6', // 緑（商品先物）
        'fx': '#EC7063', // 赤（FX）
        'crypto': '#E74C3C' // 濃い赤（仮想通貨）
    };

    // DOM要素
    const investmentTypeSelect = document.getElementById('investment-type');
    const investmentPercentage = document.getElementById('investment-percentage');
    const addInvestmentButton = document.getElementById('add-investment');
    const investmentTable = document.getElementById('investment-table');
    const totalPercentageElement = document.getElementById('total-percentage');
    const averageRiskElement = document.getElementById('average-risk');
    const percentageWarning = document.getElementById('percentage-warning');
    const riskMeterBar = document.getElementById('risk-meter-bar');
    const riskDescription = document.getElementById('risk-description');

    // Chart.jsでポートフォリオチャートの初期化
    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    initChart();

    // イベントリスナーの設定
    addInvestmentButton.addEventListener('click', addInvestment);

    // 投資を追加する関数
    function addInvestment() {
        const selectElement = investmentTypeSelect;
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        
        if (!selectedOption.value || selectedOption.disabled) {
            alert('投資タイプを選択してください');
            return;
        }

        const percentage = parseInt(investmentPercentage.value);
        if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
            alert('有効な割合を入力してください（1〜100%）');
            return;
        }

        // 既存の投資と合計が100%を超えないかチェック
        const currentTotal = investments.reduce((sum, inv) => sum + inv.percentage, 0);
        if (currentTotal + percentage > 100) {
            alert(`合計が100%を超えます。最大${100 - currentTotal}%まで追加可能です。`);
            return;
        }

        const newInvestment = {
            type: selectedOption.value,
            name: selectedOption.text.split('（')[0],
            percentage: percentage,
            risk: parseFloat(selectedOption.getAttribute('data-risk'))
        };

        // 既に同じタイプの投資があるかチェック
        const existingIndex = investments.findIndex(inv => inv.type === newInvestment.type);
        
        if (existingIndex >= 0) {
            // 既存の投資に割合を追加
            investments[existingIndex].percentage += newInvestment.percentage;
        } else {
            // 新しい投資タイプとして追加
            investments.push(newInvestment);
        }
        
        updateTable();
        updateChart();
        updateRiskMeter();
    }

    // テーブル更新関数
    function updateTable() {
        const tbody = investmentTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        investments.forEach((investment, index) => {
            const row = document.createElement('tr');
            
            // 投資タイプに対応する色のスタイル
            const colorStyle = typeColors[investment.type] ? 
                `background-color: ${typeColors[investment.type]}30; border-left: 4px solid ${typeColors[investment.type]};` : '';
            
            row.setAttribute('style', colorStyle);
            row.innerHTML = `
                <td>${investment.name}</td>
                <td>${investment.percentage}%</td>
                <td>${investment.risk.toFixed(1)}/10</td>
                <td><button class="btn btn-sm btn-danger remove-btn" data-index="${index}">削除</button></td>
            `;
            tbody.appendChild(row);
        });

        // 削除ボタンイベントリスナーの追加
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                investments.splice(index, 1);
                updateTable();
                updateChart();
                updateRiskMeter();
            });
        });

        // 合計とリスク計算
        const totalPercentage = investments.reduce((sum, inv) => sum + inv.percentage, 0);
        totalPercentageElement.textContent = `${totalPercentage}%`;
        
        // 警告表示の制御
        if (totalPercentage < 100 && investments.length > 0) {
            percentageWarning.classList.remove('d-none');
        } else {
            percentageWarning.classList.add('d-none');
        }
        
        // 平均リスク計算（投資割合で加重平均）
        if (totalPercentage > 0) {
            const weightedRisk = investments.reduce((sum, inv) => sum + (inv.risk * inv.percentage), 0) / totalPercentage;
            averageRiskElement.textContent = weightedRisk.toFixed(1);
        } else {
            averageRiskElement.textContent = '0';
        }
    }

    // チャート初期化関数
    function initChart() {
        portfolioChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'ポートフォリオ構成'
                    }
                }
            }
        });
    }

    // チャート更新関数
    function updateChart() {
        if (!portfolioChart) return;
        
        // 投資データが0の場合は無投資グラフを表示
        if (investments.length === 0) {
            portfolioChart.data.labels = ['投資なし'];
            portfolioChart.data.datasets[0].data = [100];
            portfolioChart.data.datasets[0].backgroundColor = ['#e0e0e0'];
        } else {
            portfolioChart.data.labels = investments.map(inv => `${inv.name} (${inv.percentage}%)`);
            portfolioChart.data.datasets[0].data = investments.map(inv => inv.percentage);
            
            // 投資タイプに対応する固定色を使用
            const backgroundColors = investments.map(inv => typeColors[inv.type] || colors[0]);
            portfolioChart.data.datasets[0].backgroundColor = backgroundColors;
        }
        
        portfolioChart.update();
    }

    // リスクメーター更新関数
    function updateRiskMeter() {
        const totalPercentage = investments.reduce((sum, inv) => sum + inv.percentage, 0);
        
        if (totalPercentage > 0) {
            // リスクを投資割合で加重平均
            const weightedRisk = investments.reduce((sum, inv) => sum + (inv.risk * inv.percentage), 0) / totalPercentage;
            const riskPercentage = (weightedRisk / 10) * 100; // 10段階を100%スケールに変換
            
            riskMeterBar.style.width = `${riskPercentage}%`;
            riskMeterBar.textContent = `${weightedRisk.toFixed(1)}/10`;
            riskMeterBar.setAttribute('aria-valuenow', weightedRisk.toFixed(1));
            
            // リスクに応じた色の設定
            if (weightedRisk < 3) {
                riskMeterBar.className = 'progress-bar bg-success';
                riskDescription.textContent = '低リスク: 元本の安全性が高く、利回りは低めです。安定志向の方におすすめです。';
            } else if (weightedRisk < 7) {
                riskMeterBar.className = 'progress-bar bg-warning';
                riskDescription.textContent = '中リスク: 適度なリスクでバランスのとれたポートフォリオです。長期的な資産形成に適しています。';
            } else {
                riskMeterBar.className = 'progress-bar bg-danger';
                riskDescription.textContent = '高リスク: 値動きが大きく、損失の可能性もある投資です。リスク許容度の高い方向けです。';
            }
        } else {
            riskMeterBar.style.width = '0%';
            riskMeterBar.textContent = '0/10';
            riskMeterBar.setAttribute('aria-valuenow', '0');
            riskDescription.textContent = '投資を追加すると、ここにリスク評価の解説が表示されます。';
        }
    }
});