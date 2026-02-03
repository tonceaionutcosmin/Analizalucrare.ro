async function noteaza() {
    const input = document.getElementById("fileInput");
    const output = document.getElementById("output");
    const result = document.getElementById("result");

    if (!input.files.length) {
        alert("Selectează un fișier .txt sau .pdf!");
        return;
    }

    const file = input.files[0];
    const ext = file.name.split(".").pop().toLowerCase();
    let text = "";

    if (ext === "txt") {
        text = await readTxt(file);
    } else if (ext === "pdf") {
        text = await readPdf(file);
    } else {
        alert("Format neacceptat!");
        return;
    }

    const wordsArray = text
        .toLowerCase()
        .replace(/[^a-zăâîșț\s]/gi, "")
        .split(/\s+/)
        .filter(w => w.length > 2);

    const totalWords = wordsArray.length;
    const uniqueWords = new Set(wordsArray).size;

    const originality = calculeazaOriginalitate(wordsArray);
    const nota = calculeazaNota(totalWords, originality);

    output.textContent =
        `📄 Fișier: ${file.name}\n` +
        `📝 Număr cuvinte: ${totalWords}\n` +
        `📚 Cuvinte unice: ${uniqueWords}\n` +
        `🧠 Originalitate estimată: ${originality}%\n` +
        `🎓 Nota finală: ${nota}`;

    result.classList.remove("hidden");
}

// ===== TXT =====
function readTxt(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// ===== PDF =====
async function readPdf(file) {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
    }

    return text;
}

// ===== ORIGINALITATE =====
function calculeazaOriginalitate(words) {
    const total = words.length;
    const unique = new Set(words).size;

    // penalizare pentru vocabular sărac
    let originality = Math.round((unique / total) * 100);

    // fraze academice comune
    const phrases = [
        "în concluzie",
        "lucrarea de față",
        "se poate observa",
        "în cadrul acestei lucrări",
        "din punct de vedere"
    ];

    let penalty = 0;
    phrases.forEach(p => {
        if (words.join(" ").includes(p)) penalty += 3;
    });

    originality -= penalty;

    if (originality < 30) originality = 30;
    if (originality > 100) originality = 100;

    return originality;
}

// ===== NOTARE =====
function calculeazaNota(words, originality) {
    let nota = 5;

    if (words > 5000) nota++;
    if (words > 8000) nota++;

    if (originality > 70) nota++;
    if (originality > 85) nota++;

    if (nota > 10) nota = 10;
    return nota;
}
