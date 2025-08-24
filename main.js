let currentWallet = null;

function createWallet() {
    // Generate a random seed phrase (for now simple words)
    const words = [];
    const wordList = ["apple","block","chain","crypto","dream","energy","future","gold","hash","idea","journey","key","ledger","meg","node","open","peer","quantum","reward","seed"];
    for (let i = 0; i < 12; i++) {
        words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    const seedPhrase = words.join(" ");

    // Make wallet object
    currentWallet = {
        id: "MB-" + Math.floor(Math.random() * 1e9),
        seed: seedPhrase,
        balance: 0
    };

    // Show wallet in page
    document.getElementById("wallet-id").textContent = currentWallet.id;
    document.getElementById("seed-phrase").textContent = currentWallet.seed;
    document.getElementById("balance").textContent = currentWallet.balance + " MB";
}

function downloadWallet() {
    if (!currentWallet) {
        alert("❌ No wallet created yet");
        return;
    }
    const blob = new Blob([JSON.stringify(currentWallet, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentWallet.id + ".json";
    a.click();
    URL.revokeObjectURL(url);
}
