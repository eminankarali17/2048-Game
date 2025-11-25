// script.js - TÜM KOD BİRLEŞTİRİLMİŞ VE DÜZELTİLMİŞ VERSİYON

// 1. TEMEL DEĞİŞKENLERİ TANIMLAMA
let board;
let score = 0;
let rows = 4;
let columns = 4;

// Dokunmatik hareket için değişkenler
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

// 2. SAYFA YÜKLENİNCE OYUNU BAŞLAT
window.onload = function() {
    setGame();
    document.getElementById("new-game-button").addEventListener("click", setGame);
    
    // Mobil dokunmatik olay dinleyicilerini burada ayarla
    setupTouchListeners();
}

// 3. OYUN TAHTASINI HAZIRLAMA FONKSİYONU
function setGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("board").innerHTML = "";

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let cell = document.createElement("div");
            cell.id = r.toString() + "-" + c.toString();
            cell.classList.add("cell");
            document.getElementById("board").append(cell);
        }
    }
    
    addTile();
    addTile();
}

// 4. TAŞ DEĞERİNE GÖRE GÖRSEL GÜNCELLEME FONKSİYONU
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("cell");

    if (num > 0) {
        tile.innerText = num;
        if (num <= 2048) {
            tile.classList.add("x" + num);
        } else {
            tile.classList.add("x4096");
        }
    }
}

// 5. YENİ TAŞ (2 veya 4) EKLEME FONKSİYONU
function addTile() {
    if (!hasEmptyCell()) {
        return;
    }
    
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            found = true;
            board[r][c] = (Math.random() < 0.9) ? 2 : 4;
            
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

// Yardımcı Fonksiyon: Sıfırları Kaldırır
function filterZero(row) {
    return row.filter(num => num != 0);
}

// Yardımcı Fonksiyon: Kaydırma ve Birleştirme İşlemini Yapar
function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            score += row[i];
            row[i+1] = 0;
        }
    }

    row = filterZero(row);

    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

// 7. DÖRT TEMEL HAREKET FONKSİYONU (Sağa, Sola, Yukarı, Aşağı)
function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let originalRow = [...board[r]];
        let row = board[r];
        row = slide(row);
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

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let originalRow = [...board[r]];
        let row = board[r];
        row.reverse();
        row = slide(row); 
        row.reverse();

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
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalCol = [...col];
        
        col = slide(col);
        
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
        
        col.reverse();
        col = slide(col);
        col.reverse();

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

// 8. KLAVYE GİRİŞLERİNİ DİNLEME
document.addEventListener('keyup', (e) => {
    let moved = false;
    
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

    if (moved) {
        addTile();
        checkGameOver();
    }

    document.getElementById("score").innerText = score;
});


// 9. MOBİL DOKUNMATİK DESTEĞİ İÇİN OLAY DİNLEYİCİLERİNİ KURMA
function setupTouchListeners() {
    const boardElement = document.getElementById("board");

    // Dokunma başladığında (parmak ekrana değdiğinde) koordinatları kaydet
    boardElement.addEventListener('touchstart', e => {
        // Mobil cihazın varsayılan kaydırma hareketini engelle (bu önemlidir)
        e.preventDefault(); 
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: false }); 

    // Dokunma bittiğinde (parmak ekrandan çekildiğinde) koordinatları kaydet
    boardElement.addEventListener('touchend', e => {
        e.preventDefault(); 
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        handleGesture();
    }, { passive: false });
}

// 10. MOBİL HAREKETİ HESAPLAMA FONKSİYONU
function handleGesture() {
    const diffX = touchendX - touchstartX; 
    const diffY = touchendY - touchstartY; 
    const threshold = 30; 
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    
    let moved = false;

    // Yön tespiti
    if (absDiffX > absDiffY && absDiffX > threshold) {
        if (diffX > 0) {
            moved = slideRight();
        } else {
            moved = slideLeft();
        }
    } 
    else if (absDiffY > absDiffX && absDiffY > threshold) {
        if (diffY > 0) {
            moved = slideDown();
        } else {
            moved = slideUp();
        }
    } else {
        return;
    }
    
    if (moved) {
        addTile();
        checkGameOver();
        document.getElementById("score").innerText = score;
    }
}


// 11. OYUN BİTTİ Mİ KONTROLÜ
function checkGameOver() {
    if (hasEmptyCell()) {
        return;
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let current = board[r][c];

            // Yan yana aynı taş var mı?
            if (c < columns - 1 && board[r][c+1] === current) {
                return;
            }
            // Alt alta aynı taş var mı?
            if (r < rows - 1 && board[r+1][c] === current) {
                return;
            }
        }
    }

    // Oyun bitti mesajı
    setTimeout(() => {
        alert("Oyun Bitti! Skorunuz: " + score);
    }, 100);
}

