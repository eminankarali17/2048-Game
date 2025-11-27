// script.js dosyasının ilk bölümü

// 1. TEMEL DEĞİŞKENLERİ TANIMLAMA
let board; // Oyun tahtasını (matrisi) tutacak değişken
let score = 0; // Mevcut skoru tutacak değişken
let rows = 4; // Satır sayısı
let columns = 4; // Sütun sayısı

// 2. SAYFA YÜKLENİNCE OYUNU BAŞLAT
window.onload = function() {
    setGame();
    
    // Yeniden Başla butonuna tıklanınca oyunu sıfırla
    document.getElementById("new-game-button").addEventListener("click", setGame);
}

// 3. OYUN TAHTASINI HAZIRLAMA FONKSİYONU
function setGame() {
    // Skor ve tahtayı sıfırla
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("board").innerHTML = ""; // Tahtadaki eski taşları temizle

    // Tahta matrisini (4x4) sıfırlarla doldur
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    
    // HTML'deki görsel tahtayı oluştur
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Her hücre için bir div oluştur (bu boş hücreyi temsil eder)
            let cell = document.createElement("div");
            cell.id = r.toString() + "-" + c.toString(); // ID: "0-0", "0-1" vb.
            cell.classList.add("cell"); // CSS stilini uygula
            document.getElementById("board").append(cell);
        }
    }
    
    // Başlangıçta 2 adet "2" taşı ekle
    addTile();
    addTile();
}

// 4. TAŞ DEĞERİNE GÖRE GÖRSEL GÜNCELLEME FONKSİYONU
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Önceki sınıfları temizle
    tile.classList.add("cell");

    if (num > 0) {
        tile.innerText = num;
        // Taşın değeri 2 ise "x2" sınıfını, 2048 ise "x2048" sınıfını ekle
        // CSS'teki renklendirme bu sınıflar sayesinde oluyor (bkz. style.css)
        if (num <= 2048) {
            tile.classList.add("x" + num);
        } else {
            // 2048'den büyük taşlar için özel bir stil (olası)
            tile.classList.add("x4096"); 
        }
    }
}

// 5. YENİ TAŞ (2 veya 4) EKLEME FONKSİYONU
function addTile() {
    // 2048'in temel kuralı: önce boş yer var mı kontrol et
    if (!hasEmptyCell()) {
        return; // Boş hücre yoksa ekleme
    }
    
    // Rastgele bir boş hücre bul
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            found = true;
            // Rastgele 2 veya 4 atama (%90 ihtimalle 2, %10 ihtimalle 4)
            board[r][c] = (Math.random() < 0.9) ? 2 : 4;
            
            // HTML üzerindeki görseli güncelle
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

// 6. BOŞ HÜCRE KONTROLÜ
function hasEmptyCell() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}
// script.js dosyasının ikinci bölümü

// 7. KLAVYE GİRİŞLERİNİ DİNLEME
document.addEventListener('keyup', (e) => {
    let moved = false;
    
    // Yön tuşlarına göre ilgili fonksiyonu çağır
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        moved = slideLeft();
    } 
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        moved = slideRight();
    } 
    else if (e.code == "ArrowUp" || e.code == "KeyW") {
        moved = slideUp();
    } 
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        moved = slideDown();
    }

    // Eğer hareket gerçekleştiyse (moved = true), yeni bir taş ekle
    if (moved) {
        addTile();
        checkGameOver(); // Her hareketten sonra oyun bitti mi diye kontrol et
    }

    document.getElementById("score").innerText = score;
});

// Yardımcı Fonksiyon: Bir satırdaki tüm sıfırları sağa kaydırıp sayıları sola yaslar
function filterZero(row) {
    return row.filter(num => num != 0); // Sadece sıfır olmayanları içeren yeni bir dizi döndürür
}

// Yardımcı Fonksiyon: Kaydırma ve Birleştirme İşlemini Yapar
function slide(row) {
    // 1. Sıfırları Kaldır (Örnek: [2, 0, 2, 0] -> [2, 2])
    row = filterZero(row);

    // 2. Birleştirme (Örnek: [2, 2] -> [4])
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2; // Taşın değerini iki katına çıkar
            score += row[i]; // Skora ekle
            row[i+1] = 0; // Birleşen ikinci taşı sıfır yap
        }
    }

    // 3. Tekrar Sıfırları Kaldır (Örnek: [4, 0] -> [4])
    row = filterZero(row);

    // 4. Tahtanın genişliğine (4) ulaşana kadar sağa sıfır ekle (Örnek: [4] -> [4, 0, 0, 0])
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

// 8. DÖRT TEMEL HAREKET FONKSİYONU

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let originalRow = [...board[r]]; // Orijinal satırı kopyala
        let row = board[r];
        row = slide(row); // Satırı kaydır ve birleştir
        board[r] = row;
        
        // HTML'i güncelle
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
        
        // Orijinal satır ile yeni satır farklıysa hareket gerçekleşmiş demektir
        if (originalRow.join(',') !== board[r].join(',')) {
            moved = true;
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let originalRow = [...board[r]];
        let row = board[r];
        row.reverse(); // Sağa kaydırmak için diziyi ters çevir
        row = slide(row); 
        row.reverse(); // Tekrar düzelt

        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }

        if (originalRow.join(',') !== board[r].join(',')) {
            moved = true;
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        // Kolonu bir diziye topla
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];
        
        col = slide(col);
        
        // Kolonu tahtaya geri yerleştir
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }

        if (originalCol.join(',') !== col.join(',')) {
            moved = true;
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];
        
        col.reverse(); // Aşağı kaydırmak için diziyi ters çevir
        col = slide(col);
        col.reverse(); // Tekrar düzelt

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }

        if (originalCol.join(',') !== col.join(',')) {
            moved = true;
        }
    }
    return moved;
}

// 9. OYUN BİTTİ Mİ KONTROLÜ
function checkGameOver() {
    // Önce boş hücre var mı diye kontrol et (varsa oyun devam eder)
    if (hasEmptyCell()) {
        return;
    }
    
    // Eğer boş hücre yoksa, yan yana veya alt alta birleştirilebilecek taş var mı kontrol et
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let current = board[r][c];

            // Sağdaki ile aynı mı?
            if (c < columns - 1 && board[r][c+1] === current) {
                return; // Birleştirme yapılabilir, oyun devam ediyor
            }
            // Aşağıdaki ile aynı mı?
            if (r < rows - 1 && board[r+1][c] === current) {
                return; // Birleştirme yapılabilir, oyun devam ediyor
            }
        }
    }

    // Eğer tahta doluysa ve hiç birleştirme yapılamıyorsa, oyun biter.
    // Kullanıcıya bilgi ver.
// script.js dosyasının son bölümü: Mobil Dokunmatik Desteği (Swipe)

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

const boardElement = document.getElementById("board");

// Dokunma başladığında (parmak ekrana değdiğinde) koordinatları kaydet
boardElement.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
}, false);

// Dokunma bittiğinde (parmak ekrandan çekildiğinde) koordinatları kaydet
boardElement.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture(); // Hareketi hesaplama fonksiyonunu çağır
}, false);

function handleGesture() {
    // X eksenindeki kaydırma miktarı
    const diffX = touchendX - touchstartX; 
    // Y eksenindeki kaydırma miktarı
    const diffY = touchendY - touchstartY; 
    
    // Yön seçimi için eşik değeri. Hareketin belli bir şiddette olması gerekir.
    const threshold = 30; 
    // Hangi eksende daha fazla hareket olduğunu belirlemek için
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    
    let moved = false;

    // Yön tespiti: Hangisi daha büyükse o yöne hareket et
    if (absDiffX > absDiffY && absDiffX > threshold) {
        // Yatay hareket
        if (diffX > 0) {
            moved = slideRight(); // Sağa kaydırma
        } else {
            moved = slideLeft(); // Sola kaydırma
        }
    } 
    else if (absDiffY > absDiffX && absDiffY > threshold) {
        // Dikey hareket
        if (diffY > 0) {
            moved = slideDown(); // Aşağı kaydırma
        } else {
            moved = slideUp(); // Yukarı kaydırma
        }
    } else {
        // Eşik değerinin altında bir hareket varsa veya sadece dokunma ise hareket etme
        return;
    }
    
    // Eğer hareket gerçekleştiyse yeni bir taş ekle ve skoru güncelle
    if (moved) {
        addTile();
        checkGameOver();
        document.getElementById("score").innerText = score;
    }
}
    setTimeout(() => {
        alert("Oyun Bitti! Skorunuz: " + score);
    }, 100); // Küçük bir gecikme ekleyerek skorun güncellenmesini sağlar
}
// Önceki Kod: boardElement.addEventListener('touchstart', e => { ... });
// Önceki Kod: boardElement.addEventListener('touchend', e => { ... });

// YENİ VE DÜZELTİLMİŞ KOD:
const boardElement = document.getElementById("board");

// Dokunma başladığında (parmak ekrana değdiğinde) koordinatları kaydet
boardElement.addEventListener('touchstart', e => {
    // Mobil cihazın varsayılan kaydırma hareketini engelle
    e.preventDefault(); 
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
}, { passive: false }); // passive: false ile e.preventDefault() çalışır hale gelir

// Dokunma bittiğinde (parmak ekrandan çekildiğinde) koordinatları kaydet
boardElement.addEventListener('touchend', e => {
    e.preventDefault(); 
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
}, { passive: false });