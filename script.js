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


// --- 2. LOGIC SINH ĐỀ ASIAN MODE (MIX & MATCH TEMPLATES) ---

function generateAsianQuestion() {
    // Bộ biến số ngẫu nhiên đa dạng nhằm tăng độ khó thị giác
    const varPool = [ ['x', 'y'], ['a', 'b'], ['u', 'v'] ];
    const [varX, varY] = varPool[Math.floor(Math.random() * varPool.length)];
    
    const coeffs = [2, 3, 4, 5];
    const A = coeffs[Math.floor(Math.random() * coeffs.length)];
    let B;
    do { B = coeffs[Math.floor(Math.random() * coeffs.length)]; } while (A === B);

    // Khởi tạo các đa thức cơ sở nguyên bản
    const polyPlus = { "1,0": A, "0,1": B };       // (Ax + By)
    const polyMinus = { "1,0": A, "0,1": -B };     // (Ax - By)

    // Danh sách các Template đề trộn lẫn cực gắt kiểu Châu Á
    const templates = [
        // Dạng 1: (Ax + By)^2 + (Ax + By)(Ax - By) => Máy tự rút gọn hạng tử đồng dạng
        () => {
            let p1 = polyPow(polyPlus, 2);
            let p2 = polyMul(polyPlus, polyMinus);
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} + ${B}${varY})<sup>2</sup> + (${A}${varX} + ${B}${varY}).(${A}${varX} - ${B}${varY})`;
            
            let w1 = `(${A}${varX} - ${B}${varY})<sup>2</sup> + (${A}${varX} + ${B}${varY}).(${A}${varX} - ${B}${varY})`;
            let w2 = `(${A}${varX} + ${B}${varY})<sup>2</sup> - (${A}${varX} + ${B}${varY}).(${A}${varX} - ${B}${varY})`;
            let w3 = `(${A}${varX} + ${B}${varY})<sup>2</sup> + (${A}${varX} + ${B}${varY})<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },
        
        // Dạng 2: (Ax - By)^2 + 2ABxy => Rút gọn triệt tiêu hạng tử ở giữa thành tổng hai bình phương
        () => {
            let p1 = polyPow(polyMinus, 2);
            let p2 = { "1,1": 2 * A * B }; // Hạng tử 2ABxy
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} - ${B}${varY})<sup>2</sup> + ${2*A*B}.${varX}.${varY}`;
            
            let w1 = `(${A}${varX} + ${B}${varY})<sup>2</sup> + ${2*A*B}.${varX}.${varY}`;
            let w2 = `(${A}${varX} - ${B}${varY})<sup>2</sup> - ${2*A*B}.${varX}.${varY}`;
            let w3 = `(${A}${varX} - ${B}${varY})<sup>2</sup> + ${A*B}.${varX}.${varY}`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },

        // Dạng 3: (Ax + By)^2 - (Ax - By)^2 => Triệt tiêu hai đầu, chỉ còn lại hạng tử tích ở giữa
        () => {
            let p1 = polyPow(polyPlus, 2);
            let p2 = polyPow(polyMinus, 2);
            let finalPoly = polySub(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} + ${B}${varY})<sup>2</sup> - (${A}${varX} - ${B}${varY})<sup>2</sup>`;
            
            let w1 = `(${A}${varX} + ${B}${varY})<sup>2</sup> + (${A}${varX} - ${B}${varY})<sup>2</sup>`;
            let w2 = `(${A}${varX} - ${B}${varY})<sup>2</sup> - (${A}${varX} + ${B}${varY})<sup>2</sup>`;
            let w3 = `(${A}${varX} + ${B}${varY})<sup>2</sup> - (${A}${varX} + ${B}${varY})<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },

        // Dạng 4: Trộn Hằng đẳng thức một biến với một đa thức tự do bậc 2 bên ngoài: (Ax + B)^2 + Cx^2
        () => {
            const C = coeffs[Math.floor(Math.random() * coeffs.length)];
            const polySinglePlus = { "1,0": A, "0,0": B }; // Đa thức dạng (Ax + B)
            
            let p1 = polyPow(polySinglePlus, 2);
            let p2 = { "2,0": C }; // Đa thức bổ sung tự do Cx^2
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} + ${B})<sup>2</sup> + ${C}${varX}<sup>2</sup>`;
            
            let w1 = `(${A}${varX} - ${B})<sup>2</sup> + ${C}${varX}<sup>2</sup>`;
            let w2 = `(${A}${varX} + ${B})<sup>2</sup> - ${C}${varX}<sup>2</sup>`;
            let w3 = `(${A}${varX} + ${B})<sup>3</sup> + ${C}${varX}<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },

        // Dạng 5: Hiệu hai lập phương biến tướng hệ quả cực hay: (Ax + By)^3 - (Ax - By)^3
        // Máy sẽ tự động rút gọn chỉ còn lại các số hạng chứa x^2.y và y^3
        () => {
            let p1 = polyPow(polyPlus, 3);
            let p2 = polyPow(polyMinus, 3);
            let finalPoly = polySub(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} + ${B}${varY})<sup>3</sup> - (${A}${varX} - ${B}${varY})<sup>3</sup>`;
            
            let w1 = `(${A}${varX} + ${B}${varY})<sup>3</sup> + (${A}${varX} - ${B}${varY})<sup>3</sup>`;
            let w2 = `(${A}${varX} - ${B}${varY})<sup>3</sup> - (${A}${varX} + ${B}${varY})<sup>3</sup>`;
            let w3 = `(${A}${varX} + ${B}${varY})<sup>2</sup> - (${A}${varX} - ${B}${varY})<sup>2</sup>`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },

        // Dạng 6: Hằng đẳng thức đáng nhớ hệ quả Cauchy (Tổng hai lập phương rút gọn)
        // Công thức: (Ax + By)^3 - 3ABxy(Ax + By) = A^3x^3 + B^3y^3
        // Học sinh nhìn đề bài rút gọn "A^3x^3 + B^3y^3" sẽ phải tư duy rất nhiều
        () => {
            let p1 = polyPow(polyPlus, 3);
            let p3xy = { "1,1": 3 * A * B }; // 3ABxy
            let p2 = polyMul(p3xy, polyPlus); // 3ABxy(Ax + By)
            let finalPoly = polySub(p1, p2); 

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} + ${B}${varY})<sup>3</sup> - ${3*A*B}.${varX}.${varY}.(${A}${varX} + ${B}${varY})`;
            
            let w1 = `(${A}${varX} + ${B}${varY})<sup>3</sup> + ${3*A*B}.${varX}.${varY}.(${A}${varX} + ${B}${varY})`;
            let w2 = `(${A}${varX} - ${B}${varY})<sup>3</sup> - ${3*A*B}.${varX}.${varY}.(${A}${varX} - ${B}${varY})`;
            let w3 = `(${A}${varX} + ${B}${varY})<sup>3</sup> - ${A*B}.${varX}.${varY}.(${A}${varX} + ${B}${varY})`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },

        // Dạng 7: Hệ quả Cauchy cho Hiệu hai lập phương
        // Công thức: (Ax - By)^3 + 3ABxy(Ax - By) = A^3x^3 - B^3y^3
        () => {
            let p1 = polyPow(polyMinus, 3);
            let p3xy = { "1,1": 3 * A * B }; // 3ABxy
            let p2 = polyMul(p3xy, polyMinus); // 3ABxy(Ax - By)
            let finalPoly = polyAdd(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} - ${B}${varY})<sup>3</sup> + ${3*A*B}.${varX}.${varY}.(${A}${varX} - ${B}${varY})`;
            
            let w1 = `(${A}${varX} - ${B}${varY})<sup>3</sup> - ${3*A*B}.${varX}.${varY}.(${A}${varX} - ${B}${varY})`;
            let w2 = `(${A}${varX} + ${B}${varY})<sup>3</sup> + ${3*A*B}.${varX}.${varY}.(${A}${varX} + ${B}${varY})`;
            let w3 = `(${A}${varX} - ${B}${varY})<sup>3</sup> + ${A*B}.${varX}.${varY}.(${A}${varX} - ${B}${varY})`;
            
            return { q: qStr, a: aStr, w: [w1, w2, w3] };
        },

        // Dạng 8: Trộn lập phương một biến với hằng số tự do bậc cao: (Ax + B)^3 - B^3
        // Kết quả thu gọn triệt tiêu hệ số tự do, chỉ còn chuỗi bậc 3, bậc 2, bậc 1 liên tiếp
        () => {
            const polySinglePlus = { "1,0": A, "0,0": B }; // Đa thức (Ax + B)
            let p1 = polyPow(polySinglePlus, 3);
            let p2 = { "0,0": Math.pow(B, 3) }; // Hằng số B^3
            let finalPoly = polySub(p1, p2);

            let qStr = polyToString(finalPoly, varX, varY);
            let aStr = `(${A}${varX} + ${B})<sup>3</sup> - ${Math.pow(B, 3)}`;
            
            let w1 = `(${A}${varX} - ${B})<sup>3</sup> - ${Math.pow(B, 3)}`;
            let w2 = `(${A}${varX} + ${B})<sup>3</sup> + ${Math.pow(B, 3)}`;
            let w3 = `(${A}${varX} + ${B})<sup>2</sup> - ${Math.pow(B, 2)}`;
            
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