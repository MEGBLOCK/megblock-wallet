function createWallet() {
  const words = ["apple", "block", "chain", "future", "crypto", "megblock", "secure", "wallet", "trust", "global", "token", "value"];
  let seed = [];
  for (let i = 0; i < 12; i++) {
    seed.push(words[Math.floor(Math.random() * words.length)]);
  }
  const seedPhrase = seed.join(" ");
  const walletAddress = "MB-" + Math.random().toString(36).substring(2, 12).toUpperCase();

  document.getElementById("seedPhrase").innerText = seedPhrase;
  document.getElementById("walletAddress").innerText = walletAddress;

  // Store locally for download
  localStorage.setItem("megblock_seed", seedPhrase);
  localStorage.setItem("megblock_address", walletAddress);
}

function downloadWallet() {
  const seed = localStorage.getItem("megblock_seed");
  const address = localStorage.getItem("megblock_address");

  if (!seed || !address) {
    alert("Please create a wallet first!");
    return;
  }

  const content = `Seed Phrase:\n${seed}\n\nAddress:\n${address}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "megblock_wallet.txt";
  a.click();
}

document.getElementById("createWallet").onclick = createWallet;
document.getElementById("downloadWallet").onclick = downloadWallet;
