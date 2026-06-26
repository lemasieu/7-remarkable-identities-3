/**
 * PROJECT: 7-remarkable-identities-3 (Asian Mode)
 * CORE ENGINE: Lightweight Polynomial Arithmetic Engine
 */

// --- 1. BỘ MÁY ĐẠI SỐ THU NHỎ (POLYNOMIAL ENGINE) ---

// Cộng hai đa thức: P1 + P2
function polyAdd(p1, p2) {
    let res = { ...p1 };
    for (let key in p2) {
        res[key] = (res[key] || 0) + p2[key];
        if (res[key] === 0) delete res[key];
    }
    return res;
}

// Trừ hai đa thức: P1 - P2
function polySub(p1, p2) {
    let res = { ...p1 };
    for (let key in p2) {
        res[key] = (res[key] || 0) - p2[key];
        if (res[key] === 0) delete res[key];
    }
    return res;
}

// Nhân hai đa thức: P1 * P2 (Nhân phân phối + cộng số mũ)
function polyMul(p1, p2) {
    let res = {};
    for (let k1 in p1) {
        for (let k2 in p2) {
            let [x1, y1] = k1.split(',').map(Number);
            let [x2, y2] = k2.split(',').map(Number);
            
            let rx = x1 + x2;
            let ry = y1 + y2;
            let rkey = `${rx},${ry}`;
            
            let coeff = p1[k1] * p2[k2];
            res[rkey] = (res[rkey] || 0) + coeff;
            
            if (res[rkey] === 0) delete res[rkey];
        }
    }
    return res;
}

// Lũy thừa đa thức: P^n
function polyPow(p, n) {
    let res = { "0,0": 1 }; // Đa thức bậc 0, hệ số 1
    for (let i = 0; i < n; i++) {
        res = polyMul(res, p);
    }
    return res;
}

// Chuyển đổi Object đa thức thành chuỗi HTML hiển thị chuẩn giáo khoa
function polyToString(poly, varX, varY) {
    // Sắp xếp các hạng tử theo số mũ X giảm dần, rồi đến Y giảm dần
    let keys = Object.keys(poly).sort((a, b) => {
        let [x1, y1] = a.split(',').map(Number);
        let [x2, y2] = b.split(',').map(Number);
        if (x1 !== x2) return x2 - x1;
        return y2 - y1;
    });

    if (keys.length === 0) return "0";

    let str = "";
    keys.forEach((key, index) => {
        let [x, y] = key.split(',').map(Number);
        let coeff = poly[key];

        // Xử lý dấu toán học kết nối các hạng tử
        if (coeff > 0 && index > 0) str += " + ";
        if (coeff < 0) {
            if (index > 0) str += " - ";
            else str += "-";
        }

        let absCoeff = Math.abs(coeff);
        
        // Xây dựng phần biến số
        let varParts = [];
        if (x > 0) varParts.push(x === 1 ? varX : `${varX}<sup>${x}</sup>`);
        if (y > 0) varParts.push(y === 1 ? varY : `${varY}<sup>${y}</sup>`);
        let varStr = varParts.join('.'); // Dùng dấu "." ngăn cách các biến số

        // Gộp hệ số và biến số lại
        if (!varStr) {
            str += `${absCoeff}`;
        } else {
            if (absCoeff === 1) str += varStr;
            else str += `${absCoeff}.${varStr}`;
        }
    });
    return str;
}


// --- 2. LOGIC SINH ĐỀ ASIAN MODE NÂNG CẤP (Random Inner Exponents) ---

function generateAsianQuestion() {
    const varPool = [ ['x', 'y'], ['a', 'b'], ['u', 'v'] ];
    const [varX, varY] = varPool[Math.floor(Math.random() * varPool.length)];
    
    const coeffs = [2, 3, 4, 5];
    const A = coeffs[Math.floor(Math.random() * coeffs.length)];
    let B;
    do { B = coeffs[Math.floor(Math.random() * coeffs.length)]; } while (A === B);

    // BƯỚC NHẢY VỌT: Khởi tạo số mũ ngẫu nhiên (từ 1 đến 3) cho các biến bên trong
    const ex = Math.floor(Math.random() * 3) + 1; // Số mũ của biến thứ nhất (vd: x^2)
    const ey = Math.floor(Math.random() * 3) + 1; // Số mũ của biến thứ hai (vd: y^3)

    // Khởi tạo các đa thức cơ sở nguyên bản với số mũ ngẫu nhiên
    const polyPlus = { [`${ex},0`]: A, [`0,${ey}`]: B };       // (A.x^ex + B.y^ey)
    const polyMinus = { [`${ex},0`]: A, [`0,${ey}`]: -B };     // (A.x^ex - B.y^ey)
    const polySinglePlus = { [`${ex},0`]: A, "0,0": B };       // (A.x^ex + B)

    // Các hàm Helper nhỏ để render chuỗi HTML đẹp mắt cho biến số mũ ngẫu nhiên
    const fVar = (v, e) => e === 1 ? v : `${v}<sup>${e}</sup>`;
    const strAx = `${A}${fVar(varX, ex)}`; // Tạo chuỗi dạng: 2x^2
    const strBy = `${B}${fVar(varY, ey)}`; // Tạo chuỗi dạng: 3y^3
    const strX = fVar(varX, ex);
    const strY = fVar(varY, ey);

    const templates = [
        // Dạng 1: Bình phương của tổng + Hiệu hai bình phương
        () => {
            let p1 = polyPow(polyPlus, 2);
            let p2 = polyMul(polyPlus, polyMinus);
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} + ${strBy})<sup>2</sup> + (${strAx} + ${strBy}).(${strAx} - ${strBy})`;
            let w1 = `(${strAx} - ${strBy})<sup>2</sup> + (${strAx} + ${strBy}).(${strAx} - ${strBy})`;
            let w2 = `(${strAx} + ${strBy})<sup>2</sup> - (${strAx} + ${strBy}).(${strAx} - ${strBy})`;
            let w3 = `(${strAx} + ${strBy})<sup>2</sup> + (${strAx} + ${strBy})<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 2: Khuyết cụm 2AB ở giữa
        () => {
            let p1 = polyPow(polyMinus, 2);
            let p2 = { [`${ex},${ey}`]: 2 * A * B }; // Hạng tử 2*A*B*(x^ex)*(y^ey)
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} - ${strBy})<sup>2</sup> + ${2*A*B}.${strX}.${strY}`;
            let w1 = `(${strAx} + ${strBy})<sup>2</sup> + ${2*A*B}.${strX}.${strY}`;
            let w2 = `(${strAx} - ${strBy})<sup>2</sup> - ${2*A*B}.${strX}.${strY}`;
            let w3 = `(${strAx} - ${strBy})<sup>2</sup> + ${A*B}.${strX}.${strY}`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 3: Triệt tiêu hai đầu (Hiệu hai bình phương mở rộng)
        () => {
            let p1 = polyPow(polyPlus, 2);
            let p2 = polyPow(polyMinus, 2);
            let finalPoly = polySub(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} + ${strBy})<sup>2</sup> - (${strAx} - ${strBy})<sup>2</sup>`;
            let w1 = `(${strAx} + ${strBy})<sup>2</sup> + (${strAx} - ${strBy})<sup>2</sup>`;
            let w2 = `(${strAx} - ${strBy})<sup>2</sup> - (${strAx} + ${strBy})<sup>2</sup>`;
            let w3 = `(${strAx} + ${strBy})<sup>2</sup> - (${strAx} + ${strBy})<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 4: Trộn Hằng đẳng thức một biến với một đa thức tự do bậc cao bên ngoài
        () => {
            const C = coeffs[Math.floor(Math.random() * coeffs.length)];
            let p1 = polyPow(polySinglePlus, 2);
            let p2 = { [`${ex * 2},0`]: C }; // Đa thức tự do C(x^ex)^2 = C.x^(2ex)
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} + ${B})<sup>2</sup> + ${C}${fVar(varX, ex * 2)}`;
            let w1 = `(${strAx} - ${B})<sup>2</sup> + ${C}${fVar(varX, ex * 2)}`;
            let w2 = `(${strAx} + ${B})<sup>2</sup> - ${C}${fVar(varX, ex * 2)}`;
            let w3 = `(${strAx} + ${B})<sup>3</sup> + ${C}${fVar(varX, ex * 2)}`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 5: Hiệu hai lập phương biến tướng
        () => {
            let p1 = polyPow(polyPlus, 3);
            let p2 = polyPow(polyMinus, 3);
            let finalPoly = polySub(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} + ${strBy})<sup>3</sup> - (${strAx} - ${strBy})<sup>3</sup>`;
            let w1 = `(${strAx} + ${strBy})<sup>3</sup> + (${strAx} - ${strBy})<sup>3</sup>`;
            let w2 = `(${strAx} - ${strBy})<sup>3</sup> - (${strAx} + ${strBy})<sup>3</sup>`;
            let w3 = `(${strAx} + ${strBy})<sup>2</sup> - (${strAx} - ${strBy})<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 6: Hệ quả Cauchy (Tổng hai lập phương rút gọn)
        () => {
            let p1 = polyPow(polyPlus, 3);
            let p3xy = { [`${ex},${ey}`]: 3 * A * B }; 
            let p2 = polyMul(p3xy, polyPlus); 
            let finalPoly = polySub(p1, p2); 

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} + ${strBy})<sup>3</sup> - ${3*A*B}.${strX}.${strY}.(${strAx} + ${strBy})`;
            let w1 = `(${strAx} + ${strBy})<sup>3</sup> + ${3*A*B}.${strX}.${strY}.(${strAx} + ${strBy})`;
            let w2 = `(${strAx} - ${strBy})<sup>3</sup> - ${3*A*B}.${strX}.${strY}.(${strAx} - ${strBy})`;
            let w3 = `(${strAx} + ${strBy})<sup>3</sup> - ${A*B}.${strX}.${strY}.(${strAx} + ${strBy})`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 7: Hệ quả Cauchy cho Hiệu hai lập phương
        () => {
            let p1 = polyPow(polyMinus, 3);
            let p3xy = { [`${ex},${ey}`]: 3 * A * B }; 
            let p2 = polyMul(p3xy, polyMinus); 
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} - ${strBy})<sup>3</sup> + ${3*A*B}.${strX}.${strY}.(${strAx} - ${strBy})`;
            let w1 = `(${strAx} - ${strBy})<sup>3</sup> - ${3*A*B}.${strX}.${strY}.(${strAx} - ${strBy})`;
            let w2 = `(${strAx} + ${strBy})<sup>3</sup> + ${3*A*B}.${strX}.${strY}.(${strAx} + ${strBy})`;
            let w3 = `(${strAx} - ${strBy})<sup>3</sup> + ${A*B}.${strX}.${strY}.(${strAx} - ${strBy})`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // Dạng 8: Trộn lập phương một biến với hằng số tự do
        () => {
            let p1 = polyPow(polySinglePlus, 3);
            let p2 = { "0,0": Math.pow(B, 3) }; 
            let finalPoly = polySub(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${strAx} + ${B})<sup>3</sup> - ${Math.pow(B, 3)}`;
            let w1 = `(${strAx} - ${B})<sup>3</sup> - ${Math.pow(B, 3)}`;
            let w2 = `(${strAx} + ${B})<sup>3</sup> + ${Math.pow(B, 3)}`;
            let w3 = `(${strAx} + ${B})<sup>2</sup> - ${Math.pow(B, 2)}`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        // ==========================================
        // 8 DẠNG ĐẢO NGƯỢC (Cho Khai triển -> Yêu cầu Thu gọn)
        // ==========================================
        () => {
            let p1 = polyPow(polyPlus, 2);
            let p2 = polyMul(polyPlus, polyMinus);
            // Q là chuỗi khai triển, A là kết quả đa thức
            let qStr = `(${strAx} + ${strBy})<sup>2</sup> + (${strAx} + ${strBy}).(${strAx} - ${strBy})`;
            let aStr = polyToString(polyAdd(p1, p2), varX, varY);
            // Nhờ máy tính cố tình làm sai phép toán để tạo đáp án nhiễu
            let w1 = polyToString(polySub(p1, p2), varX, varY);
            let w2 = polyToString(polyAdd(polyPow(polyMinus, 2), p2), varX, varY);
            let w3 = polyToString(polyAdd(p1, p1), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            let p1 = polyPow(polyMinus, 2);
            let p2 = { [`${ex},${ey}`]: 2 * A * B }; 
            let qStr = `(${strAx} - ${strBy})<sup>2</sup> + ${2*A*B}.${strX}.${strY}`;
            let aStr = polyToString(polyAdd(p1, p2), varX, varY);
            let w1 = polyToString(polySub(p1, p2), varX, varY);
            let w2 = polyToString(polyAdd(polyPow(polyPlus, 2), p2), varX, varY);
            let w3 = polyToString(polyAdd(p1, { [`${ex},${ey}`]: A * B }), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            let p1 = polyPow(polyPlus, 2);
            let p2 = polyPow(polyMinus, 2);
            let qStr = `(${strAx} + ${strBy})<sup>2</sup> - (${strAx} - ${strBy})<sup>2</sup>`;
            let aStr = polyToString(polySub(p1, p2), varX, varY);
            let w1 = polyToString(polyAdd(p1, p2), varX, varY);
            let w2 = polyToString(polySub(p2, p1), varX, varY);
            let w3 = polyToString(polySub(p1, { [`${ex},${ey}`]: 2 * A * B }), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            const C = coeffs[Math.floor(Math.random() * coeffs.length)];
            let p1 = polyPow(polySinglePlus, 2);
            let p2 = { [`${ex * 2},0`]: C }; 
            let qStr = `(${strAx} + ${B})<sup>2</sup> + ${C}${fVar(varX, ex * 2)}`;
            let aStr = polyToString(polyAdd(p1, p2), varX, varY);
            let w1 = polyToString(polySub(p1, p2), varX, varY);
            let w2 = polyToString(polyAdd(polyPow({ [`${ex},0`]: A, "0,0": -B }, 2), p2), varX, varY);
            let w3 = polyToString(polyAdd(p1, { [`${ex * 2},0`]: -C }), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            let p1 = polyPow(polyPlus, 3);
            let p2 = polyPow(polyMinus, 3);
            let qStr = `(${strAx} + ${strBy})<sup>3</sup> - (${strAx} - ${strBy})<sup>3</sup>`;
            let aStr = polyToString(polySub(p1, p2), varX, varY);
            let w1 = polyToString(polyAdd(p1, p2), varX, varY);
            let w2 = polyToString(polySub(p2, p1), varX, varY);
            let w3 = polyToString(polySub(polyPow(polyPlus, 2), polyPow(polyMinus, 2)), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            let p1 = polyPow(polyPlus, 3);
            let p3xy = { [`${ex},${ey}`]: 3 * A * B }; 
            let p2 = polyMul(p3xy, polyPlus); 
            let qStr = `(${strAx} + ${strBy})<sup>3</sup> - ${3*A*B}.${strX}.${strY}.(${strAx} + ${strBy})`;
            let aStr = polyToString(polySub(p1, p2), varX, varY);
            let w1 = polyToString(polyAdd(p1, p2), varX, varY);
            let w2 = polyToString(polySub(polyPow(polyMinus, 3), polyMul(p3xy, polyMinus)), varX, varY);
            let w3 = polyToString(polySub(p1, polyMul({ [`${ex},${ey}`]: A * B }, polyPlus)), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            let p1 = polyPow(polyMinus, 3);
            let p3xy = { [`${ex},${ey}`]: 3 * A * B }; 
            let p2 = polyMul(p3xy, polyMinus); 
            let qStr = `(${strAx} - ${strBy})<sup>3</sup> + ${3*A*B}.${strX}.${strY}.(${strAx} - ${strBy})`;
            let aStr = polyToString(polyAdd(p1, p2), varX, varY);
            let w1 = polyToString(polySub(p1, p2), varX, varY);
            let w2 = polyToString(polyAdd(polyPow(polyPlus, 3), polyMul(p3xy, polyPlus)), varX, varY);
            let w3 = polyToString(polyAdd(p1, polyMul({ [`${ex},${ey}`]: A * B }, polyMinus)), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        () => {
            let p1 = polyPow(polySinglePlus, 3);
            let p2 = { "0,0": Math.pow(B, 3) }; 
            let qStr = `(${strAx} + ${B})<sup>3</sup> - ${Math.pow(B, 3)}`;
            let aStr = polyToString(polySub(p1, p2), varX, varY);
            let w1 = polyToString(polyAdd(p1, p2), varX, varY);
            let w2 = polyToString(polySub(polyPow({ [`${ex},0`]: A, "0,0": -B }, 3), { "0,0": -Math.pow(B, 3) }), varX, varY);
            let w3 = polyToString(polySub(polyPow(polySinglePlus, 2), { "0,0": Math.pow(B, 2) }), varX, varY);
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        }
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate();
}

// --- 3. QUẢN LÝ TRẠNG THÁI TRÒ CHƠI & UI WORKFLOW ---

let score = 0;
let total = 0;

function initQuestion() {
    // Ẩn nút câu tiếp theo khi đang làm bài
    document.getElementById('next-btn').style.display = 'none';
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    // Sinh cấu trúc câu hỏi Asian Mode rút gọn toán học tự động
    const data = generateAsianQuestion();

    // Hiển thị câu hỏi lên giao diện
    document.getElementById('question').innerHTML = data.q + " = ?";

    // Tạo cấu trúc mảng chứa các phương án lựa chọn công bằng
    let allOptions = [
        { text: data.a, isCorrect: true },
        ...data.w.map(wText => ({ text: wText, isCorrect: false }))
    ];
    shuffle(allOptions);

    // Render các button lựa chọn ra cây DOM HTML
    allOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerHTML = opt.text;
        btn.dataset.isCorrect = opt.isCorrect;
        btn.onclick = () => checkAnswer(btn, opt.isCorrect);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedBtn, isCorrect) {
    const options = document.querySelectorAll('.option');
    // Khóa tất cả các nút sau khi người dùng đã chốt câu trả lời
    options.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        // Thuật toán quét và Highlight đáp án đúng màu xanh để học sinh đối chiếu học tập
        options.forEach(btn => {
            if (btn.dataset.isCorrect === 'true' || btn.dataset.isCorrect === true) {
                btn.classList.add('correct');
            }
        });
    }

    total++;
    updateScoreboard();
    document.getElementById('next-btn').style.display = 'inline-block';
}

function updateScoreboard() {
    const percent = total === 0 ? 0 : Math.round((score / total) * 100);
    document.getElementById('score-text').innerHTML = `Số câu đúng: ${score}/${total} (${percent}%)`;
}

// Thuật toán xáo trộn mảng Fisher-Yates chuẩn xác tuyệt đối toàn bộ danh mục
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Khởi chạy hệ thống ngay sau khi toàn bộ cấu trúc trang tải hoàn tất
window.onload = () => {
    initQuestion();
    document.getElementById('next-btn').onclick = initQuestion;
};