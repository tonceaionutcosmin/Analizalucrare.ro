function noteaza() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) {
        alert("Selectează un fișier .txt");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result.trim();

        /* =====================
           PREPROCESARE TEXT
        ===================== */
        const words = text
            .toLowerCase()
            .split(/\s+/)
            .map(w => w.replace(/[^a-zăâîșț]/gi, ""))
            .filter(w => w.length > 2);

        const totalWords = words.length;
        const uniqueWords = new Set(words).size;
        const lexicalDiversity = (uniqueWords / totalWords) * 100;

        /* =====================
           REPETIȚII CUVINTE
        ===================== */
        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);

        const repetitiveWords = Object.entries(freq)
            .filter(([_, v]) => v > 15)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        /* =====================
           FRAZE IDENTICE
        ===================== */
        const sentences = text
            .split(/[.!?]/)
            .map(s => s.trim())
            .filter(s => s.length > 25);

        const sentenceFreq = {};
        sentences.forEach(s => sentenceFreq[s] = (sentenceFreq[s] || 0) + 1);

        const duplicatedSentences =
            Object.values(sentenceFreq).filter(v => v > 1).length;

        /* =====================
           SCOR PLAGIAT
        ===================== */
        let riskScore = 0;

        if (lexicalDiversity < 40) riskScore += 3;
        if (lexicalDiversity < 30) riskScore += 2;
        if (duplicatedSentences > 3) riskScore += 3;
        if (duplicatedSentences > 8) riskScore += 2;
        if (repetitiveWords.length > 5) riskScore += 2;

        let plagiarismRisk = "SCĂZUT";
        if (riskScore >= 5) plagiarismRisk = "MEDIU";
        if (riskScore >= 9) plagiarismRisk = "RIDICAT";

        /* =====================
           NOTĂ FINALĂ
        ===================== */
        let nota = 5;
        if (totalWords > 500) nota++;
        if (totalWords > 1000) nota++;
        if (lexicalDiversity > 45) nota++;
        if (lexicalDiversity > 55) nota++;
        if (plagiarismRisk === "RIDICAT") nota -= 2;

        nota = Math.max(1, Math.min(10, nota));

        /* =====================
           AFIȘARE
        ===================== */
        document.getElementById("output").textContent =
`ANALIZĂ PLAGIAT ȘI CALITATE

Număr cuvinte: ${totalWords}
Cuvinte unice: ${uniqueWords}
Diversitate lexicală: ${lexicalDiversity.toFixed(2)}%

Fraze identice: ${duplicatedSentences}
Cuvinte repetate excesiv:
${repetitiveWords.map(r => `${r[0]} (${r[1]} ori)`).join(", ") || "Niciunul"}

RISC PLAGIAT: ${plagiarismRisk}

NOTĂ ESTIMATĂ: ${nota}`;

        document.getElementById("result").classList.remove("hidden");
    };

    reader.readAsText(file);
}