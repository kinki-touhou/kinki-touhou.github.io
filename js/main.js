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
    // 1. 要素の取得
    const timerElement = document.getElementById("timer");
    // ★ここを追加：日付を表示する場所をIDで確実に取得
    const dateTextElement = document.getElementById("event-date"); 
    
    if (!timerElement) return;

    // 2. JSON取得
    fetch('./json/kouroumu-date.json')
        .then(res => {
            if (!res.ok) throw new Error('JSON not found');
            return res.json();
        })
        .then(data => {
            startTimer(data);
        })
        .catch(err => {
            console.error(err);
            // エラー時はメッセージを出す
            if(dateTextElement) dateTextElement.innerText = "（日程情報なし）";
        });


    // 3. 計算ロジック
    function startTimer(dateList) {
        
        function updateTimer() {
            const now = new Date().getTime();
            let targetDate = null;

            // リストから未来の日付を探す
            for (let i = 0; i < dateList.length; i++) {
                const eventTime = new Date(dateList[i].date).getTime();
                
                if (eventTime > now) {
                    targetDate = eventTime;

                    // ▼▼▼ ここで日付を更新します！ ▼▼▼
                    if (dateTextElement) {
                        // JSONの日付文字列を「日付データ」に変換
                        const d = new Date(dateList[i].date);
                        
                        // 年・月・日を取り出す（月は0から始まるので+1する）
                        const year = d.getFullYear();
                        const month = d.getMonth() + 1;
                        const date = d.getDate();

                        // 画面の文字を書き換える
                        // 例：「（2026年10月11日 開催予定）」
                        dateTextElement.innerText = `（${year}年${month}月${date}日 開催予定）`;
                    }
                    // ▲▲▲ 更新完了 ▲▲▲

                    break; // 見つかったのでループ終了
                }
            }

            // 予定がない場合
            if (!targetDate) {
                timerElement.innerText = "次回の日程は調整中です";
                if (dateTextElement) dateTextElement.innerText = "（日程未定）";
                return;
            }

            // カウントダウン計算
            const gap = targetDate - now;
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
                if(dateTextElement) dateTextElement.innerText = "（本日開催！）";
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
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