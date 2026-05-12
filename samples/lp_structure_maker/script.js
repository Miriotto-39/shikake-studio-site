const form = document.querySelector("#lp-form");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copy-output");
let latestOutline = "";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildOutline(serviceName, target, problem, value) {
  const safeService = serviceName || "サービス";
  const safeTarget = target || "対象顧客";
  const safeProblem = problem || "解決したい悩み";
  const safeValue = value || "提供価値";

  return [
    {
      title: `ファーストビュー: ${safeService}`,
      body: `${safeTarget}に向けて、「${safeProblem}」を解決し、「${safeValue}」を届けることを一文で伝える。`,
    },
    {
      title: "悩みの整理",
      body: `顧客が今感じている不安や手間を3つに分け、読み手が自分ごと化できるようにする。`,
    },
    {
      title: "解決策",
      body: `${safeService}がどのように悩みを軽くするかを、機能ではなく変化で説明する。`,
    },
    {
      title: "利用の流れ",
      body: `申し込み前後の流れを3ステップで見せ、初回行動の不安を減らす。`,
    },
    {
      title: "よくある質問",
      body: `価格、所要時間、準備物、向いていないケースを先回りして答える。`,
    },
  ];
}

function renderOutline(serviceName, target, problem, value) {
  const outline = buildOutline(serviceName, target, problem, value);
  const cta = `${target || "対象顧客"}が最初に迷わないよう、「まずは相談する」または「体験内容を見る」をCTAにする。`;

  latestOutline = [
    "サービスLP構成案",
    "",
    `サービス名: ${serviceName || "サービス"}`,
    `対象顧客: ${target || "対象顧客"}`,
    `顧客の悩み: ${problem || "解決したい悩み"}`,
    `提供価値: ${value || "提供価値"}`,
    "",
    ...outline.map((item, index) => `${index + 1}. ${item.title}\n${item.body}`),
    "",
    `CTA: ${cta}`,
    "",
    "注意: これは構成案です。本番公開前には事実確認、権利確認、価格や連絡先の承認が必要です。",
  ].join("\n\n");

  output.className = "lp-outline";
  output.innerHTML = `
    ${outline
      .map((item) => {
        return `
          <article class="section-card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </article>
        `;
      })
      .join("")}
    <div class="cta-card">
      CTA: ${escapeHtml(cta)}
    </div>
  `;

  copyButton.disabled = false;
  copyButton.textContent = "構成案をコピー";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const serviceName = document.querySelector("#service-name").value.trim();
  const target = document.querySelector("#target").value.trim();
  const problem = document.querySelector("#problem").value.trim();
  const value = document.querySelector("#value").value.trim();

  renderOutline(serviceName, target, problem, value);
});

copyButton.addEventListener("click", async () => {
  if (!latestOutline) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestOutline);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
