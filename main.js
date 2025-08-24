// ===== MEGBLOCK JS =====
let totalDistributed = 0;
let first100BonusGiven = 0;
const MAX_PHASE1 = 50000000;
const walletsByIP = {};
const wallets = {};
let currentWallet = null;
let currentSeed = null;
const vouchers = { "VOUCHER001":10, "VOUCHER002":10 };

function generateWalletID() { return 'MB'+Math.floor(Math.random()*1e8); }

function createWallet(){
  const ip = "USER_IP"; 
  if(walletsByIP[ip]) { alert("This IP already has a wallet."); return; }
  if(totalDistributed>=MAX_PHASE1) { alert("Phase 1 cap reached."); return; }

  currentSeed = bip39.generateMnemonic();
  let balance = 1;
  if(first100BonusGiven<100){ balance+=100; first100BonusGiven++; }

  const walletID = generateWalletID();
  walletsByIP[ip]=walletID;
  wallets[walletID]={balance, redeemedVouchers:[]};
  totalDistributed+=balance;
  currentWallet = wallets[walletID];

  updateWalletInfo();
}

function updateWalletInfo(){
  if(!currentWallet) return;
  const walletDiv = document.getElementById("walletInfo");
  const walletID = Object.keys(walletsByIP).find(ip=>walletsByIP[ip]===Object.keys(wallets).find(id=>wallets[id]===currentWallet));
  walletDiv.innerHTML=`<strong>Wallet ID:</strong> ${walletID}<br><strong>Seed Phrase:</strong> ${currentSeed}<br><strong>Balance:</strong> ${currentWallet.balance} MB`;
}

function redeemVoucher(){
  if(!currentWallet){ alert("Please create a wallet first."); return; }
  const code = document.getElementById("voucherCode").value;
  if(vouchers[code] && !currentWallet.redeemedVouchers.includes(code)){
    currentWallet.balance+=vouchers[code];
    currentWallet.redeemedVouchers.push(code);
    delete vouchers[code];
    alert(`Voucher redeemed! Current balance: ${currentWallet.balance} MB`);
    updateWalletInfo();
  } else { alert("Invalid or already redeemed voucher."); }
}

function sendMB(){
  if(!currentWallet){ alert("Please create a wallet first."); return; }
  const recipientID=document.getElementById("recipientID").value;
  const amount=parseFloat(document.getElementById("transferAmount").value);
  if(currentWallet.balance>=amount){
    if(!wallets[recipientID]) wallets[recipientID]={balance:0,redeemedVouchers:[]};
    currentWallet.balance-=amount;
    wallets[recipientID].balance+=amount;
    alert(`Sent ${amount} MB to ${recipientID}. Your balance: ${currentWallet.balance} MB`);
    updateWalletInfo();
  } else { alert("Insufficient balance."); }
}

// Event listeners
document.getElementById("createWallet").addEventListener("click",createWallet);
document.getElementById("copySeed").addEventListener("click",()=>{ navigator.clipboard.writeText(currentSeed); alert("Seed copied!"); });
document.getElementById("downloadWallet").addEventListener("click",()=>{ 
  if(!currentWallet) { alert("No wallet created yet."); return; }
  const walletID=Object.keys(walletsByIP).find(ip=>walletsByIP[ip]===Object.keys(wallets).find(id=>wallets[id]===currentWallet));
  const data={walletID,seedPhrase:currentSeed,balance:currentWallet.balance,redeemedVouchers:currentWallet.redeemedVouchers};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="megblock_wallet.json"; a.click();
  URL.revokeObjectURL(url);
});
document.getElementById("redeemVoucher").addEventListener("click",redeemVoucher);
document.getElementById("sendMB").addEventListener("click",sendMB);
