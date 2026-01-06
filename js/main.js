/* =========================================
   メインJavaScript (main.js)
   ========================================= */

// ▼▼▼ 1. ページ読み込み完了時の処理まとめ ▼▼▼
window.addEventListener('load', function() {
    console.log("ページ読み込み完了");
    
    // 各機能の起動
    loadScreen();      // ローディング画面
    countDownKouroumu(); // カウントダウン
    loadTexts();       // テキスト読み込み
    generateCards();   // 作品カード自動生成
});


// ▼▼▼ 2. ローディング画面 ▼▼▼
function loadScreen() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        // 0.8秒後にクラスを追加してフェードアウト
        setTimeout(function() {
            loadingScreen.classList.add('loaded');
        }, 800);
    }
}


// ▼▼▼ 3. 桜のアニメーション ▼▼▼
function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = Math.random() * 5 + 5 + 's';
    const size = Math.random() * 10 + 10;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    document.body.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
    }, 10000);
}
// 桜を開始
setInterval(createPetal, 300);


// ▼▼▼ 4. カウントダウンタイマー（1秒ごとに更新） ▼▼▼
function countDownKouroumu() {
    // タイマーの要素があるか確認（ないページでのエラー防止）
    const timerElement = document.getElementById("timer");
    if (!timerElement) return;

    // 内部で計算して表示する関数
    function updateTimer() {
        const eventDate = new Date("October 11, 2026 10:00:00").getTime();
        const now = new Date().getTime();
        const gap = eventDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);

        if (gap > 0) {
            const elDays = document.getElementById("days");
            const elHours = document.getElementById("hours");
            if(elDays) elDays.innerText = textDay;
            if(elHours) elHours.innerText = textHour;
        } else {
            timerElement.innerText = "開催当日！";
        }
    }

    // 初回実行
    updateTimer();
    // 以後、1秒ごとに更新
    setInterval(updateTimer, 1000);
}


// ▼▼▼ 5. テキスト自動読み込み機能 (fetch) ▼▼▼
function loadTexts() {
    const targets = document.querySelectorAll('.text-loader');
    targets.forEach(element => {
        const filePath = element.getAttribute('data-src');
        if (!filePath) return;

        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error('File not found: ' + filePath);
                return response.text();
            })
            .then(data => {
                element.innerText = data;
            })
            .catch(error => {
                element.innerText = "読み込み失敗";
                console.error('Error:', error);
            });
    });
}


// ▼▼▼ 6. スライドショー (Swiper) ▼▼▼
// ページ内にスライドショーがある場合のみ実行
if (document.querySelector('.swiper-container')) {
    let swiper = new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 600,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// ▼▼▼ 7.JSONから作品カードを生成する機能 ▼▼▼
function generateCards() {
    const container = document.getElementById('gallery-list');
    
    // Outputページじゃないなら何もしない
    if (!container) return;

    fetch('./json/works.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON not found');
            return response.json();
        })
        .then(data => {
            // データからカードを作る
            data.forEach(item => {
                
                // 1. 画像がある時だけ画像タグを作る（既存）
                let imageHTML = '';
                if (item.image && item.image !== "") {
                    imageHTML = `<div class="card-image"><img src="${item.image}" loading="lazy"></div>`;
                }

                // 2. リンクがある時だけリンクタグを作る（既存）
                let linkHTML = '';
                if (item.link && item.link !== "") {
                    linkHTML = `<a href="${item.link}" class="read-more" target="_blank">詳細/読む</a>`;
                }

                //3. バッジがある時だけバッジタグを作る
                let badgeHTML = ''; // 最初は空っぽにしておく
                
                // もし badge に文字が入っていたら...
                if (item.badge && item.badge !== "") {
                    // HTMLを作る
                    badgeHTML = `<div class="badge ${item.category}">${item.badge}</div>`;
                }

                //4. 音声・動画プレイヤーの生成
                let mediaHTML = '';

                // 音声ファイルがある場合
                if (item.audio && item.audio !== "") {
                    // <audio controls src="..."> を作る
                    mediaHTML = `<audio controls src="${item.audio}" class="media-player"></audio>`;
                }
                // 動画ファイルがある場合
                else if (item.video && item.video !== "") {
                    // <video controls src="..."> を作る
                    mediaHTML = `<video controls src="${item.video}" class="media-player"></video>`;
                }


                // 5. HTMLを組み立てる
                const cardHTML = `
                    <div class="card gallery-item" data-category="${item.category}">
                        ${imageHTML}
                        <div class="card-text">
                            <h3>${item.title}</h3>
                            <p class="${item.category === 'novel' ? 'novel-preview' : ''}">${item.text}</p>
                            
                            ${mediaHTML}
                            
                            ${linkHTML}
                        </div>
                        ${badgeHTML}
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', cardHTML);
            });

            if (typeof initCategoryFilter === "function") {
                initCategoryFilter();
            }
        })
        .catch(error => console.error('カード生成エラー:', error));
}


// ▼▼▼ 画像拡大（ライトボックス）機能：デバッグ版 ▼▼▼

// ページが完全に読み込まれてから準備する
window.addEventListener('load', function() {
    
    // 1. 要素を見つける
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close-btn");
    const galleryContainer = document.getElementById('gallery-list');

    // コンソールに状況を表示（F12で確認できます）
    console.log("拡大機能の準備:", {
        modal: modal ? "OK" : "見つかりません (HTMLを確認!)",
        gallery: galleryContainer ? "OK" : "見つかりません (IDを確認!)"
    });

    // 2. ギャラリーがある時だけ監視を開始
    if (galleryContainer) {
        galleryContainer.addEventListener('click', function(e) {
            
            // クリックされたものが何かコンソールに出す
            console.log("クリックされたもの:", e.target.tagName);

            // クリックされたのが「画像(IMG)」だったら実行
            if (e.target.tagName === 'IMG') {
                
                // モダールを表示
                if (modal) {
                    modal.style.display = "block";
                    modalImg.src = e.target.src; // 画像URLをコピー
                    console.log("画像を拡大しました");
                } else {
                    console.error("エラー: #image-modal がHTMLにありません");
                }
            }
        });
    }

    // 3. 閉じる処理
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
    }
    if (modal) {
        modal.onclick = function(e) {
            if (e.target !== modalImg) {
                modal.style.display = "none";
            }
        }
    }
});