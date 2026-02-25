document.addEventListener('DOMContentLoaded', () => {
  const lightbox      = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const captionEl     = document.getElementById('lightbox-caption');
  const prevBtn       = document.getElementById('lightbox-prev');
  const nextBtn       = document.getElementById('lightbox-next');
  const closeBtn      = document.getElementById('lightbox-close');

  const galleryImages = [...document.querySelectorAll('.gallery-img')];

  // 現在開いている「グループ」（同一成果物内の画像一覧）とインデックス
  let currentGroupImages = [];
  let currentIndex = 0;

  function openLightbox(group, index) {
    currentGroupImages = galleryImages.filter(img => (img.dataset.group || '') === group);
    currentIndex = Math.max(0, Math.min(index, currentGroupImages.length - 1));
    render();
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function render() {
    if (!currentGroupImages.length) return;
    const img = currentGroupImages[currentIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    captionEl.textContent = img.alt || '';
  }

  function prev() {
    if (!currentGroupImages.length) return;
    currentIndex = (currentIndex - 1 + currentGroupImages.length) % currentGroupImages.length;
    render();
  }

  function next() {
    if (!currentGroupImages.length) return;
    currentIndex = (currentIndex + 1) % currentGroupImages.length;
    render();
  }

  // 画像クリック → 同じ data-group の中で表示・移動できる
  galleryImages.forEach((img) => {
    img.addEventListener('click', () => {
      const group = img.dataset.group || '';
      const groupImages = galleryImages.filter(x => (x.dataset.group || '') === group);
      const index = groupImages.indexOf(img);
      openLightbox(group, index);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // 背景クリックで閉じる（画像・ボタン以外）
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // キーボード操作
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
});