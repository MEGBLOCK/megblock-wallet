// Simple word list (you can replace with full BIP39 later)
const words = ["apple", "block", "chain", "wallet", "seed", "future", "crypto", "megblock", "secure", "token", "mining", "digital"];

function generateWallet() {
  // Generate a random 12-word seed phrase
  let seed = [];
  for (let i = 0; i < 12; i++) {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    seed.push(randomWord);
  }
  let seedPhrase = seed.join(" ");

  // Fake address (later replace with real derivation if needed)
  let walletAddress = "MB" + Math.random().toString(36).substring(2, 12).toUpperCase();

  // Show on page
  document.getElementById("seedPhrase").innerText = seedPhrase;
  document.getElementById("walletAddress").innerText = walletAddress;

  // Save for download
  localStorage.setItem("megblock_seed", seedPhrase);
  localStorage.setItem("megblock_address", walletAddress);
}

function downloadWallet() {
  let seed = localStorage.getItem("megblock_seed");
  let address = localStorage.getItem("megblock_address");

  if (!seed || !address) {
    alert("⚠️ No wallet created yet!");
    return;
  }

  let walletData = `MEGBLOCK WALLET\n\nSeed Phrase:\n${seed}\n\nAddress:\n${address}`;
  let blob = new Blob([walletData], { type: "text/plain" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "megblock_wallet.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}