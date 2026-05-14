const copyChecklistButton = document.querySelector("#copy-checklist");

const checklistText = [
  "販促ページを作る前のチェックリスト",
  "",
  "まず決めること",
  "- 誰に向けたページか",
  "- 相手は何に困っているか",
  "- 何を提供するのか",
  "- 他ではなく、なぜ自分に頼む理由があるか",
  "- 読み終わった後に何をしてほしいか",
  "",
  "あると強くなる材料",
  "- 料金の目安",
  "- 納品までの流れ",
  "- よくある不安や質問",
  "- 使ってよい写真やスクリーンショット",
  "- 公開してよい実績やサンプル",
  "",
  "後回しでよいこと",
  "- 完璧なデザイン",
  "- 細かいSEO対策",
  "- 有料広告",
  "- 複雑な予約や決済の仕組み",
  "- 全サービスを一度に説明すること",
].join("\n");

copyChecklistButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(checklistText);
    copyChecklistButton.textContent = "コピーしました";
  } catch {
    copyChecklistButton.textContent = "コピーできませんでした";
  }
});
