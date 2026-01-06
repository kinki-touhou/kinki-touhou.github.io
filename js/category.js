// ▼▼▼ フィルタリング機能を「関数」として定義する ▼▼▼
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // ボタン設定
    filterButtons.forEach(button => {
        // 重複登録防止（念のためクローンしてリセット）
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        
        newBtn.addEventListener('click', () => {
            // 1. ボタンの見た目を切り替え
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            newBtn.classList.add('active');

            // 2. カテゴリを取得
            const filterValue = newBtn.getAttribute('data-filter');

            // 3. すべての作品をチェックして表示/非表示
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.classList.remove('show');
                item.classList.remove('hide');

                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.add('show');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
}