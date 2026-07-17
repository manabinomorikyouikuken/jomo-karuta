import { createHash } from 'node:crypto';
import { CARDS, COMMENTARY_VERIFICATION_LEVELS } from '../src/data/cards.js';
import { OFFICIAL_CARDS } from '../src/data/official-cards.js';

const EXPECTED_CARD_COUNT = 44;
const EXPECTED_OFFICIAL_CARDS_HASH = 'f76b53889e87e44caadd3ee3e096e3966a0b783775968b7a039d89fc6ac9a2ae';
const LIMITS = {
  summary: { min: 70, max: 125 },
  total: { min: 750, max: 1550 },
  sections: { min: 5, max: 10 },
  sectionTitle: { min: 2, max: 30 },
  sectionBody: { min: 50, max: 240 },
  sources: { min: 2 },
};

const failures = [];
const warnings = [];
const lengthOf = (value = '') => Array.from(value.trim()).length;
const inRange = (value, range) => value >= range.min && value <= range.max;
const addFailure = (card, message) => failures.push(`${card.kana}（${card.slug}）: ${message}`);
const addWarning = (card, message) => warnings.push(`${card.kana}（${card.slug}）: ${message}`);

function isValidHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

if (CARDS.length !== EXPECTED_CARD_COUNT) {
  failures.push(`全体: 札数が${CARDS.length}枚です（期待値${EXPECTED_CARD_COUNT}枚）`);
}

const officialCardsHash = createHash('sha256').update(JSON.stringify(OFFICIAL_CARDS)).digest('hex');
if (officialCardsHash !== EXPECTED_OFFICIAL_CARDS_HASH) {
  failures.push('全体: 公式読み札データが基準値から変更されています。許諾資料との照合が必要です');
}

const slugs = new Set();
for (const card of CARDS) {
  if (slugs.has(card.slug)) addFailure(card, 'slugが重複しています');
  slugs.add(card.slug);

  const summaryLength = lengthOf(card.commentarySummary);
  const sectionCount = card.commentarySections.length;
  const totalLength = summaryLength + card.commentarySections.reduce(
    (total, section) => total + lengthOf(section.title) + lengthOf(section.body),
    0,
  );

  if (!inRange(summaryLength, LIMITS.summary)) {
    addFailure(card, `要約が${summaryLength}字です（${LIMITS.summary.min}～${LIMITS.summary.max}字）`);
  }
  if (!inRange(totalLength, LIMITS.total)) {
    addFailure(card, `解説全体が${totalLength}字です（${LIMITS.total.min}～${LIMITS.total.max}字）`);
  }
  if (!inRange(sectionCount, LIMITS.sections)) {
    addFailure(card, `見出しが${sectionCount}項目です（${LIMITS.sections.min}～${LIMITS.sections.max}項目）`);
  }

  const sectionTitles = new Set();
  card.commentarySections.forEach((section, index) => {
    const titleLength = lengthOf(section.title);
    const bodyLength = lengthOf(section.body);
    if (!inRange(titleLength, LIMITS.sectionTitle)) {
      addFailure(card, `見出し${index + 1}の題名が${titleLength}字です（${LIMITS.sectionTitle.min}～${LIMITS.sectionTitle.max}字）`);
    }
    if (!inRange(bodyLength, LIMITS.sectionBody)) {
      addFailure(card, `見出し${index + 1}の本文が${bodyLength}字です（${LIMITS.sectionBody.min}～${LIMITS.sectionBody.max}字）`);
    }
    if (sectionTitles.has(section.title)) addFailure(card, `見出し「${section.title}」が重複しています`);
    sectionTitles.add(section.title);
  });

  if (card.commentarySources.length < LIMITS.sources.min) {
    addFailure(card, `根拠資料が${card.commentarySources.length}件です（最低${LIMITS.sources.min}件）`);
  }
  const sourceUrls = new Set();
  card.commentarySources.forEach((source, index) => {
    if (!source.label?.trim()) addFailure(card, `根拠資料${index + 1}の表示名が空です`);
    if (!isValidHttpsUrl(source.url)) addFailure(card, `根拠資料${index + 1}のURLがHTTPS形式ではありません`);
    if (sourceUrls.has(source.url)) addFailure(card, `根拠資料URLが重複しています: ${source.url}`);
    sourceUrls.add(source.url);
  });

  card.commentaryPeople.forEach((person, index) => {
    if (!person.name?.trim() || !person.role?.trim()) addFailure(card, `関連人物${index + 1}の名前または説明が空です`);
    if (!isValidHttpsUrl(person.url)) addFailure(card, `関連人物${index + 1}のURLがHTTPS形式ではありません`);
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(card.commentaryVerifiedAt || '')) {
    addFailure(card, '最終確認日がYYYY-MM-DD形式ではありません');
  }
  if (!Object.hasOwn(COMMENTARY_VERIFICATION_LEVELS, card.commentaryVerification)) {
    addFailure(card, `解説状態「${card.commentaryVerification}」が未定義です`);
  }
  if (card.commentaryVerification === 'unverified') {
    addWarning(card, '解説状態が「未確認」です');
  }
}

const rows = CARDS.map((card) => ({
  summary: lengthOf(card.commentarySummary),
  total: lengthOf(card.commentarySummary) + card.commentarySections.reduce(
    (sum, section) => sum + lengthOf(section.title) + lengthOf(section.body),
    0,
  ),
  sections: card.commentarySections.length,
  sources: card.commentarySources.length,
}));
const range = (key) => `${Math.min(...rows.map((row) => row[key]))}～${Math.max(...rows.map((row) => row[key]))}`;

console.log(`解説監査: ${CARDS.length}枚`);
console.log(`公式読み札: ${officialCardsHash === EXPECTED_OFFICIAL_CARDS_HASH ? '基準値と一致' : '変更あり'}`);
console.log(`要約文字数: ${range('summary')}字`);
console.log(`解説全体: ${range('total')}字`);
console.log(`見出し数: ${range('sections')}項目`);
console.log(`根拠資料: ${range('sources')}件`);

for (const warning of warnings) console.log(`[WARN] ${warning}`);
for (const failure of failures) console.error(`[FAIL] ${failure}`);

if (failures.length > 0) {
  console.error(`\n結果: FAIL=${failures.length} / WARN=${warnings.length}`);
  process.exitCode = 1;
} else {
  console.log(`\n結果: PASS（WARN=${warnings.length}）`);
}
