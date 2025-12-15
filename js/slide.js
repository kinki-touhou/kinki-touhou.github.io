/*以下、スライドショー関連*/
let swiper = new Swiper('.swiper-container', {
            // ループ再生
            loop: true,
            slidesPerView: 1,     // 「1枚だけ」表示する
            spaceBetween: 30,     // 見えてないけど、隣のスライドとの隙間を少し空けておく
            centeredSlides: true, // アクティブなスライドを中央にする
            spaceBetween: 30,     // スライド間の隙間
            speed: 600,           // 切り替わるスピード（ミリ秒）。

             autoplay: {
                delay: 3000,      // 3秒ごとに切り替え
                disableOnInteraction: false, // ユーザーが触っても自動再生を止めない
            },

            // ページネーション（点々）
            pagination: { 
                el: '.swiper-pagination',
                clickable: true,
            },
            // 矢印ボタン
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
/*スライドショー関連ここまで*/