// おつかいマスター：キャラクター選択画面

document.addEventListener('DOMContentLoaded', function () {
    // キャラクター定義
    const characters = [
        {
            id: 1,
            type: "boy",
            label: "男の子",
            colors: [
                { name: "青", color: "#3498db" },
                { name: "赤", color: "#e74c3c" },
                { name: "緑", color: "#27ae60" }
            ]
        },
        {
            id: 2,
            type: "girl",
            label: "女の子",
            colors: [
                { name: "ピンク", color: "#e67eb8" },
                { name: "黄", color: "#f9e79f" },
                { name: "紫", color: "#a569bd" }
            ]
        }
    ];

    let selectedCharacter = null;
    let selectedColor = null;

    const characterSelectDiv = document.getElementById('character-select');
    const startBtn = document.getElementById('startGameBtn');

    // キャラクター選択肢生成
    characters.forEach(character => {
        character.colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'character-btn btn btn-outline-primary d-flex flex-column align-items-center m-2';
            btn.style.width = '110px';
            btn.style.height = '140px';
            btn.style.background = '#fff';

            // シンプルなキャラアイコン（SVG）
            btn.innerHTML = `
                <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="25" r="18" fill="${color.color}" stroke="#555" stroke-width="2"/>
                    <ellipse cx="30" cy="48" rx="14" ry="8" fill="${color.color}" stroke="#555" stroke-width="2"/>
                    <circle cx="24" cy="23" r="2" fill="#222"/>
                    <circle cx="36" cy="23" r="2" fill="#222"/>
                    <ellipse cx="30" cy="30" rx="5" ry="3" fill="#fff"/>
                </svg>
                <span class="mt-2 fw-bold">${character.label}</span>
                <span style="color:${color.color}">${color.name}</span>
            `;
            btn.onclick = function () {
                // すべてのボタンの選択解除
                document.querySelectorAll('.character-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedCharacter = character;
                selectedColor = color;
                startBtn.disabled = false;
            };
            characterSelectDiv.appendChild(btn);
        });
    });

    // ゲームスタートボタン
    startBtn.addEventListener('click', function () {
        if (!selectedCharacter || !selectedColor) return;

        // キャラクター選択画面を非表示
        document.querySelector('.container').innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-10 text-center">
                    <h1 class="display-4 mb-4 text-primary fw-bold">おつかいマスター</h1>
                </div>
            </div>
            <div class="row justify-content-center mt-4">
                <div class="col-md-8">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h3 class="mb-3">おつかいリスト</h3>
                            <ul id="shopping-list" class="list-group mb-4"></ul>
                            <h4 class="mb-3">商品を選んでね</h4>
                            <div id="item-list" class="d-flex flex-wrap gap-4 mb-4"></div>
                            <div class="mb-3">
                                <span class="fw-bold">合計金額: <span id="total-price">0</span>円</span>
                                <span class="fw-bold ms-4">予算: <span id="budget"></span>円</span>
                            </div>
                            <button id="checkoutBtn" class="btn btn-lg btn-success" disabled>レジへ</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 商品データ
        const items = [
            { id: 1, name: "りんご", price: 100, image: "🍎" },
            { id: 2, name: "バナナ", price: 120, image: "🍌" },
            { id: 3, name: "にんじん", price: 80, image: "🥕" },
            { id: 4, name: "トマト", price: 90, image: "🍅" },
            { id: 5, name: "チョコ", price: 150, image: "🍫" },
            { id: 6, name: "クッキー", price: 130, image: "🍪" },
            { id: 7, name: "ジュース", price: 110, image: "🧃" },
            { id: 8, name: "牛乳", price: 140, image: "🥛" }
        ];

        // ランダムで2-5個のおつかいリストを生成
        function getRandomList(arr, min, max) {
            const n = Math.floor(Math.random() * (max - min + 1)) + min;
            const shuffled = arr.slice().sort(() => 0.5 - Math.random());
            return shuffled.slice(0, n);
        }
        const shoppingList = getRandomList(items, 2, 5);

        // 予算（リスト合計＋100〜200円の余裕）
        const minBudget = shoppingList.reduce((sum, item) => sum + item.price, 0) + 100;
        const maxBudget = minBudget + 100;
        const budget = Math.floor(Math.random() * (maxBudget - minBudget + 1)) + minBudget;

        // おつかいリスト表示
        const shoppingListUl = document.getElementById('shopping-list');
        shoppingList.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item fs-4';
            li.textContent = `${item.image} ${item.name}`;
            shoppingListUl.appendChild(li);
        });

        // 商品一覧表示
        const itemListDiv = document.getElementById('item-list');
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'item-btn btn btn-outline-secondary d-flex flex-column align-items-center m-2';
            btn.style.width = '100px';
            btn.style.height = '120px';
            btn.innerHTML = `
                <span style="font-size:2.5rem">${item.image}</span>
                <span class="fw-bold mt-2">${item.name}</span>
                <span class="text-success">${item.price}円</span>
            `;
            btn.onclick = function () {
                // 選択/解除
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    selectedItems = selectedItems.filter(i => i.id !== item.id);
                } else {
                    // おつかいリストに含まれるものだけ選択可
                    if (shoppingList.find(i => i.id === item.id)) {
                        btn.classList.add('active');
                        selectedItems.push(item);
                    }
                }
                updateTotal();
            };
            itemListDiv.appendChild(btn);
        });

        // 合計金額・予算表示
        document.getElementById('budget').textContent = budget;
        let selectedItems = [];
        function updateTotal() {
            const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
            document.getElementById('total-price').textContent = total;
            // おつかいリスト全て選択＆予算内ならレジへボタン有効
            const allSelected = shoppingList.every(i => selectedItems.find(si => si.id === i.id));
            document.getElementById('checkoutBtn').disabled = !(allSelected && total <= budget);
        }

        // レジへボタン
        document.getElementById('checkoutBtn').onclick = function () {
            // 結果画面
            document.querySelector('.container').innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-md-10 text-center">
                        <h1 class="display-4 mb-4 text-primary fw-bold">おつかいクリア！</h1>
                        <p class="lead mb-4">おつかいリストを全部そろえて、${budget}円以内で買えたね！</p>
                        <div class="mb-4">
                            <span class="fw-bold fs-4">おつり：${budget - selectedItems.reduce((sum, item) => sum + item.price, 0)}円</span>
                        </div>
                        <button class="btn btn-lg btn-primary" onclick="location.reload()">もう一度あそぶ</button>
                    </div>
                </div>
            `;
        };
    });
});
