const form = document.querySelector("#offer-form");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copy-output");
let latestBrief = "";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function valueOf(selector, fallback) {
  return document.querySelector(selector).value.trim() || fallback;
}

function buildBrief(serviceName, target, problem, value, nextAction) {
  const offer = `${serviceName}は、${problem}と感じている${target}に向けて、${value}サービスです。まずは${nextAction}ことで、次の一歩を始められます。`;

  const headlines = [
    `${problem}を、ひとりで抱え込まないための${serviceName}`,
    `${target}のための、はじめやすい${serviceName}`,
    `${value}。だから、最初の一歩が軽くなる。`,
  ];

  const socialThemes = [
    `悩みの共感: ${target}が「${problem}」と感じる場面を具体的に紹介する`,
    `選ばれる理由: ${serviceName}で${value}できる理由をわかりやすく伝える`,
    `行動の後押し: ${nextAction}までの流れを短く見せ、不安を減らす`,
  ];

  const inquiry = [
    `${serviceName}が気になる方は、まず${nextAction}ください。`,
    "詳しい状況を確認したうえで、無理に申し込みを勧めず、合う進め方をご案内します。",
    "個人情報や機密情報は、必要な確認ができるまでは送らないでください。",
  ].join("\n");

  return { offer, headlines, socialThemes, inquiry };
}

function renderBrief() {
  const serviceName = valueOf("#service-name", "サービス");
  const target = valueOf("#target", "対象顧客");
  const problem = valueOf("#problem", "解決したい悩み");
  const value = valueOf("#value", "提供価値");
  const nextAction = valueOf("#next-action", "問い合わせる");
  const brief = buildBrief(serviceName, target, problem, value, nextAction);

  latestBrief = [
    "オファーブリーフ",
    "",
    `サービス名: ${serviceName}`,
    `対象顧客: ${target}`,
    `悩み: ${problem}`,
    `提供価値: ${value}`,
    `次に取ってほしい行動: ${nextAction}`,
    "",
    "短いオファーブリーフ:",
    brief.offer,
    "",
    "LP見出し案:",
    ...brief.headlines.map((headline, index) => `${index + 1}. ${headline}`),
    "",
    "SNS投稿テーマ:",
    ...brief.socialThemes.map((theme, index) => `${index + 1}. ${theme}`),
    "",
    "問い合わせ誘導文:",
    brief.inquiry,
    "",
    "注意: 実名、連絡先、顧客情報、機密情報、認証情報、金融情報は入力しないでください。公開前に、事実、価格、権利、表現の確認が必要です。",
  ].join("\n");

  output.className = "brief-output";
  output.innerHTML = `
    <article class="brief-card">
      <h3>短いオファーブリーフ</h3>
      <p>${escapeHtml(brief.offer)}</p>
    </article>
    <article class="brief-card">
      <h3>LP見出し案</h3>
      <ul>
        ${brief.headlines.map((headline) => `<li>${escapeHtml(headline)}</li>`).join("")}
      </ul>
    </article>
    <article class="brief-card">
      <h3>SNS投稿テーマ</h3>
      <ul>
        ${brief.socialThemes.map((theme) => `<li>${escapeHtml(theme)}</li>`).join("")}
      </ul>
    </article>
    <article class="brief-card">
      <h3>問い合わせ誘導文</h3>
      <p>${escapeHtml(brief.inquiry)}</p>
    </article>
    <div class="warning-card">
      実名、連絡先、顧客情報、機密情報、認証情報、金融情報は入力しないでください。公開前に事実、価格、権利、表現を確認してください。
    </div>
  `;

  copyButton.disabled = false;
  copyButton.textContent = "ブリーフをコピー";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderBrief();
});

copyButton.addEventListener("click", async () => {
  if (!latestBrief) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestBrief);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
