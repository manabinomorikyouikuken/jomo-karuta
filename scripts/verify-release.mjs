import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, COMMENTARY_VERIFICATION_LEVELS } from '../src/data/cards.js';
import { LICENSE } from '../src/data/license.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_URL = process.env.JOMO_KARUTA_PUBLIC_URL || 'https://manabinomorikyouikuken.github.io/jomo-karuta/';
const SKIP_PUBLIC = process.env.JOMO_KARUTA_SKIP_PUBLIC === '1' || process.argv.includes('--skip-public');
const DAY_MS = 24 * 60 * 60 * 1000;
const verificationKeys = new Set(Object.keys(COMMENTARY_VERIFICATION_LEVELS));
const slugs = CARDS.map((card) => card.slug);
const uniqueSlugs = [...new Set(slugs)];
const results = [];

const addResult = (status, label, detail) => results.push({ status, label, detail });
const pass = (label, detail) => addResult('PASS', label, detail);
const fail = (label, detail) => addResult('FAIL', label, detail);
const warn = (label, detail) => addResult('WARN', label, detail);

const readText = async (path) => (existsSync(path) ? readFile(path, 'utf8') : null);

const imagePath = (kind, slug) => resolve(ROOT, 'public', 'assets', 'jomo-karuta', kind, `${slug}.webp`);
const imageUrl = (baseUrl, kind, slug) => new URL(`assets/jomo-karuta/${kind}/${slug}.webp`, baseUrl).href;

function getTokyoToday() {
  const override = process.env.JOMO_KARUTA_TODAY;
  if (override) return override;

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseDateKey(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function extractAssetRefs(html) {
  return [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => ref.includes('/assets/'))
    .sort();
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal });
    const text = await response.text();
    return { response, text };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAssetStatus(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal });
    return { url, ok: response.ok, status: response.status };
  } catch (error) {
    return { url, ok: false, status: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchInBatches(items, batchSize, worker) {
  const results = [];
  for (let index = 0; index < items.length; index += batchSize) {
    results.push(...await Promise.all(items.slice(index, index + batchSize).map(worker)));
  }
  return results;
}

async function verifyLocalData() {
  if (CARDS.length === 44 && uniqueSlugs.length === 44) {
    pass('44枚のデータ数', '44件、slug重複なし');
  } else {
    fail('44枚のデータ数', `件数=${CARDS.length}, slug重複除外後=${uniqueSlugs.length}`);
  }

  const missingLocalImages = [];
  const emptyLocalImages = [];
  for (const kind of ['efuda', 'yomifuda']) {
    for (const slug of uniqueSlugs) {
      const path = imagePath(kind, slug);
      if (!existsSync(path)) {
        missingLocalImages.push(`${kind}/${slug}.webp`);
        continue;
      }
      const file = await stat(path);
      if (file.size === 0) emptyLocalImages.push(`${kind}/${slug}.webp`);
    }
  }
  if (missingLocalImages.length === 0 && emptyLocalImages.length === 0) {
    pass('絵札・読み札88枚の存在', '絵札44枚 + 読み札44枚、空ファイルなし');
    pass('ローカル画像404', '88枚すべてのWebPファイルが存在');
  } else {
    fail('絵札・読み札88枚の存在', `欠落=${missingLocalImages.join(', ') || 'なし'} / 空=${emptyLocalImages.join(', ') || 'なし'}`);
    fail('ローカル画像404', `欠落=${missingLocalImages.join(', ') || 'なし'} / 空=${emptyLocalImages.join(', ') || 'なし'}`);
  }

  const invalidCommentary = CARDS.filter((card) => !verificationKeys.has(card.commentaryVerification));
  const commentaryWithText = CARDS.filter((card) => card.sampleCommentary.trim().length > 0);
  const commentaryCounts = Object.fromEntries([...verificationKeys].map((key) => [key, 0]));
  for (const card of CARDS) commentaryCounts[card.commentaryVerification] += 1;
  if (invalidCommentary.length === 0 && commentaryWithText.length === 44) {
    pass('44枚の解説状態', `分類済み / ${JSON.stringify(commentaryCounts)}`);
  } else {
    fail('44枚の解説状態', `分類不正=${invalidCommentary.map((card) => card.slug).join(', ') || 'なし'} / 解説あり=${commentaryWithText.length}`);
  }

  const distIndexPath = resolve(ROOT, 'dist', 'index.html');
  const distIndex = await readText(distIndexPath);
  if (!distIndex) {
    fail('ビルド成果物', 'dist/index.html がありません。先に npm run build を実行してください。');
  } else {
    const refs = extractAssetRefs(distIndex);
    const missingDistAssets = refs.filter((ref) => !existsSync(resolve(ROOT, 'dist', ref.replace(/^\/jomo-karuta\//, ''))));
    if (missingDistAssets.length === 0) pass('ビルド成果物参照', `${refs.length}件のJS/CSS参照先が存在`);
    else fail('ビルド成果物参照', `欠落=${missingDistAssets.join(', ')}`);
  }
}

async function verifyPwa() {
  const manifestPath = resolve(ROOT, 'public', 'manifest.webmanifest');
  const serviceWorkerPath = resolve(ROOT, 'public', 'sw.js');
  const manifestText = await readText(manifestPath);
  const serviceWorkerText = await readText(serviceWorkerPath);

  let manifest = null;
  try {
    manifest = manifestText ? JSON.parse(manifestText) : null;
  } catch {
    manifest = null;
  }

  if (
    manifest?.name
    && manifest.start_url === '/jomo-karuta/'
    && manifest.scope === '/jomo-karuta/'
    && manifest.display === 'standalone'
  ) {
    pass('PWA manifest', 'name / start_url / scope / standalone を確認');
  } else {
    fail('PWA manifest', 'manifest.webmanifest の必須項目が不足または不正');
  }

  if (
    serviceWorkerText?.includes("addEventListener('install'")
    && serviceWorkerText.includes("addEventListener('fetch'")
    && serviceWorkerText.includes('caches.open')
  ) {
    pass('Service Worker', 'install / fetch / Cache Storage を確認');
  } else {
    fail('Service Worker', 'sw.js のキャッシュ処理が不足または未配置');
  }

  const distManifest = await readText(resolve(ROOT, 'dist', 'manifest.webmanifest'));
  const distServiceWorker = await readText(resolve(ROOT, 'dist', 'sw.js'));
  if (distManifest && distServiceWorker) {
    pass('PWAビルド成果物', 'dist/ にmanifestとService Workerが出力されています');
  } else {
    fail('PWAビルド成果物', 'dist/ にmanifestまたはService Workerがありません');
  }
}

function verifyLicense() {
  const dates = [...LICENSE.usagePeriod.matchAll(/(\d{4})年(\d+)月(\d+)日/g)]
    .map((match) => `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`);
  const expiryKey = dates.at(-1);
  const todayKey = getTokyoToday();
  const expiryMs = parseDateKey(expiryKey || '');
  const todayMs = parseDateKey(todayKey);

  if (LICENSE.permissionStatus === 'approved' && LICENSE.licenseNumber && LICENSE.usagePeriod) {
    pass('許諾情報', `${LICENSE.licenseNumber} / ${LICENSE.usagePeriod}`);
  } else {
    fail('許諾情報', '許諾状態・番号・利用期間のいずれかが未設定');
  }

  if (LICENSE.officialDataApplied && LICENSE.displayConditionsReviewed) {
    pass('許諾条件フラグ', '公式データ反映済み・表示条件確認済み');
  } else {
    fail('許諾条件フラグ', '公式データ反映または表示条件確認が未完了');
  }

  if (!Number.isNaN(expiryMs) && !Number.isNaN(todayMs)) {
    const daysRemaining = Math.floor((expiryMs - todayMs) / DAY_MS);
    if (todayMs >= expiryMs) {
      warn('許諾期限', `${expiryKey} を経過。公開継続の許諾判断が必要です。基準日=${todayKey}`);
    } else {
      pass('許諾期限', `期限=${expiryKey} / 残り${daysRemaining}日 / 基準日=${todayKey}`);
    }
  } else {
    fail('許諾期限', `利用期間から日付を読み取れません: ${LICENSE.usagePeriod}`);
  }
}

async function verifyPublicBuild() {
  if (SKIP_PUBLIC) return;

  const localIndex = await readText(resolve(ROOT, 'dist', 'index.html'));
  if (!localIndex) {
    fail('公開版との一致', '比較元の dist/index.html がありません');
    return;
  }

  let remote;
  try {
    remote = await fetchText(PUBLIC_URL);
  } catch (error) {
    fail('公開版との一致', `公開URLを取得できません: ${error.message}`);
    return;
  }
  if (!remote.response.ok) {
    fail('公開版との一致', `公開URL HTTP ${remote.response.status}`);
    return;
  }

  const localRefs = extractAssetRefs(localIndex);
  const remoteRefs = extractAssetRefs(remote.text);
  if (JSON.stringify(localRefs) === JSON.stringify(remoteRefs)) {
    pass('公開版との一致', '公開HTMLのJS/CSS参照がローカルビルドと一致');
  } else {
    fail('公開版との一致', `ローカル=${localRefs.join(', ')} / 公開=${remoteRefs.join(', ')}`);
  }

  const publicImageTargets = ['efuda', 'yomifuda'].flatMap((kind) => uniqueSlugs.map((slug) => ({ kind, slug })));
  const publicImageStatuses = await fetchInBatches(publicImageTargets, 8, ({ kind, slug }) => fetchAssetStatus(imageUrl(PUBLIC_URL, kind, slug)));
  const publicImageFailures = publicImageStatuses.filter((result) => !result.ok);
  if (publicImageFailures.length === 0) {
    pass('公開版の画像404', '絵札44枚 + 読み札44枚がHTTP成功');
  } else {
    fail('公開版の画像404', publicImageFailures.map((result) => `${result.status} ${result.url}`).join(' / '));
  }

  const remoteBundleRefs = remoteRefs.filter((ref) => ref.endsWith('.js'));
  const remoteBundles = await Promise.all(remoteBundleRefs.map(async (ref) => {
    const result = await fetchText(new URL(ref, PUBLIC_URL));
    return result.response.ok ? result.text : '';
  }));
  const requiredMarkers = ['公開中', '出典状態', '公式確認済み', '信頼資料で確認', '伝承・諸説あり', '未確認'];
  const missingMarkers = requiredMarkers.filter((marker) => !remoteBundles.some((bundle) => bundle.includes(marker)));
  if (missingMarkers.length === 0) pass('公開版の最新機能', '公開中表示・出典状態4分類を確認');
  else fail('公開版の最新機能', `公開JSに未反映=${missingMarkers.join(', ')}`);
}

await verifyLocalData();
await verifyPwa();
verifyLicense();
await verifyPublicBuild();

for (const result of results) {
  console.log(`[${result.status}] ${result.label}: ${result.detail}`);
}

const failures = results.filter((result) => result.status === 'FAIL').length;
const warnings = results.filter((result) => result.status === 'WARN').length;
console.log(`\n結果: FAIL=${failures} / WARN=${warnings} / PASS=${results.length - failures - warnings}`);
if (failures > 0) process.exitCode = 1;
else if (warnings > 0) process.exitCode = 2;
