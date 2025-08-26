// DOM elements
const createBtn = document.getElementById("createWallet");
const downloadBtn = document.getElementById("downloadWallet");
const copyBtn = document.getElementById("copyWallet");
const redeemBtn = document.getElementById("redeemVoucher");
const sendBtn = document.getElementById("sendMB");

const emailInput = document.getElementById("email");
const dobInput = document.getElementById("dob");
const voucherInput = document.getElementById("voucherCode");
const voucherTermsCheckbox = document.getElementById("voucherTerms");
const recipientInput = document.getElementById("recipientID");
const transferInput = document.getElementById("transferAmount");
const senderSeedInput = document.getElementById("senderSeed");

const seedText = document.getElementById("seedPhrase");
const walletAddressText = document.getElementById("walletAddress");
const walletBalanceText = document.getElementById("walletBalance");
const totalMintedText = document.getElementById("totalMinted");
const nextRewardText = document.getElementById("nextReward");
const walletHistoryDiv = document.getElementById("walletHistory");

// Constants
const MAX_SUPPLY = 120000000;
const FIRST_100_REWARD = 100;
const BASE_REWARD = 1;
const HALVING_THRESHOLD = 70000000;
const HALVED_REWARD = 0.3;
const VOUCHER_RESERVE = 20000000;

// Voucher codes
const vouchers = {
  "EARLY100": 100,
  "WELCOME10": 10,
  "MEGBLOCK50": 50
};

// Helper functions
function totalMinted() {
  const wallets = JSON.parse(localStorage.getItem("megblock_wallets") || "[]");
  return wallets.reduce((sum, w) => sum + w.balance, 0);
}

function nextReward() {
  const wallets = JSON.parse(localStorage.getItem("megblock_wallets") || "[]");
  let minted = totalMinted();
  if (wallets.length < 100) return FIRST_100_REWARD;
  if (minted >= HALVING_THRESHOLD) return HALVED_REWARD;
  return BASE_REWARD;
}

function getLastWallet() {
  const wallets = JSON.parse(localStorage.getItem("megblock_wallets") || "[]");
  return wallets.length ? wallets[wallets.length - 1] : null;
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function updateHistory() {
  const wallets = JSON.parse(localStorage.getItem("megblock_wallets") || "[]");
  walletHistoryDiv.innerHTML = "";
  wallets.forEach(w => {
    if (w.history) {
      w.history.forEach(entry => walletHistoryDiv.innerHTML += `${entry}<br>`);
    }
  });

  const lastWallet = getLastWallet();
  walletBalanceText.innerText = lastWallet ? lastWallet.balance + " MB" : "0 MB";
  totalMintedText.innerText = totalMinted();
  nextRewardText.innerText = nextReward();
}

// Wallet creation
createBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const dob = dobInput.value;

  if (!email || !dob) return alert("Enter your email and DOB!");
  if (calculateAge(dob) < 18) return alert("You must be 18+!");

  let wallets = JSON.parse(localStorage.getItem("megblock_wallets") || "[]");
  if (wallets.some(w => w.email === email)) return alert("Wallet already exists for this email!");

  const words = ["apple","block","chain","future","crypto","megblock","secure","wallet","trust","global","token","value"];
  let seed = [];
  for (let i = 0; i < 12; i++) seed.push(words[Math.floor(Math.random() * words.length)]);
  const seedPhrase = seed.join(" ");

  let walletAddress;
  do {
    walletAddress = "MB-" + Math.random().toString(36).substring(2,12).toUpperCase();
  } while(wallets.some(w => w.address === walletAddress));

  let minted = totalMinted();
  let balance = wallets.length < 100 ? FIRST_100_REWARD : minted >= HALVING_THRESHOLD ? HALVED_REWARD : BASE_REWARD;
  if (minted + balance > MAX_SUPPLY - VOUCHER_RESERVE) {
    balance = Math.max(0, MAX_SUPPLY - VOUCHER_RESERVE - minted);
  }

  const history = [`${new Date().toLocaleString()}: Wallet created with balance ${balance} MB`];

  wallets.push({ seed: seedPhrase, address: walletAddress, balance, email, dob, history });
  localStorage.setItem("megblock_wallets", JSON.stringify(wallets));
  seedText.value = seedPhrase;
  walletAddressText.innerText = walletAddress;
  updateHistory();
});

// P2P transfer with seed verification
sendBtn.addEventListener("click", () => {
  const recipientID = recipientInput.value.trim().toUpperCase();
  const amount = parseFloat(transferInput.value);
  const enteredSeed = senderSeedInput.value.trim();

  if (!recipientID || isNaN(amount) || amount <= 0) return alert("Enter valid recipient and amount!");

  let wallets = JSON.parse(localStorage.getItem("megblock_wallets") || "[]");
  let sender = getLastWallet();
  if (!sender) return alert("Create a wallet first!");

  if (!enteredSeed || enteredSeed !== sender.seed) return alert("Incorrect seed phrase. Transfer cancelled!");

  let receiver = wallets.find(w => w.address === recipientID);
  if (!receiver) return alert("Recipient wallet not found!");
  if (sender.balance < amount) return alert("Insufficient MB in your wallet!");

  if (!confirm(`Confirm sending ${amount} MB to ${receiver.address}?`)) return;

  sender.balance -= amount;
  receiver.balance += amount;

  const timestamp = new Date().toLocaleString();
  sender.history.push(`${timestamp}: Sent ${amount} MB → ${receiver.address}. Balance: ${sender.balance}`);
  receiver.history.push(`${timestamp}: Received ${amount} MB from ${sender.address}. Balance: ${receiver.balance}`);

  localStorage.setItem("megblock_wallets", JSON.stringify(wallets));
  updateHistory();

  alert(`Transfer complete! Sent ${amount} MB to ${receiver.address}`);
  recipientInput.value = "";
  transferInput.value = "";
  senderSeedInput.value = "";
});

// Initialize display
updateHistory();
