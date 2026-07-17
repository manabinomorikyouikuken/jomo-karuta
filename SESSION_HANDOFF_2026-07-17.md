# 上毛かるたアプリ 引き継ぎメモ（2026-07-17）

## 最初に確認する場所

- リポジトリ: `/Users/onotomohiro/Projects/jomo-karuta`
- 公開用worktree: `/private/tmp/jomo-karuta-gh-pages`
- 公開URL: `https://manabinomorikyouikuken.github.io/jomo-karuta/`

## Gitと公開の現在地

- 実装コミット: `0ed30a8 feat: strengthen commentary quality and reading flow`
- `main` / `origin/main`: 上記実装とこの引き継ぎ更新を含む。再開時は `git log -3 --oneline` で先端を確認する
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
- `npm run verify:release`: FAIL 0 / WARN 0 / PASS 14
- 公開HTMLのJS/CSSはローカルビルドと一致
- 公式画像88枚、PWA、許諾情報、許諾期限に異常なし
- 新しい外部スクリプト、フォーム、危険APIの追加なし

## Critic再検証の記録

### 現時点の評価

- 技術的には公開運用可能なv1
- 「完成版」と断言するより、学校・家庭での試用前の安定した初期公開版と位置づけるのが正確
- 技術的な公開品質: 8.5 / 10
- 解説の構造・出典管理: 7.5 / 10
- 子ども向けの実証: 5.5 / 10
- 保守性: 7.5 / 10
- 総合評価: 7.5 / 10

### 確認できていること

- 44枚、公式画像88枚、公式読み札ハッシュ、公開成果物、PWA、許諾情報は検査済み
- 解説44枚は要約72～123字、全体800～1,514字、見出し5～10項目、根拠資料2～9件の範囲内
- 解説状態は `official: 24 / trusted: 9 / traditional: 11 / unverified: 0`
- 公開版とローカルビルドは一致している

### 検証がまだ及んでいないこと

- 336個の解説項目と252件の資料登録について、項目単位の出典対応は未実装
- `sourceRefs` と `claimType` は未導入で、史実・伝承・推定の分類は札単位にとどまる
- 249種類の出典URLはHTTPS形式を確認しているが、全URLのHTTP到達確認はしていない
- 44枚すべての詳細表示、展開、戻る操作を自動ブラウザテストしていない
- クイズ、復習リスト、学習記録の一連操作を自動テストしていない
- スクリーンリーダー、キーボードのみ、200％拡大、色覚特性の正式確認は未実施
- 子ども・保護者・教員による実利用テストは未実施
- PWAは表示した資産からキャッシュするため、全44枚の完全オフライン利用は保証していない
- 学習記録はブラウザ内保存のため、端末変更・ブラウザデータ削除時には引き継がれない
- `src/data/commentary.js` は3,025行あり、独自解説は将来的に行別または札別分割の余地がある

### 次の改善優先順位

1. 子ども・保護者・教員3～5人による実利用確認
2. 解説項目への `sourceRefs` と `claimType` の追加
3. 主要操作の自動ブラウザテスト
4. 出典URLのリンク切れ検査
5. 許諾期限の90日・60日・30日・7日前通知
6. 必要に応じて `commentary.js` を行別または札別ファイルへ分割

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
