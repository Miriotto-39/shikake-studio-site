const quiz = document.querySelector("#start-quiz");
const output = document.querySelector("#quiz-output");
const copyButton = document.querySelector("#copy-quiz");
let latestMemo = "";

const recommendations = {
  lp: {
    title: "LP構成案",
    sample: "サービスLP構成メーカー",
    path: "samples/lp_structure_maker/index.html",
    reason: "誰に何を伝え、どこで申し込んでもらうかを整理する相談です。",
  },
  sns: {
    title: "SNS投稿企画",
    sample: "SNS投稿企画ジェネレーター",
    path: "samples/sns_idea_generator/index.html",
    reason: "投稿テーマ、本文の方向性、次の行動案内をまとめる相談です。",
  },
  reply: {
    title: "問い合わせ返信テンプレート",
    sample: "問い合わせ返信テンプレートメーカー",
    path: "samples/inquiry_reply_template/index.html",
    reason: "初回返信、追加確認、対象外の場合の文面を整える相談です。",
  },
  audit: {
    title: "業務・発信の棚卸し",
    sample: "AI業務棚卸し診断",
    path: "samples/ai_workflow_audit/index.html",
    reason: "AI化しやすい作業、優先順位、次の小さな実験を整理する相談です。",
  },
  offer: {
    title: "オファーブリーフ",
    sample: "オファーブリーフメーカー",
    path: "samples/offer_brief_maker/index.html",
    reason: "売り出し文、LP見出し、SNS投稿テーマの軸をそろえる相談です。",
  },
};

const materialLabels = {
  service: "サービスや商品の概要",
  target: "対象顧客のイメージ",
  problem: "顧客の悩み",
  action: "次に取ってほしい行動",
};

const channelLabels = {
  web: "Webページ",
  sns: "X、Instagram、ブログなど",
  message: "メール、DM、問い合わせ返信",
  internal: "自分用の整理メモ",
};

function selectedValue(name) {
  return new FormData(quiz).get(name);
}

function selectedMaterials() {
  return new FormData(quiz).getAll("materials");
}

function missingMaterials(values) {
  return Object.keys(materialLabels).filter((key) => !values.includes(key));
}

function renderResult(event) {
  event.preventDefault();

  const goal = selectedValue("goal");
  const channel = selectedValue("channel");
  const materials = selectedMaterials();
  const missing = missingMaterials(materials);
  const result = recommendations[goal];
  const materialText = materials.length
    ? materials.map((item) => materialLabels[item]).join("、")
    : "まだ整理中";
  const missingText = missing.length
    ? missing.map((item) => materialLabels[item]).join("、")
    : "大きな不足なし";

  latestMemo = [
    "相談前整理メモ",
    "",
    `近い相談: ${result.title}`,
    `使う場所: ${channelLabels[channel]}`,
    `今ある材料: ${materialText}`,
    `追加で整理するとよいもの: ${missingText}`,
    "",
    "フォームに書くとよいこと:",
    "1. 何を作りたいか",
    "2. 誰に見せたいか",
    "3. どこで使いたいか",
    "4. 次に取ってほしい行動",
    "",
    "注意: 機密情報、顧客情報、口座情報、パスワード、本人確認書類は送らない。",
  ].join("\n");

  output.className = "brief-output";
  output.innerHTML = `
    <article class="brief-card">
      <h3>${result.title}</h3>
      <p>${result.reason}</p>
    </article>
    <article class="brief-card">
      <h3>フォームに書くとよいこと</h3>
      <ul>
        <li>何を作りたいか</li>
        <li>誰に見せたいか</li>
        <li>どこで使いたいか</li>
        <li>次に取ってほしい行動</li>
      </ul>
    </article>
    <article class="brief-card">
      <h3>先に試せるサンプル</h3>
      <p><a href="${result.path}">${result.sample}</a></p>
    </article>
    <div class="warning-card">
      追加で整理するとよいもの: ${missingText}
    </div>
  `;

  copyButton.disabled = false;
  copyButton.textContent = "整理メモをコピー";
}

quiz.addEventListener("submit", renderResult);

copyButton.addEventListener("click", async () => {
  if (!latestMemo) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestMemo);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
