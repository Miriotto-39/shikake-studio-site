const form = document.querySelector("#order-form");
const output = document.querySelector("#order-text");
const copyButton = document.querySelector("#copy-order");

let latestOrder = "";

function valueOf(id) {
  return document.querySelector(id).value.trim() || "未入力";
}

function checked(id) {
  return document.querySelector(id).checked ? "確認済み" : "未確認";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  latestOrder = [
    "有料モニター申込前チェック",
    "",
    `希望プラン: ${valueOf("#plan")}`,
    `希望成果物: ${valueOf("#deliverable")}`,
    `使う場面: ${valueOf("#usage-scene")}`,
    `期待する判断材料: ${valueOf("#decision")}`,
    `実績化の可否: ${valueOf("#case-study")}`,
    "",
    "有料対応前の確認:",
    `- このページでは決済や請求が行われない: ${checked("#agree-no-payment")}`,
    `- 対象外条件を理解した: ${checked("#agree-scope")}`,
    `- 機密情報等を送らない: ${checked("#agree-sensitive")}`,
    `- 請求方法等は個別確認後に確定する: ${checked("#agree-finalize")}`,
    "",
    "注意: この下書きフォームはブラウザ内で確認文を作るだけで、外部送信、請求、決済を行いません。",
  ].join("\n");

  output.textContent = latestOrder;
  copyButton.disabled = false;
  copyButton.textContent = "確認文をコピー";
});

copyButton.addEventListener("click", async () => {
  if (!latestOrder) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestOrder);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
