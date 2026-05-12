const form = document.querySelector("#reply-form");
const output = document.querySelector("#output");
const copyButton = document.querySelector("#copy-output");
let latestReply = "";

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

function buildReplies(service, inquiry, temperature, nextAction) {
  const opening = [
    "お問い合わせありがとうございます。",
    `${service}についてご連絡いただき、内容を確認しました。`,
    `${temperature}とのことなので、まずは必要な情報を整理してご案内します。`,
    "",
    `次の確認として、${nextAction}をご対応いただけると進めやすいです。`,
    "機密情報、個人情報、認証情報、金融情報は送らないでください。",
  ].join("\n");

  const questions = [
    "確認したいこと",
    `1. 今回の目的は「${inquiry}」で合っていますか。`,
    "2. 希望する時期や期限はありますか。",
    "3. 参考にしてよい公開情報はありますか。",
    "4. 対象外にしたい内容はありますか。",
  ].join("\n");

  const decline = [
    "ご連絡ありがとうございます。",
    "内容を確認しましたが、今回の範囲では対応できません。",
    "決済、認証、個人情報処理、専門判断、本番システム開発、成果保証を含む相談は対象外にしています。",
    "機密情報を含まない範囲で、LP構成、SNS投稿企画、問い合わせ返信テンプレートなどに絞れる場合は再度ご相談ください。",
  ].join("\n");

  return { opening, questions, decline };
}

function renderReplies() {
  const service = valueOf("#service", "サービス");
  const inquiry = valueOf("#inquiry", "問い合わせ内容");
  const temperature = valueOf("#temperature", "検討中");
  const nextAction = valueOf("#next-action", "次に必要な情報を送る");
  const replies = buildReplies(service, inquiry, temperature, nextAction);

  latestReply = [
    "問い合わせ返信テンプレート",
    "",
    `事業・サービス: ${service}`,
    `問い合わせ内容: ${inquiry}`,
    `相手の温度感: ${temperature}`,
    `次に案内したい行動: ${nextAction}`,
    "",
    "初回返信:",
    replies.opening,
    "",
    "確認事項:",
    replies.questions,
    "",
    "対象外の場合:",
    replies.decline,
    "",
    "注意: 本文を送る前に、事実、価格、納期、個人情報の有無を確認してください。",
  ].join("\n");

  output.className = "reply-output";
  output.innerHTML = `
    <article class="reply-card">
      <h3>初回返信</h3>
      <p>${escapeHtml(replies.opening)}</p>
    </article>
    <article class="reply-card">
      <h3>確認事項</h3>
      <p>${escapeHtml(replies.questions)}</p>
    </article>
    <article class="reply-card">
      <h3>対象外の場合</h3>
      <p>${escapeHtml(replies.decline)}</p>
    </article>
    <div class="warning-card">
      送信前に、事実、価格、納期、個人情報の有無を確認してください。
    </div>
  `;

  copyButton.disabled = false;
  copyButton.textContent = "返信案をコピー";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderReplies();
});

copyButton.addEventListener("click", async () => {
  if (!latestReply) {
    return;
  }

  try {
    await navigator.clipboard.writeText(latestReply);
    copyButton.textContent = "コピーしました";
  } catch {
    copyButton.textContent = "コピーできませんでした";
  }
});
