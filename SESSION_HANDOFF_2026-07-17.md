# 上毛かるたアプリ 引き継ぎメモ（2026-07-17）

## 最初に確認する場所

- リポジトリ: `/Users/onotomohiro/Projects/jomo-karuta`
- 公開用worktree: `/private/tmp/jomo-karuta-gh-pages`
- 公開URL: `https://manabinomorikyouikuken.github.io/jomo-karuta/`

## Gitの現在地

- `main`: `0ee2f15 fix: structure Kiryu commentary and refresh cache`
- `origin/main`: `0ee2f15`（mainと一致）
- `gh-pages`: `883c43f deploy: publish structured Kiryu commentary`
- 未コミット差分: `src/data/cards.js` の「ろ・老農 船津伝次平」のみ
- 未追跡の `docs/` は既存の別資料。今回も今後も、内容を確認せず `git add .` で巻き込まない。

## 今回、未コミットで実装済みの内容

「ろ・老農 船津伝次平」の解説を、短い旧解説から構造化解説へ更新した。

- 船津伝次平（1832～1898）の生涯と「明治三老農」
- 和算、農法改良、水利、植林
- 楫取素彦（かとり・もとひこ）の推薦
- 大久保利通との1877年の直接面会
- 渋沢栄一・新島襄との直接交流は、確認資料では未確認と明記
- 酒勾常明（さこう・つねあき）が船津を「師友」と呼んだこと
- 横井時敬との師弟関係
- ちょぼくれ節と『稲作小言』
- 人物リンク4件、参考資料6件
- 解説状態を `unverified` から `trusted` へ変更
- 確認日を `2026-07-17` と記録

人物名の表記は「酒匂」ではなく、資料上の正字である「酒勾常明」を使用する。

## 検証済み

- `git diff --check`: 問題なし
- `npm run build`: 成功
- `npm run verify:license`: 11項目すべて合格
- データ44枚、画像88枚、PWA、許諾情報、許諾期限に異常なし
- 解説状態の集計: `official: 20 / trusted: 7 / traditional: 10 / unverified: 7`

## まだ実行していないこと

- stage
- commit
- `origin/main` へのpush
- `gh-pages` への公開反映
- 公開URLでの表示確認

## 次回の安全な再開手順

1. `cd /Users/onotomohiro/Projects/jomo-karuta`
2. `git status --short --branch`
3. `git diff -- src/data/cards.js`
4. 「ろ」の文章とリンクを社長が最終確認
5. `npm run build`
6. `npm run verify:license`
7. 明示指示があれば `git add src/data/cards.js SESSION_HANDOFF_2026-07-17.md`
8. commit、push
9. 明示指示があれば `gh-pages` にビルド成果物を反映してpush
10. 公開URLで「ろ」の構造化表示、ふりがな、リンク、出典状態を確認

## 次の会話で伝える短い再開文

> `/Users/onotomohiro/Projects/jomo-karuta/SESSION_HANDOFF_2026-07-17.md` を読み、上毛かるたアプリの作業を再開してください。「ろ・船津伝次平」の更新はローカル実装・検証済みですが、未コミット・未公開です。`docs/` は絶対に巻き込まず、まず差分とGit状態を報告してください。
