const form = document.querySelector("#audit-form");
const result = document.querySelector("#result");
const copyButton = document.querySelector("#copy-result");
let latestReport = "";

const painLabels = {
  time: "時間削減",
  quality: "品質安定",
  response: "返信速度",
  ideas: "企画強化",
};

const templates = {
  time: [
    ["定型作業の下書き化", "問い合わせ返信、議事録、見積もり説明など、毎回似ている文章をテンプレート化します。"],
    ["チェックリスト化", "作業手順を分解し、AIに確認役を持たせることで抜け漏れを減らします。"],
    ["入力フォーム整備", "依頼内容を先に揃えることで、確認往復を減らします。"],
  ],
  quality: [
    ["レビュー基準の固定", "良い成果物の条件をチェック項目にし、AIに一次レビューさせます。"],
    ["文面トーンの統一", "返信、投稿、提案文の言い回しをブランドに合わせて揃えます。"],
    ["事例集の再利用", "過去の良い対応を型にして、新しい案件でも使えるようにします。"],
  ],
  response: [
    ["一次返信テンプレート", "受信後すぐ返せる確認文、案内文、次アクションを用意します。"],
    ["FAQ整備", "よくある質問をまとめ、返信前の判断時間を短くします。"],
    ["優先度分類", "問い合わせを緊急度、売上影響、対応難易度で分けます。"],
  ],
  ideas: [
    ["投稿企画の量産", "顧客の悩み、季節、商品特徴から投稿テーマを作ります。"],
    ["提案切り口の生成", "同じ商品を別ターゲット向けに言い換え、提案の幅を広げます。"],
    ["改善案の棚卸し", "業務や販売導線を分解し、小さな改善候補を継続的に出します。"],
  ],
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function calculateScore(taskText, hours) {
  const taskCount = taskText
    .split(/[、,\n]/)
    .map((item) => item.trim())
    .filter(Boolean).length;

  const repetition = Math.min(95, 35 + taskCount * 9);
  const impact = Math.min(95, 30 + Number(hours) * 6);
  const ease = Math.max(35, 92 - Math.max(0, taskCount - 5) * 7);

  return {
    repetition,
    impact,
    ease,
  };
}

function renderRecommendations(pain, businessType, taskText, hours) {
  const safeBusinessType = escapeHtml(businessType || "現在の業務");
  const safeTaskText = escapeHtml(taskText || "未入力");
  const score = calculateScore(taskText, hours);
  const recommendations = templates[pain];

  latestReport = [
    "AI業務棚卸し診断",
    "",
    `業種・活動内容: ${businessType || "現在の業務"}`,
    `よく発生する作業: ${taskText || "未入力"}`,
    `優先テーマ: ${painLabels[pain]}`,
    `週あたりの作業時間: ${Number(hours)}時間`,
    "",
    `反復性スコア: ${score.repetition}`,
    `削減インパクト: ${score.impact}`,
    `導入しやすさ: ${score.ease}`,
    "",
    "改善候補:",
    ...recommendations.map(([title, body]) => `- ${title}: ${body}`),
    "",
    "注意: 機密情報、個人情報、契約情報、金融情報は入力しない前提の簡易診断です。",
  ].join("\n");

  const recommendationHtml = recommendations
    .map(([title, body]) => {
      return `
        <article class="recommendation">
          <h3>${title}</h3>
          <p>${body}</p>
        </article>
      `;
    })
    .join("");

  result.className = "";
  copyButton.disabled = false;
  copyButton.textContent = "結果をコピー";
  result.innerHTML = `
    <div class="score-row">
      <div class="score-card">
        <strong>${score.repetition}</strong>
        <span>反復性スコア</span>
      </div>
      <div class="score-card">
        <strong>${score.impact}</strong>
        <span>削減インパクト</span>
      </div>
      <div class="score-card">
        <strong>${score.ease}</strong>
        <span>導入しやすさ</span>
      </div>
    </div>

    <article class="recommendation">
      <h3>${safeBusinessType}で最初に見るべき領域</h3>
      <p>${safeTaskText} の中から、反復が多く、判断基準を言語化しやすい作業を1つだけ選んで試すのがよいです。</p>
    </article>

    <article class="recommendation">
      <h3>優先テーマ: ${painLabels[pain]}</h3>
      <p>週${Number(hours)}時間ほど発生しているなら、まずは30分以内で使えるテンプレートか入力フォームから始めると失敗しにくいです。</p>
    </article>

    ${recommendationHtml}

    <div class="warning">
      注意: このサンプルはローカルで動く簡易診断です。機密情報、個人情報、契約情報、金融情報は入力しない前提で設計しています。
    </div>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const businessType = document.querySelector("#business-type").value.trim();
  const taskText = document.querySelector("#tasks").value.trim();
  const pain = document.querySelector("input[name='pain']:checked").value;
  const hours = document.querySelector("#hours").value || "1";

  renderRecommendations(pain, businessType, taskText, hours);
});

copyButton.addEventListener("click", async () => {
  if (!latestReport) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestReport);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
