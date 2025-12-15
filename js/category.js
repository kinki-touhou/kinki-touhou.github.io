const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. ボタンの見た目を切り替え
        // まず全員から 'active' を外す
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // 押されたボタンにだけ 'active' をつける
        button.classList.add('active');

        // 2. 押されたボタンの種類（all, illust, music...）を取得
        const filterValue = button.getAttribute('data-filter');

        // 3. すべての作品をチェック
        galleryItems.forEach(item => {
            // アニメーションをリセットするために一旦クラスを外す
            item.classList.remove('show');
            item.classList.remove('hide');

            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                // 「すべて」か「カテゴリ一致」なら表示
                item.classList.add('show');
            } else {
                // それ以外は隠す
                item.classList.add('hide');
            }
        });
    });
});