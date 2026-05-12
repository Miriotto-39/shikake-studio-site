const form = document.querySelector("#apply-form");
const output = document.querySelector("#application-text");
const copyButton = document.querySelector("#copy-application");

let latestApplication = "";

function valueOf(id) {
  return document.querySelector(id).value.trim() || "未入力";
}

function checked(id) {
  return document.querySelector(id).checked ? "同意済み" : "未同意";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  latestApplication = [
    "限定モニター申込下書き",
    "",
    `呼び名: ${valueOf("#display-name")}`,
    `連絡用メール: ${valueOf("#email")}`,
    `業種・活動内容: ${valueOf("#business")}`,
    `作りたいもの: ${valueOf("#deliverable")}`,
    `困っていること: ${valueOf("#problem")}`,
    `希望する成果物: ${valueOf("#expected")}`,
    `実績化の可否: ${valueOf("#case-study")}`,
    "",
    "モニター条件:",
    `- 試作品であること: ${checked("#agree-prototype")}`,
    `- 機密情報等を送らないこと: ${checked("#agree-sensitive")}`,
    `- 専門判断は対象外: ${checked("#agree-scope")}`,
    "",
    "注意: この下書きフォームはローカルで動作し、外部送信しません。",
  ].join("\n");

  output.textContent = latestApplication;
  copyButton.disabled = false;
  copyButton.textContent = "申込文をコピー";
});

copyButton.addEventListener("click", async () => {
  if (!latestApplication) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestApplication);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
