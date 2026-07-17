import { CARD_CATALOG } from './card-catalog.js';
import { COMMENTARY_METADATA, COMMENTARY_VERIFICATION_BY_SLUG, COMMENTARY_VERIFICATION_LEVELS } from './commentary.js';
import { OFFICIAL_CARDS, OFFICIAL_SOURCE_NOTE } from './official-cards.js';

const assetSrc = (path) => `${import.meta.env?.BASE_URL || '/jomo-karuta/'}${path}`;

export { COMMENTARY_VERIFICATION_LEVELS };

export const CARDS = OFFICIAL_CARDS.map((officialCard) => {
  const catalog = CARD_CATALOG[officialCard.slug] || {};
  const commentary = COMMENTARY_METADATA[officialCard.slug] || {
    commentaryStatus: '独自補足・個別出典確認前',
    commentarySources: [],
    commentaryPeople: [],
    commentarySummary: '',
    commentarySections: [],
  };

  return {
    ...officialCard,
    ...catalog,
    ...commentary,
    id: officialCard.kana,
    imageSrc: assetSrc(`assets/jomo-karuta/efuda/${officialCard.slug}.webp`),
    readingImageSrc: assetSrc(`assets/jomo-karuta/yomifuda/${officialCard.slug}.webp`),
    imageAlt: `上毛かるた「${officialCard.kana}」絵札`,
    readingImageAlt: `上毛かるた「${officialCard.kana}」読み札`,
    dataStatus: 'official',
    officialSource: OFFICIAL_SOURCE_NOTE,
    commentaryVerification: COMMENTARY_VERIFICATION_BY_SLUG[officialCard.slug] || 'unverified',
  };
});
