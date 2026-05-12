const form = document.querySelector("#idea-form");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copy-output");

let latestPlan = "";

const goalLabels = {
  awareness: "認知を広げる",
  trust: "信頼を増やす",
  visit: "来店・問い合わせを増やす",
  repeat: "リピートを増やす",
};

const toneLabels = {
  friendly: "親しみやすい",
  expert: "専門的",
  calm: "落ち着いた",
  energetic: "元気",
};

const angleBank = {
  awareness: [
    ["悩みの代弁", "相手が普段感じている小さな困りごとから入り、商品との接点を作る。", "気になる方は保存してください。"],
    ["使う場面", "商品を使う前後のシーンを描き、生活の中で想像しやすくする。", "使いたい場面をコメントしてください。"],
    ["裏側紹介", "作り手の工夫や準備の様子を見せ、認知と親近感を同時に作る。", "次回の投稿も見たい方はフォローしてください。"],
  ],
  trust: [
    ["選び方の基準", "失敗しない選び方を伝え、専門性を自然に見せる。", "迷っている方はこの投稿を保存してください。"],
    ["よくある質問", "購入前や申込前に不安になりやすい点へ先回りして答える。", "他に不安な点があればメモしてください。"],
    ["事例の分解", "具体的な利用シーンを分解し、納得感を高める。", "似た状況の方は一度相談してください。"],
  ],
  visit: [
    ["限定理由", "今行く理由、今問い合わせる理由を明確にする。", "空き状況を確認したい方は問い合わせてください。"],
    ["比較投稿", "他の選択肢との違いをわかりやすく整理する。", "自分に合うか迷う方は保存してください。"],
    ["初回の流れ", "来店や問い合わせのハードルを下げるため、最初の流れを見せる。", "初めての方も気軽にどうぞ。"],
  ],
  repeat: [
    ["次回提案", "一度使った人が次に何をすればよいかを伝える。", "次のタイミングを忘れないよう保存してください。"],
    ["活用のコツ", "購入後や利用後の満足度を上げる使い方を紹介する。", "試したら感想を教えてください。"],
    ["季節の変化", "季節、イベント、生活リズムに合わせた再利用理由を作る。", "今月の予定に入れておいてください。"],
  ],
};

const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeIdeas(offer, audience, goal, tone) {
  const angles = angleBank[goal];
  return weekdays.map((day, index) => {
    const [angle, body, cta] = angles[index % angles.length];
    return {
      day,
      title: `${offer}を${audience}に届ける「${angle}」投稿`,
      body: `${toneLabels[tone]}トーンで、${body}`,
      cta,
    };
  });
}

function renderPlan(offer, audience, goal, tone) {
  const safeOffer = offer || "商品・サービス";
  const safeAudience = audience || "届けたい相手";
  const ideas = makeIdeas(safeOffer, safeAudience, goal, tone);

  latestPlan = [
    "SNS投稿企画ジェネレーター",
    "",
    `商品・サービス: ${safeOffer}`,
    `届けたい相手: ${safeAudience}`,
    `投稿目的: ${goalLabels[goal]}`,
    `トーン: ${toneLabels[tone]}`,
    "",
    ...ideas.map((idea) => {
      return [
        `${idea.day}曜日: ${idea.title}`,
        `本文の方向性: ${idea.body}`,
        `CTA: ${idea.cta}`,
      ].join("\n");
    }),
    "",
    "注意: 顧客情報、機密情報、個人情報を入れない前提の簡易企画です。",
  ].join("\n\n");

  output.className = "idea-list";
  output.innerHTML = ideas
    .map((idea) => {
      return `
        <article class="idea-card">
          <header>
            <h3>${escapeHtml(idea.title)}</h3>
            <span>${idea.day}</span>
          </header>
          <p>${escapeHtml(idea.body)}</p>
          <small>CTA: ${escapeHtml(idea.cta)}</small>
        </article>
      `;
    })
    .join("");

  copyButton.disabled = false;
  copyButton.textContent = "投稿案をコピー";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const offer = document.querySelector("#offer").value.trim();
  const audience = document.querySelector("#audience").value.trim();
  const goal = document.querySelector("#goal").value;
  const tone = document.querySelector("input[name='tone']:checked").value;

  renderPlan(offer, audience, goal, tone);
});

copyButton.addEventListener("click", async () => {
  if (!latestPlan) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestPlan);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
