# 上毛かるたアプリ 引き継ぎメモ（2026-07-17）

## 最初に確認する場所

- リポジトリ: `/Users/onotomohiro/Projects/jomo-karuta`
- 公開用worktree: `/private/tmp/jomo-karuta-gh-pages`
- 公開URL: `https://manabinomorikyouikuken.github.io/jomo-karuta/`

## Gitと公開の現在地

- `main`: `0ed30a8 feat: strengthen commentary quality and reading flow`
- `origin/main`: `0ed30a8`（mainと一致）
- `gh-pages`: `60ad1ad deploy: publish commentary reading improvements`
- 公開版: 保守・表示改善まで反映済み。公開検証14項目すべて合格
- 未追跡の `docs/` は既存の別資料。内容を確認せず、`git add .` で巻き込まない。

## 2026-07-17までに完了した内容

- 44枚すべての独自解説を「要約＋見出し付き解説」に統一
- 要約72～123字、解説本文800～1,514字、見出し5～10項目に整理
- 解説状態を `official: 24 / trusted: 9 / traditional: 11 / unverified: 0` に更新
- 公式読み札、公式画像、許諾情報は変更していない
- `npm run verify:release`、公開URLとのJS/CSS一致、公式画像88枚のHTTP成功を確認
- `origin/main` と `gh-pages` へのpush、GitHub Pagesへの公開反映まで完了

## 追加で実装・公開済みの改善

- Gitメールをrepo-localで `manabinomorikyouikuken@users.noreply.github.com` に設定
- `npm run audit:commentary` を追加。44枚の要約・総文字数・見出し・各本文・出典・確認日・HTTPS URLを検査
- 公式読み札44枚のSHA-256を固定し、意図しない本文変更を監査で停止
- 解説画面を「要約＋冒頭3項目＋もっと詳しく読む」に変更
- 390×844pxで「と」の札を確認し、開閉、44pxの操作領域、横はみ出しなしを確認
- `src/data/official-cards.js`: 公式読み札
- `src/data/card-catalog.js`: アプリ独自の題材名・カテゴリ
- `src/data/commentary.js`: 独自解説・出典・確認状態
- `src/data/cards.js`: 上記3データの結合処理（2,679行から32行へ縮小）
- 旧 `sampleCommentary` を削除し、構造化解説を唯一の表示データにした

## 検証済み

- `git diff --check`: 問題なし
- `npm run audit:commentary`: 44枚すべてPASS、WARN 0
- 公式読み札ハッシュ: 分離前後で一致
- `npm run build`: 成功
- `npm run verify:license`: FAIL 0 / WARN 0 / PASS 11
- 公式画像88枚、PWA、許諾情報、許諾期限に異常なし
- 新しい外部スクリプト、フォーム、危険APIの追加なし

## 安全な再開手順

1. `cd /Users/onotomohiro/Projects/jomo-karuta`
2. `git status --short --branch`
3. `git diff --check`
4. `docs/` を対象外にし、変更ファイルを明示してステージする
5. `npm run audit:commentary`
6. `npm run build`
7. `npm run verify:license`
8. push・公開反映は人間の明示指示がある場合だけ実行する

## 次の会話で伝える短い再開文

> `/Users/onotomohiro/Projects/jomo-karuta/SESSION_HANDOFF_2026-07-17.md` を読み、上毛かるたアプリの作業を再開してください。解説監査、段階表示、データ分離、公開反映まで完了済みです。`docs/` は絶対に巻き込まず、まずGit状態と未コミット差分を報告してください。
