// 花びらを生成する関数
function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // ランダムな位置（左端から右端のどこか）
    petal.style.left = Math.random() * 100 + 'vw';
    
    // ランダムなアニメーション時間（落ちるスピードにバラつきを出す）
    // 5秒 〜 10秒の間
    petal.style.animationDuration = Math.random() * 5 + 5 + 's';
    
    // ランダムな大きさ（大小をつける）
    const size = Math.random() * 10 + 10; // 10px 〜 20px
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';

    // bodyに追加
    document.body.appendChild(petal);

    // アニメーションが終わったら（10秒後）要素を消す（メモリ節約）
    setTimeout(() => {
        petal.remove();
    }, 10000);
}

// 300ミリ秒（0.3秒）ごとに花びらを1枚生成する
setInterval(createPetal, 300);
/*桜ここまで*/

/*ローディング画面*/
function loadScreen() {
            // 画面の読み込みが完全に終わったら実行
            const loadingScreen = document.getElementById('loading');
            
            // 少しだけ待ってから消すと余韻があって良い（0.8秒待機）
            setTimeout(function() {
                loadingScreen.classList.add('loaded');
            }, 800);

            
        };
/*ローディング画面ここまで*/

/*カウントダウン*/
function countDownKouroumu(){
        const eventDate = new Date("October 11, 2026 10:00:00").getTime();
        const now = new Date().getTime();
        const gap = eventDate - now;

        // 計算（ミリ秒を日・時に直す）
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);

        // 画面に表示
        if (gap > 0) {
            document.getElementById("days").innerText = textDay;
            document.getElementById("hours").innerText = textHour;
        } else {
            document.getElementById("timer").innerText = "開催当日！";
        }
}
