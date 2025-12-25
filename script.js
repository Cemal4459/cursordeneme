// Dergi sayfa verisi
const dergiPages = [
  {
    title: "Başlangıç",
    content: "Modern Kulüp Dergisi'ne hoş geldiniz!"
  },
  {
    title: "Etkinlikler",
    content: "Kulübümüz, yıl boyunca çeşitli atölyeler ve seminerler düzenlemektedir. Katılmak için bizi takip edin!"
  },
  {
    title: "Katılım",
    content: "Kulübümüze katılmak için iletişim bilgilerimiz aracılığıyla bize ulaşabilirsiniz. Tüm öğrencilere açığız!"
  }
];

// Geçerli sayfa indeksi (0 tabanlı)
let currentPage = 0;

// Sayfa içeriklerini güncelleyen fonksiyon
function updateDergiPage() {
  const pageData = dergiPages[currentPage];
  const pageContentDiv = document.getElementById('dergi-page-content');
  if (pageContentDiv) {
    pageContentDiv.innerHTML = `<h3>${pageData.title}</h3><p>${pageData.content}</p>`;
  }
  const pageNumSpan = document.getElementById('dergi-page-num');
  if (pageNumSpan) {
    pageNumSpan.textContent = `${currentPage + 1} / ${dergiPages.length}`;
  }
  // Butonları etkin/pasif göster (isteğe bağlı)
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  if (prevBtn) prevBtn.disabled = (currentPage === 0);
  if (nextBtn) nextBtn.disabled = (currentPage === dergiPages.length - 1);
}

// Sayfa değiştirici fonksiyon
function changePage(dir) {
  // dir: -1 veya +1
  const newPage = currentPage + dir;
  if (newPage >= 0 && newPage < dergiPages.length) {
    currentPage = newPage;
    updateDergiPage();
  }
}

// İlk yüklemede doğru sayfayı göster
document.addEventListener('DOMContentLoaded', function() {
  updateDergiPage();
});
// --- Dergi sayfa geçişine yumuşak slide animasyonu ekle ---

// Animasyonla sayfa güncelleyen fonksiyon
function animatePageChange(newPage, direction) {
  const pageContentDiv = document.getElementById('dergi-page-content');
  if (!pageContentDiv) return;

  // Eğer geçerli, animasyon başlat
  pageContentDiv.style.transition = 'transform 0.35s cubic-bezier(.55,0,.13,1), opacity 0.23s cubic-bezier(.51,0,.14,1)';
  pageContentDiv.style.transform = `translateX(${direction > 0 ? '' : '-'}60px)`;
  pageContentDiv.style.opacity = '0';

  setTimeout(function () {
    // Sayfa içeriğini değiştir
    currentPage = newPage;
    const pageData = dergiPages[currentPage];
    pageContentDiv.innerHTML = `<h3>${pageData.title}</h3><p>${pageData.content}</p>`;
    // Sayfa numarasını güncelle
    const pageNumSpan = document.getElementById('dergi-page-num');
    if (pageNumSpan) pageNumSpan.textContent = `${currentPage + 1} / ${dergiPages.length}`;
    // Butonları güncelle
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    if (prevBtn) prevBtn.disabled = (currentPage === 0);
    if (nextBtn) nextBtn.disabled = (currentPage === dergiPages.length - 1);

    // Yeni sayfa dışarıda başlasın
    pageContentDiv.style.transform = `translateX(${direction > 0 ? '-60px' : '60px'})`;
    // Sonra animasyonla merkeze gelsin ve opaklığı 1'e çıksın
    setTimeout(function () {
      pageContentDiv.style.transition = 'transform 0.36s cubic-bezier(.51,0,.14,1), opacity 0.19s cubic-bezier(.31,0,.14,1)';
      pageContentDiv.style.transform = 'translateX(0)';
      pageContentDiv.style.opacity = '1';
    }, 16);
  }, 350);
}

// changePage'i override et
function changePage(dir) {
  const newPage = currentPage + dir;
  if (newPage >= 0 && newPage < dergiPages.length) {
    animatePageChange(newPage, dir);
  }
}

// Stil ipucu: Başlangıçta animasyonlu parametreler temiz olsun
document.addEventListener('DOMContentLoaded', function() {
  const pageContentDiv = document.getElementById('dergi-page-content');
  if (pageContentDiv) {
    pageContentDiv.style.transition = 'none';
    pageContentDiv.style.transform = 'translateX(0)';
    pageContentDiv.style.opacity = '1';
    // Ayrıca ilk güncellemeyi tekrar tetikle (orijinal fonksiyon kullanımı)
    // updateDergiPage(); // comment out: yukarıda zaten çalışıyor
  }
});
// Açılır menü ekle ve uygun event ile sayfa atlamayı sağla

document.addEventListener('DOMContentLoaded', function() {
  const dergiViewer = document.getElementById('dergi-viewer');
  if (!dergiViewer) return;

  // Açılır menü (select) oluştur
  const pageSelect = document.createElement('select');
  pageSelect.id = 'dergi-page-select';
  pageSelect.style.margin = '0 1.15rem 0 1.15rem';
  pageSelect.style.borderRadius = '0.6rem';
  pageSelect.style.padding = '0.3rem 0.7rem';
  pageSelect.style.fontSize = '1rem';
  pageSelect.style.background = '#243458';
  pageSelect.style.color = '#ffb700';
  pageSelect.style.border = 'none';
  pageSelect.style.outline = 'none';
  pageSelect.style.boxShadow = '0 1px 5px 0 rgba(36,52,88,0.04)';
  pageSelect.style.cursor = 'pointer';

  // Sayfa seçeneklerini oluştur
  dergiPages.forEach(function(page, idx) {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${idx + 1}. Sayfa: ${page.title}`;
    pageSelect.appendChild(opt);
  });

  // Düğmelerin olduğu yere ekle (prev, [buraya], sayfa numarası, [buraya], next yapısı var)
  // Yalnızca sayfa numarasının olduğu <span>ı bulalım ve onun hemen sonrasına ekleyelim
  const pageNumSpan = document.getElementById('dergi-page-num');
  if (pageNumSpan && pageNumSpan.parentElement) {
    // <span>'dan sonra ekle
    pageNumSpan.parentElement.insertBefore(pageSelect, pageNumSpan.nextSibling);
  }

  // Sayfa değiştiğinde yeni sayfaya atla
  pageSelect.addEventListener('change', function(e) {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && idx >= 0 && idx < dergiPages.length && idx !== currentPage) {
      const direction = idx > currentPage ? 1 : -1;
      animatePageChange(idx, direction);
    }
  });

  // Sayfa değiştikçe menüyü de güncel tut
  const originalAnimatePageChange = animatePageChange;
  animatePageChange = function(newPage, direction) {
    originalAnimatePageChange(newPage, direction);
    // setTimeout ile sayfa değiştikten biraz sonra select'i güncelle
    setTimeout(function() {
      pageSelect.value = newPage;
    }, 370); // animasyon süresiyle uyumlu
  };

  // Başlangıçta menünün güncel sayfayı göstermesini sağla
  pageSelect.value = currentPage;
});

