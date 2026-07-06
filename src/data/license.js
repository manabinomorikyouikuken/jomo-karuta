export const LICENSE = {
  permissionStatus: 'approved',
  licenseNumber: '許諾第08-01010号',
  permissionDate: '2026年6月29日',
  usagePeriod: '2026年6月29日〜2027年3月31日',
  permittedMaterials: '全絵札・全読み札',
  copyrightLabel: '「上毛かるた」© 群馬県',
  officialAppNotice: '本アプリは群馬県の利用許諾を得て制作されたもので、群馬県の公式アプリではありません。',
  officialDataApplied: true,
  displayConditionsReviewed: true,
  publicReleaseAllowed: true,
  dataNotice: '群馬県公式HP掲載の絵札・読み札データを反映済みです。本アプリは群馬県の公式アプリではありません。',
};

export const getCreditLine = () =>
  `${LICENSE.copyrightLabel} ／ 利用許諾番号: ${LICENSE.licenseNumber}`;

export const releaseGates = [
  {
    id: 'permission',
    label: '群馬県から利用許諾通知を受け取った',
    done: LICENSE.permissionStatus === 'approved',
  },
  {
    id: 'license-number',
    label: '利用許諾番号を確定値に差し替えた',
    done: !LICENSE.licenseNumber.includes('○'),
  },
  {
    id: 'official-data',
    label: '全44枚の絵札・読み札を公式データに差し替えた',
    done: LICENSE.officialDataApplied,
  },
  {
    id: 'display-conditions',
    label: '絵札の全体表示、読み札の可読性、縦横比維持を確認した',
    done: LICENSE.displayConditionsReviewed,
  },
  {
    id: 'public-release',
    label: '公開・販売の明示承認を受けた',
    done: LICENSE.publicReleaseAllowed,
  },
];

export const licenseSummaryFields = [
  { label: '許諾番号', value: LICENSE.licenseNumber },
  { label: '許諾日', value: LICENSE.permissionDate },
  { label: '利用期間', value: LICENSE.usagePeriod },
  { label: '許諾範囲', value: LICENSE.permittedMaterials },
];
