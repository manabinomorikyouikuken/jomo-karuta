const OFFICIAL_SOURCE_NOTE = '群馬県公式HP掲載「（別紙）絵札・読み札」PDF';
const assetSrc = (path) => `${import.meta.env.BASE_URL}${path}`;

const OFFICIAL_CARDS = [
  { kana: 'あ', slug: 'a', verse: '浅間のいたずら 鬼の押出し', topic: '浅間山・鬼押出し', sampleCommentary: '吾妻郡嬬恋村にある溶岩台地「鬼押出し」。浅間山の噴火(1783年)でできた奇岩の景勝地。', category: 'shizen' },
  { kana: 'い', slug: 'i', verse: '伊香保温泉 日本の名湯', topic: '伊香保温泉', sampleCommentary: '渋川市の山あいにある古湯。石段街は365段あり、1年365日のにぎわいを願って整えられた。湯の花まんじゅうは温泉まんじゅうの始まりとして知られる。竹久夢二ゆかりの記念館や、明治期にハワイ王国公使ロバート・W・アルウィンの避暑用別邸が置かれたことも印象的。アルウィンは日本人のハワイ移民にも深く関わった人物で、伊香保が国際的な避暑地でもあったことを伝えている。', category: 'meisho' },
  { kana: 'う', slug: 'u', verse: '碓氷峠の 関所跡', topic: '碓氷峠', sampleCommentary: '安中市松井田町横川にある江戸時代の関所跡。中山道の難所として知られる。関所の近くにはJR信越本線の横川駅があり、駅前には峠の釜めしで有名な荻野屋の横川本店がある。', category: 'rekishi' },
  { kana: 'え', slug: 'e', verse: '縁起だるまの 少林山', topic: '少林山達磨寺', sampleCommentary: '高崎市鼻高町にある曹洞宗の寺院。少林山達磨寺は高崎だるま発祥の地として知られ、高崎市はだるまの全国一の生産地。眉に鶴、ひげに亀が描かれるのも特徴。年間消費量について都道府県別の公的な全国順位は確認できないため、「消費量1位」とは断定できない。', category: 'meisho' },
  { kana: 'お', slug: 'o', verse: '太田金山 子育呑龍', topic: '呑龍上人', sampleCommentary: '呑龍上人（1556-1623）は、太田の大光院を開いた浄土宗の僧。貧しさから苦しむ子どもを寺で養育したことから、「子育呑龍」と親しまれたところが印象的。', category: 'jinbutsu' },
  { kana: 'か', slug: 'ka', verse: '関東と信越 つなぐ高崎市', topic: '高崎市', sampleCommentary: '群馬県最大の都市。北陸・上越・長野新幹線の分岐点として交通の要衝。', category: 'meisho' },
  { kana: 'き', slug: 'ki', verse: '桐生は日本の 機どころ', topic: '桐生織物', sampleCommentary: '桐生市は絹織物の産地として江戸時代から栄えた。「西の西陣、東の桐生」と称される。', category: 'sangyo' },
  { kana: 'く', slug: 'ku', verse: '草津よいとこ 薬の温泉', topic: '草津温泉', sampleCommentary: '吾妻郡草津町。日本三名泉のひとつ。源頼朝が立ち寄ったという伝承があり、江戸時代には八代将軍徳川吉宗が草津の湯を江戸城へ取り寄せたとも伝わる。湯畑と強い酸性の湯が町のシンボル。', category: 'meisho' },
  { kana: 'け', slug: 'ke', verse: '県都前橋 生糸の市', topic: '前橋市', sampleCommentary: '群馬県の県庁所在地。明治期から生糸の集散地として栄えた。', category: 'meisho' },
  { kana: 'こ', slug: 'ko', verse: '心の燈台 内村鑑三', topic: '内村鑑三', sampleCommentary: '内村鑑三（1861-1930）は、高崎藩士の家に生まれたキリスト教思想家。教会組織に頼りきらず聖書を学ぶ「無教会主義」を唱えた。日本（Japan）とイエス（Jesus）という「二つのJ」に仕える考え方が印象的。', category: 'jinbutsu' },
  { kana: 'さ', slug: 'sa', verse: '三波石と共に 名高い冬桜', topic: '桜山公園', sampleCommentary: '藤岡市の桜山公園。秋から冬にかけて咲く冬桜と、庭石として名高い三波石が見どころ。', category: 'shizen' },
  { kana: 'し', slug: 'shi', verse: 'しのぶ毛の国 二子塚', topic: '二子塚', sampleCommentary: '古代の毛野国と群馬の歴史を思わせる札。「二子塚」は、前方後円墳の二つのふくらみを思わせる古墳名として理解するとわかりやすい。群馬県では昭和10年の全県調査で8,423基の古墳が確認され、全体では1万基以上が作られたと想定されている。', category: 'rekishi' },
  { kana: 'す', slug: 'su', verse: '裾野は長し 赤城山', topic: '赤城山', sampleCommentary: '群馬県中央部にそびえる標高1828mの成層火山。上毛三山のひとつ。', category: 'shizen' },
  { kana: 'せ', slug: 'se', verse: '仙境尾瀬沼 花の原', topic: '尾瀬', sampleCommentary: '群馬・福島・新潟・栃木にまたがる高層湿原。ミズバショウで知られる日本最大の山岳湿原。', category: 'shizen' },
  { kana: 'そ', slug: 'so', verse: 'そろいの仕度で 八木節音頭', topic: '八木節', sampleCommentary: '桐生市・足利市を中心に伝わる民謡。夏祭りには揃いの浴衣で踊られる群馬を代表する民俗芸能。', category: 'bunka' },
  { kana: 'た', slug: 'ta', verse: '滝は吹割 片品渓谷', topic: '吹割の滝', sampleCommentary: '沼田市の片品渓谷にある「東洋のナイアガラ」と呼ばれる瀑布。国の天然記念物。', category: 'shizen' },
  { kana: 'ち', slug: 'chi', verse: '力あわせる 百九十万', topic: '群馬県民', sampleCommentary: '群馬県民の団結を讃える札。人口表現は発行時期により改訂されてきた。', category: 'bunka' },
  { kana: 'つ', slug: 'tsu', verse: 'つる舞う形の 群馬県', topic: '群馬県の形', sampleCommentary: '古代の上野国は律令期に成立し、現在の群馬県の歴史的な骨格につながる。ただし、現在の県境と「鶴舞う形」という表現がその時代に成立したわけではない。元禄15年（1702）の上野国絵図には鶴の形の原形が見え、明治16年（1883）の『群馬県地誌略』には「其形宛モ舞鶴ノ如シ」と記された。上毛かるたの札によって、現在の表現が広く知られるようになった。', category: 'shizen' },
  { kana: 'て', slug: 'te', verse: '天下の義人 茂左衛門', topic: '茂左衛門', sampleCommentary: '茂左衛門（生没年不詳）は、沼田藩主の重い年貢や労役に苦しむ人々のため、幕府へ直訴したと伝えられる義民。事績を裏づける史料は限られるが、「天下の義人」として語り継がれたところが重要。', category: 'jinbutsu' },
  { kana: 'と', slug: 'to', verse: '利根は 坂東一の川', topic: '利根川', sampleCommentary: '関東平野を貫く大河。「坂東太郎」の異名を持つ群馬発祥の川。', category: 'shizen' },
  { kana: 'な', slug: 'na', verse: '中仙道しのぶ 安中杉並木', topic: '安中杉並木', sampleCommentary: '安中市の旧中山道沿いに残る杉並木。江戸時代の街道の面影をとどめる。', category: 'rekishi' },
  { kana: 'に', slug: 'ni', verse: '日本で最初の 富岡製糸', topic: '富岡製糸場', sampleCommentary: '明治5年(1872)創設の官営模範工場。2014年に世界文化遺産に登録。', category: 'rekishi' },
  { kana: 'ぬ', slug: 'nu', verse: '沼田城下の 塩原太助', topic: '塩原太助', sampleCommentary: '塩原太助（1743-1816）は、上野国出身で江戸に出た商人。薪炭問屋で働いたあと炭屋として成功し、公益のために私財を投じた。人情噺「塩原多助一代記」で知られる。', category: 'jinbutsu' },
  { kana: 'ね', slug: 'ne', verse: 'ねぎとこんにゃく 下仁田名産', topic: '下仁田町', sampleCommentary: '甘楽郡下仁田町は下仁田ねぎとこんにゃくの一大産地。', category: 'sangyo' },
  { kana: 'の', slug: 'no', verse: '登る榛名の キャンプ村', topic: '榛名山', sampleCommentary: '高崎市にある成層火山。榛名湖畔はキャンプや観光の名所。上毛三山のひとつ。', category: 'shizen' },
  { kana: 'は', slug: 'ha', verse: '花山公園 つつじの名所', topic: 'つつじが岡公園', sampleCommentary: '館林市のつつじが岡公園は樹齢800年を超えるつつじを誇る日本最大級のつつじの名所。', category: 'meisho' },
  { kana: 'ひ', slug: 'hi', verse: '白衣観音 慈悲の御手', topic: '白衣大観音', sampleCommentary: '高崎市の慈眼院にある高さ41.8mの白衣観音像。1936年建立。高崎のシンボル。', category: 'meisho' },
  { kana: 'ふ', slug: 'fu', verse: '分福茶釜の 茂林寺', topic: '茂林寺', sampleCommentary: '館林市にある曹洞宗の寺院。「分福茶釜」の昔話の舞台として知られる。', category: 'meisho' },
  { kana: 'へ', slug: 'he', verse: '平和の使徒 新島襄', topic: '新島襄', sampleCommentary: '新島襄（1843-1890）は、安中藩士の家に生まれた教育者。幕末に箱館から海を渡ってアメリカで学び、帰国後に同志社英学校を創立した。妻は会津出身の新島八重（旧姓・山本）で、八重の兄が山本覚馬。襄と八重は明治9年（1876年）に結婚した。', category: 'jinbutsu' },
  { kana: 'ほ', slug: 'ho', verse: '誇る文豪 田山花袋', topic: '田山花袋', sampleCommentary: '田山花袋（1871-1930）は、群馬県館林出身の小説家。代表作「蒲団」などで自然主義文学を広めた。小説だけでなく紀行文も多く、歩いて見た土地を文章にした。', category: 'jinbutsu' },
  { kana: 'ま', slug: 'ma', verse: '繭と生糸は 日本一', topic: '養蚕・生糸業', sampleCommentary: '群馬県は明治以来、養蚕・製糸業で日本一の生産量を誇った。富岡製糸場の世界遺産登録でも注目。', category: 'sangyo' },
  { kana: 'み', slug: 'mi', verse: '水上谷川 スキーと登山', topic: '谷川岳', sampleCommentary: 'みなかみ町の谷川岳（標高1977m）は岩壁登山とスキーで知られる山岳リゾート。', category: 'shizen' },
  { kana: 'む', slug: 'mu', verse: '昔を語る 多胡の古碑', topic: '多胡碑', sampleCommentary: '高崎市吉井町にある奈良時代の石碑。和銅4（711）年ごろに建てられ、多胡郡が置かれたことを記した建郡碑で、那須国造碑・多賀城碑とともに日本三古碑のひとつ。山上碑・金井沢碑と合わせて上野三碑とも呼ばれ、古代東国の文字文化を伝えている。', category: 'rekishi' },
  { kana: 'め', slug: 'me', verse: '銘仙織出す 伊勢崎市', topic: '伊勢崎銘仙', sampleCommentary: '伊勢崎市は大正・昭和初期に独自の絣技法「伊勢崎銘仙」で全国にその名を馳せた織物産地。', category: 'sangyo' },
  { kana: 'も', slug: 'mo', verse: '紅葉に映える 妙義山', topic: '妙義山', sampleCommentary: '富岡市・安中市にまたがる奇峰の山塊。上毛三山のひとつ。秋の紅葉が絶景。', category: 'shizen' },
  { kana: 'や', slug: 'ya', verse: '耶馬溪しのぐ 吾妻峡', topic: '吾妻峡', sampleCommentary: '吾妻郡東吾妻町にある渓谷。大正時代に「日本の三大渓谷美」のひとつと称された景勝地。', category: 'shizen' },
  { kana: 'ゆ', slug: 'yu', verse: 'ゆかりは古し 貫前神社', topic: '貫前神社', sampleCommentary: '富岡市にある延喜式内社。一之宮として崇敬を集める群馬県最古の神社のひとつ。', category: 'rekishi' },
  { kana: 'よ', slug: 'yo', verse: '世のちり洗う 四万温泉', topic: '四万温泉', sampleCommentary: '吾妻郡中之条町の秘湯。「四万の病を癒す」が地名の由来とされる歴史ある温泉地。絵札には湯あみをする女性の姿が描かれていて、小学生の時分には少し照れて取りに行くのをためらった子もいたかもしれない、記憶に残りやすい一枚。', category: 'meisho' },
  { kana: 'ら', slug: 'ra', verse: '雷と空風 義理人情', topic: '上州気質', sampleCommentary: '群馬を代表する気候・風土と県民気質を詠んだ札。雷と空っ風と義理人情が上州人の象徴。', category: 'bunka' },
  { kana: 'り', slug: 'ri', verse: '理想の電化に 電源群馬', topic: '電源開発', sampleCommentary: '群馬県は矢木沢ダムなど多くのダムと水力発電所を持ち、関東圏の電力を支えてきた。', category: 'sangyo' },
  { kana: 'る', slug: 'ru', verse: 'ループで名高い 清水トンネル', topic: '清水トンネル', sampleCommentary: '上越線の土合駅付近を貫くトンネル。三国山脈の難工事として知られ、ループ線で高低差を克服した。', category: 'rekishi' },
  { kana: 'れ', slug: 're', verse: '歴史に名高い 新田義貞', topic: '新田義貞', sampleCommentary: '新田義貞（1301-1338）は、上野国新田荘を本拠とした鎌倉末期・南北朝時代の武将。1333年に鎌倉を攻め、鎌倉幕府を滅ぼす大きな役割を果たした。稲村ヶ崎で太刀を海へ投じたという伝説が残る。', category: 'jinbutsu' },
  { kana: 'ろ', slug: 'ro', verse: '老農 船津伝次平', topic: '船津伝次平', sampleCommentary: '船津伝次平（1832-1898）は、現在の前橋市富士見町原之郷出身の農業指導者。明治三老農の一人とされ、駒場農学校で実習指導にもあたった。農業技術を七五調の「ちょぼくれ節」にして、農民にも覚えやすく伝えた。', category: 'jinbutsu' },
  { kana: 'わ', slug: 'wa', verse: '和算の大家 関孝和', topic: '関孝和', sampleCommentary: '関孝和（1640頃-1708）は、上野国ゆかりの江戸時代の和算家。関流和算の祖とされ、方程式や行列式など高度な計算を発展させた。筆と紙で複雑な数学に挑んだ。', category: 'jinbutsu' },
];

const DEFAULT_COMMENTARY_METADATA = {
  commentaryStatus: '独自補足・個別出典確認前',
  commentarySources: [],
};

const COMMENTARY_METADATA = {
  u: {
    commentaryStatus: '安中市・荻野屋公式資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '安中市公式「碓氷関所跡」',
        url: 'https://www.city.annaka.lg.jp/page/21633.html',
      },
      {
        label: '荻野屋公式「横川本店」',
        url: 'https://www.oginoya.co.jp/tenpo/shop-list/%E6%A8%AA%E5%B7%9D%E6%9C%AC%E5%BA%97/',
      },
    ],
  },
  e: {
    commentaryStatus: '高崎市公式資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '高崎市公式「高崎だるまについて」',
        url: 'https://www.city.takasaki.gunma.jp/site/sightseeing/3052.html',
      },
      {
        label: '高崎市公式「高崎のここがスゴイ！ランキング」',
        url: 'https://www.city.takasaki.gunma.jp/uploaded/attachment/12654.pdf',
      },
    ],
  },
  he: {
    commentaryStatus: '新島八重・同志社の公式資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '国立国会図書館「新島八重」',
        url: 'https://www.ndl.go.jp/portrait/datas/6038/index.html',
      },
      {
        label: '江戸東京博物館「八重の桜」',
        url: 'https://www.edo-tokyo-museum.or.jp/s-exhibition/yae/',
      },
    ],
  },
  tsu: {
    commentaryStatus: '群馬県・群馬大学の歴史資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '群馬県公式「古代の大国 上野国」',
        url: 'https://www.pref.gunma.jp/page/5153.html',
      },
      {
        label: '群馬大学「群馬県の形に関する明治期教科書」',
        url: 'https://www.media.gunma-u.ac.jp/announce/2018/clib/2019021500.html',
      },
      {
        label: '群馬県公式「江戸時代のぐんまのすがた」',
        url: 'https://www.pref.gunma.jp/uploaded/attachment/131342.pdf',
      },
    ],
  },
  i: {
    commentaryStatus: '公式観光資料で確認',
    commentaryVerifiedAt: '2026-07-13',
    commentarySources: [
      {
        label: '渋川市公式「ハワイ王国公使別邸」',
        url: 'https://www.city.shibukawa.lg.jp/kankou/000373/000377/p000266.html',
      },
      {
        label: '渋川市公式「湯の花まんじゅう」',
        url: 'https://www.city.shibukawa.lg.jp/kankou-site/kankou/000397/000398/p015103.html',
      },
    ],
  },
  ku: {
    commentaryStatus: '伝承を含む・追加確認対象',
  },
  shi: {
    commentaryStatus: '群馬県公式資料で確認',
    commentaryVerifiedAt: '2026-07-13',
    commentarySources: [
      {
        label: '群馬県公式「古墳時代の群馬」',
        url: 'https://www.pref.gunma.jp/page/5152.html',
      },
      {
        label: '群馬県公式「文化財保護審議会」資料',
        url: 'https://www.pref.gunma.jp/page/172984.html',
      },
    ],
  },
  mu: {
    commentaryStatus: '高崎市公式資料で確認',
    commentaryVerifiedAt: '2026-07-13',
    commentarySources: [
      {
        label: '高崎市公式「上野三碑：多胡碑」',
        url: 'https://www.city.takasaki.gunma.jp/site/cultural-assets/4463.html',
      },
      {
        label: '高崎市公式「多胡碑（観光情報）」',
        url: 'https://www.city.takasaki.gunma.jp/site/sightseeing/5006.html',
      },
    ],
  },
  yo: {
    commentaryStatus: '独自補足・絵札の描写に関する解釈',
  },
};

export const CARDS = OFFICIAL_CARDS.map((card) => ({
  ...card,
  ...DEFAULT_COMMENTARY_METADATA,
  ...(COMMENTARY_METADATA[card.slug] || {}),
  id: card.kana,
  desc: card.sampleCommentary,
  imageSrc: assetSrc(`assets/jomo-karuta/efuda/${card.slug}.webp`),
  readingImageSrc: assetSrc(`assets/jomo-karuta/yomifuda/${card.slug}.webp`),
  imageAlt: `上毛かるた「${card.kana}」絵札`,
  readingImageAlt: `上毛かるた「${card.kana}」読み札`,
  dataStatus: 'official',
  officialSource: OFFICIAL_SOURCE_NOTE,
}));
