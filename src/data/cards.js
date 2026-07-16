const OFFICIAL_SOURCE_NOTE = '群馬県公式HP掲載「（別紙）絵札・読み札」PDF';
const assetSrc = (path) => `${import.meta.env?.BASE_URL || '/jomo-karuta/'}${path}`;

export const COMMENTARY_VERIFICATION_LEVELS = {
  official: {
    label: '公式確認済み',
    description: '自治体・県・国などの公式資料で確認した内容です。',
    className: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  },
  trusted: {
    label: '信頼資料で確認',
    description: '国立機関・大学・専門機関・図書館などの資料で確認した内容です。',
    className: 'border-sky-300 bg-sky-50 text-sky-800',
  },
  traditional: {
    label: '伝承・諸説あり',
    description: '伝承・諸説または絵札の解釈を含みます。確定情報と分けて読んでください。',
    className: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  unverified: {
    label: '未確認',
    description: '個別の根拠資料をまだ確認していません。学習メモとして掲載しています。',
    className: 'border-stone-300 bg-stone-100 text-stone-700',
  },
};

const OFFICIAL_CARDS = [
  { kana: 'あ', slug: 'a', verse: '浅間のいたずら 鬼の押出し', topic: '浅間山・鬼押出し', sampleCommentary: '吾妻郡嬬恋村にある溶岩台地「鬼押出し」。浅間山は古く「あさま」と読まれていたが、語源は確定しておらず、朝熊・朝雲・煙に関わる語など諸説がある。約1万年前から活動を続け、1108年・1128年・1783年に大規模噴火が起きた。1783年の天明噴火では鬼押出し溶岩が流れ、近年も2004年・2008年・2009年・2015年・2019年に噴火が記録されている。', category: 'shizen' },
  { kana: 'い', slug: 'i', verse: '伊香保温泉 日本の名湯', topic: '伊香保温泉', sampleCommentary: '渋川市の山あいにある古湯。石段街は365段あり、1年365日のにぎわいを願って整えられた。湯の花まんじゅうは温泉まんじゅうの始まりとして知られる。竹久夢二ゆかりの記念館や、明治期にハワイ王国公使ロバート・W・アルウィンの避暑用別邸が置かれたことも印象的。アルウィンは日本人のハワイ移民にも深く関わった人物で、伊香保が国際的な避暑地でもあったことを伝えている。', category: 'meisho' },
  { kana: 'う', slug: 'u', verse: '碓氷峠の 関所跡', topic: '碓氷峠', sampleCommentary: '安中市松井田町横川にある江戸時代の関所跡。中山道の難所として知られる。関所の近くにはJR信越本線の横川駅があり、駅前には峠の釜めしで有名な荻野屋の横川本店がある。', category: 'rekishi' },
  { kana: 'え', slug: 'e', verse: '縁起だるまの 少林山', topic: '少林山達磨寺', sampleCommentary: '高崎市鼻高町にある曹洞宗の寺院。少林山達磨寺は高崎だるま発祥の地として知られ、高崎市はだるまの全国一の生産地。眉に鶴、ひげに亀が描かれるのも特徴。年間消費量について都道府県別の公的な全国順位は確認できないため、「消費量1位」とは断定できない。', category: 'meisho' },
  { kana: 'お', slug: 'o', verse: '太田金山 子育呑龍', topic: '呑龍上人', sampleCommentary: '呑龍上人（1556-1623）は、太田の大光院を開いた浄土宗の僧。貧しさから苦しむ子どもを寺で養育したことから、「子育呑龍」と親しまれたところが印象的。', category: 'jinbutsu' },
  { kana: 'か', slug: 'ka', verse: '関東と信越 つなぐ高崎市', topic: '高崎市', sampleCommentary: '群馬県最大の都市。1598年（慶長3年）、箕輪城主の井伊直政が和田の地に高崎城を築いたことが、現在の高崎の町の出発点となった。直政が「松ヶ崎」と名づけようとしたところ、龍広寺の住職・白庵が「成功高大」の意味から「高崎」を勧めたという由来が伝わる。北陸・上越・長野新幹線の分岐点としても交通の要衝である。', category: 'meisho' },
  { kana: 'き', slug: 'ki', verse: '桐生は日本の 機どころ', topic: '桐生織物', sampleCommentary: '「機どころ」の「機」は、布を織る道具の「はた」のこと。桐生市立図書館の地名変遷図では、「桐生村（きりふむら）」は久安年間（1145〜1151年、1150年ごろ）に位置づけられている。「きりふ」は現在の「きりゅう」につながる古い読み方だが、現代仮名遣いの「きりゅう」が初めて書かれた年は、同資料からは特定できない。桐生織物の歴史は約1300年前までさかのぼり、和銅7年（714年）には上野国から絹織物が朝廷へ納められた記録がある。桐生には養蚕の技術に加え、水路が多く、水車を糸づくりの動力に利用できる環境があった。江戸時代には京都・西陣から高機や縮緬の技術を取り入れ、絹市と職人の分業によって「西の西陣、東の桐生」と呼ばれる織物産地へ成長した。関ヶ原の戦いでは、徳川家康の求めに応じ、桐生領54か村から一日で旗絹2,410疋（ひき）を用意したという伝承がある。一般的な反物に換算すると4,820反、着物約4,820着分、長さにして約55〜60キロメートルに相当する。ただし、当時の旗絹の規格は一定とは限らないため、これはおおよその目安である。古代に京都で養蚕・機織りを広めたとされる秦氏（はたうじ）と桐生との直接的な関係は確認されていないが、秦氏に始まるとされる京都・西陣の織物技術が、江戸時代に桐生へ伝わったという間接的なつながりがある。桐生には、白瀧姫が里人に養蚕と機織りを伝えたという伝説も残る。現在もノコギリ屋根の織物工場や桐生織物記念館、織物業で栄えた桐生新町の町並みを見ることができる。', category: 'sangyo' },
  { kana: 'く', slug: 'ku', verse: '草津よいとこ 薬の温泉', topic: '草津温泉', sampleCommentary: '吾妻郡草津町。日本三名泉のひとつ。源頼朝が立ち寄ったという伝承があり、江戸時代には八代将軍徳川吉宗が草津の湯を江戸城へ取り寄せたとも伝わる。湯畑と強い酸性の湯が町のシンボル。定番のお土産には、二色あんまんじゅう（本家ちちや）、松むら饅頭（松むら饅頭本舗）、湯畑プリン（草津温泉プリン）、草津ラスク（グランデフューメ草津）、手作り草津温泉クッキー（湯の香本舗）、草津温泉たまごボーロ（草津たまごファーム）などがある。', category: 'meisho' },
  { kana: 'け', slug: 'ke', verse: '県都前橋 生糸の市', topic: '前橋市', sampleCommentary: '群馬県の県庁所在地。古くは「厩橋（うまやばし）」と呼ばれ、現在の利根川付近を流れていた車川に架かる「駅家（うまや）の橋」に由来すると伝えられる。17世紀半ば、前橋藩主の酒井忠清の時代に「前橋」へ改められた。明治期からは生糸の集散地として栄えた。', category: 'meisho' },
  { kana: 'こ', slug: 'ko', verse: '心の燈台 内村鑑三', topic: '内村鑑三', sampleCommentary: '内村鑑三（1861-1930）は、高崎藩士の家に生まれたキリスト教思想家。教会組織に頼りきらず聖書を学ぶ「無教会主義」を唱えた。日本（Japan）とイエス（Jesus）という「二つのJ」に仕える考え方が印象的。', category: 'jinbutsu' },
  { kana: 'さ', slug: 'sa', verse: '三波石と共に 名高い冬桜', topic: '桜山公園', sampleCommentary: '藤岡市の桜山公園。秋から冬にかけて咲く冬桜と、庭石として名高い三波石が見どころ。', category: 'shizen' },
  { kana: 'し', slug: 'shi', verse: 'しのぶ毛の国 二子塚', topic: '二子塚', sampleCommentary: '古代の毛野国と群馬の歴史を思わせる札。「二子塚」は、前方後円墳の二つのふくらみを思わせる古墳名として理解するとわかりやすい。群馬県では昭和10年の全県調査で8,423基の古墳が確認され、全体では1万基以上が作られたと想定されている。', category: 'rekishi' },
  { kana: 'す', slug: 'su', verse: '裾野は長し 赤城山', topic: '赤城山', sampleCommentary: '群馬県中央部にそびえる、黒檜山を最高峰とする標高1,828mの大型成層火山で、上毛三山のひとつ。名前の由来は一つに定まらず、赤城山の神と日光二荒山の神が戦って流した血で山が赤く染まったという「出血説」、紅葉の赤に由来する説、「閼伽（あか）」と水に関わる「ぎ」から高貴な水の湧く場所とする説などがある。地質学的には約7万〜5万年前に山頂カルデラができ、中央火口丘では約4万〜4.5万年前の鹿沼軽石噴火が知られる。気象庁は有史以降の活動として1251年（建長3年）の「噴火？」を挙げるが、対応する噴出物は発見されておらず、山火事の記録だとする見方もある。作品では、国定忠治を扱う小説『赤城山残照』、映画『名月赤城山』などで赤城山が重要な舞台として描かれる。アニメでは、前橋市が『ヤマノススメ サードシーズン』と連携して赤城山を紹介したほか、群馬県公式のアニメーションと実写を融合した『精霊が息づく、群馬。信仰の山・赤城編』も公開されている。赤城山に関連するキャラクターでは、赤城山南麓の国立赤城青少年交流の家のマスコット「ササビー」がいる。ムササビをモチーフに、赤城山の「赤」やレンゲツツジの色を取り入れたキャラクターである。', category: 'shizen' },
  { kana: 'せ', slug: 'se', verse: '仙境尾瀬沼 花の原', topic: '尾瀬', sampleCommentary: '群馬・福島・新潟・栃木にまたがる高層湿原。「仙境」は、仙人が住むような、俗世を離れた美しい場所という意味で、尾瀬沼と湿原の景観を表す詩的な表現。誰が最初に尾瀬を「仙境」と名付けたかは、公開資料では確認できない。平野長蔵が尾瀬を開き、武田久吉が植物学と紀行文で紹介し、大下藤次郎が絵で伝えた。', category: 'shizen' },
  { kana: 'そ', slug: 'so', verse: 'そろいの仕度で 八木節音頭', topic: '八木節', sampleCommentary: '桐生市・足利市を中心に伝わる民謡。夏祭りには揃いの浴衣で踊られる群馬を代表する民俗芸能。', category: 'bunka' },
  { kana: 'た', slug: 'ta', verse: '滝は吹割 片品渓谷', topic: '吹割の滝', sampleCommentary: '沼田市利根町を流れる片品川にある、高さ7メートル、幅30メートルの滝。高さだけを見ると意外に低いが、川床にできた大きな割れ目へ周囲から水が流れ込み、激しいしぶきが吹き上がる。その独特の姿から「東洋のナイアガラ」と呼ばれている。川床をつくる凝灰岩や花崗岩のうち、軟らかい部分が長い年月をかけて水に削られ、多数の割れ目が生まれた。巨大な岩が吹き割れたように見えることが「吹割の滝」という名前の由来である。周辺には、約850万年以上前の火砕流が固まってできた岩石も見られる。滝の近くにある浮島観音堂は、延暦14年（795年）に創設されたと伝わり、吹割渓谷周辺は約1200年前から信仰の場だった。「吹割の滝」という名称が文献に初めて現れる年は確認できないが、1936年12月16日には「吹割渓ならびに吹割瀑」として国の名勝・天然記念物に指定された。日本の滝百選にも選ばれている。滝つぼは竜宮へ通じているとも伝えられる。昔、村で祝い事があると、手紙を滝へ投げ入れて竜宮から膳や椀を借り、使い終わると返していた。ところが、ある年に一組を返し忘れ、それ以降は貸してもらえなくなったという伝説が残る。周辺には鱒飛の滝、般若岩、獅子岩、甌穴、浮島観音堂などがあり、片品川が長い時間をかけてつくった渓谷の景観を観察できる。水際は滑りやすいため、現地の白線やロープを越えずに見学したい。', category: 'shizen' },
  { kana: 'ち', slug: 'chi', verse: '力あわせる 百九十万', topic: '群馬県民', sampleCommentary: '群馬県民の団結を讃える札。人口表現は発行時期により改訂されてきた。', category: 'bunka' },
  { kana: 'つ', slug: 'tsu', verse: 'つる舞う形の 群馬県', topic: '群馬県の形', sampleCommentary: '古代の上野国は律令期に成立し、現在の群馬県の歴史的な骨格につながる。ただし、現在の県境と「鶴舞う形」という表現がその時代に成立したわけではない。元禄15年（1702）の上野国絵図には鶴の形の原形が見え、明治16年（1883）の『群馬県地誌略』には「其形宛モ舞鶴ノ如シ」と記された。上毛かるたの札によって、現在の表現が広く知られるようになった。', category: 'shizen' },
  { kana: 'て', slug: 'te', verse: '天下の義人 茂左衛門', topic: '茂左衛門', sampleCommentary: '茂左衛門（生没年不詳）は、沼田藩主の重い年貢や労役に苦しむ人々のため、幕府へ直訴したと伝えられる義民。事績を裏づける史料は限られるが、「天下の義人」として語り継がれたところが重要。', category: 'jinbutsu' },
  { kana: 'と', slug: 'to', verse: '利根は 坂東一の川', topic: '利根川', sampleCommentary: '関東平野を貫く大河。「坂東太郎」の異名を持つ群馬発祥の川。', category: 'shizen' },
  { kana: 'な', slug: 'na', verse: '中仙道しのぶ 安中杉並木', topic: '安中杉並木', sampleCommentary: '安中市の旧中山道沿いに残る杉並木。江戸時代の街道の面影をとどめる。', category: 'rekishi' },
  { kana: 'に', slug: 'ni', verse: '日本で最初の 富岡製糸', topic: '富岡製糸場', sampleCommentary: '明治5年（1872）に操業を始めた富岡製糸場は、明治政府が設立した官営模範工場。渋沢栄一は設置主任5人の一人として設立を進め、いとこで学問の師でもあった尾高惇忠は建設資材の調達に携わり、初代場長を務めた。もともと横浜で生糸を検査していたフランス人のポール・ブリュナは、渋沢栄一ら明治政府側に推薦され、富岡製糸場の指導者として雇われた。設計図を描いたのは、横須賀製鉄所で働いていたエドモン・オーギュスト・バスティアンである。', category: 'rekishi' },
  { kana: 'ぬ', slug: 'nu', verse: '沼田城下の 塩原太助', topic: '塩原太助', sampleCommentary: '塩原太助（1743-1816）は、現在のみなかみ町新巻に生まれ、江戸で炭商として成功した実在の商人。太助の時代に沼田藩を治めていたのは土岐家で、1742年に土岐頼稔が藩主となった。これより前の1681年には、沼田城主・真田伊賀守の重税に苦しむ農民のため、茂左衛門が幕府に直訴し、真田氏は改易された。太助と茂左衛門に直接のつながりは確認できないが、二人は利根沼田地域の歴史を伝える人物である。なお、実在の人物は「塩原太助」、三遊亭円朝の作品は「塩原多助一代記」と表記される。現在の子孫の状況は、公的資料では確認していない。', category: 'jinbutsu' },
  { kana: 'ね', slug: 'ne', verse: 'ねぎとこんにゃく 下仁田名産', topic: '下仁田町', sampleCommentary: '甘楽郡下仁田町は下仁田ねぎとこんにゃくの一大産地。', category: 'sangyo' },
  { kana: 'の', slug: 'no', verse: '登る榛名の キャンプ村', topic: '榛名山', sampleCommentary: '高崎市にある成層火山。榛名湖畔はキャンプや観光の名所。上毛三山のひとつ。漫画・アニメ「頭文字D」では「秋名山」のモデルとされる、作品の舞台の一つとしても知られている。', category: 'shizen' },
  { kana: 'は', slug: 'ha', verse: '花山公園 つつじの名所', topic: 'つつじが岡公園', sampleCommentary: '館林市のつつじが岡公園は樹齢800年を超えるつつじを誇る日本最大級のつつじの名所。', category: 'meisho' },
  { kana: 'ひ', slug: 'hi', verse: '白衣観音 慈悲の御手', topic: '白衣大観音', sampleCommentary: '観音山は、平安時代初期からこの地にある清水寺が千手観音をまつったことに由来するとされる。白衣大観音は、高崎の実業家・井上保三郎の発意で1936年に建立された。戦没者の慰霊、社会の平安、観光都市高崎の建設を願い、鉄道の車窓からも見える高崎のシンボルとして建てられた。戦時中には空襲の目標となり、取り壊されるという噂も広がったが、像が直接被害を受けたかは確認できない。胎内拝観料は大人・高校生以上300円、小人・中学生以下100円。映画『家族のレシピ』にも登場する。白衣大観音を主題にした有名な小説は、今回確認した資料では見つかっていない。', category: 'meisho' },
  { kana: 'ふ', slug: 'fu', verse: '分福茶釜の 茂林寺', topic: '茂林寺', sampleCommentary: '館林市にある曹洞宗の寺院。「分福茶釜」の昔話の舞台として知られる。', category: 'meisho' },
  { kana: 'へ', slug: 'he', verse: '平和の使徒 新島襄', topic: '新島襄', sampleCommentary: '新島襄（1843-1890）は、安中藩士の家に生まれた教育者。幕末に箱館から海を渡ってアメリカで学び、帰国後に同志社英学校を創立した。妻は会津出身の新島八重（旧姓・山本）で、八重の兄が山本覚馬。襄と八重は明治9年（1876年）に結婚した。', category: 'jinbutsu' },
  { kana: 'ほ', slug: 'ho', verse: '誇る文豪 田山花袋', topic: '田山花袋', sampleCommentary: '田山花袋（1871-1930）は、群馬県館林出身の小説家。代表作「蒲団」などで自然主義文学を広めた。小説だけでなく紀行文も多く、歩いて見た土地を文章にした。', category: 'jinbutsu' },
  { kana: 'ま', slug: 'ma', verse: '繭と生糸は 日本一', topic: '養蚕・生糸業', sampleCommentary: '群馬県は明治以来、養蚕・製糸業で日本一の生産量を誇った。富岡製糸場の世界遺産登録でも注目。', category: 'sangyo' },
  { kana: 'み', slug: 'mi', verse: '水上谷川 スキーと登山', topic: '谷川岳', sampleCommentary: 'みなかみ町の谷川岳（標高1977m）は岩壁登山とスキーで知られる山岳リゾート。', category: 'shizen' },
  { kana: 'む', slug: 'mu', verse: '昔を語る 多胡の古碑', topic: '多胡碑', sampleCommentary: '高崎市吉井町にある奈良時代の石碑。和銅4（711）年ごろに建てられ、多胡郡が置かれたことを記した建郡碑で、那須国造碑・多賀城碑とともに日本三古碑のひとつ。山上碑・金井沢碑と合わせて上野三碑とも呼ばれ、古代東国の文字文化を伝えている。', category: 'rekishi' },
  { kana: 'め', slug: 'me', verse: '銘仙織出す 伊勢崎市', topic: '伊勢崎銘仙', sampleCommentary: '伊勢崎市は大正・昭和初期に独自の絣技法「伊勢崎銘仙」で全国にその名を馳せた織物産地。', category: 'sangyo' },
  { kana: 'も', slug: 'mo', verse: '紅葉に映える 妙義山', topic: '妙義山', sampleCommentary: '富岡市・安中市にまたがる奇峰の山塊。上毛三山のひとつ。秋の紅葉が絶景。', category: 'shizen' },
  { kana: 'や', slug: 'ya', verse: '耶馬溪しのぐ 吾妻峡', topic: '吾妻峡', sampleCommentary: '吾妻郡東吾妻町にある渓谷。大正時代に「日本の三大渓谷美」のひとつと称された景勝地。', category: 'shizen' },
  { kana: 'ゆ', slug: 'yu', verse: 'ゆかりは古し 貫前神社', topic: '貫前神社', sampleCommentary: '貫前神社は、社伝によれば安閑天皇元年（531年）に現在地へ鎮座したとされる、約1500年の伝承を持つ古社。蓬ヶ丘（よもぎがおか）の北斜面にあり、参道をいったん上り、総門をくぐってから社殿へ下る珍しい「下り宮」として知られる。社殿が坂の下にある確定した理由は分かっていない。境内には、樹齢1000年との伝承がある県指定天然記念物のスダジイがある。また、俵藤太こと藤原秀郷が平将門討伐の戦勝祈願で植えた36本の杉の一本が「藤太杉」になったという伝承も残る。貫前神社そのものを主舞台にした有名な小説は確認できないが、藤原秀郷の伝説を描く古典『俵藤太物語』は、藤太杉の伝承につながる関連作品として読める。', category: 'rekishi' },
  { kana: 'よ', slug: 'yo', verse: '世のちり洗う 四万温泉', topic: '四万温泉', sampleCommentary: '吾妻郡中之条町の秘湯。「四万の病を癒す」が地名の由来とされる歴史ある温泉地。絵札には湯あみをする女性の姿が描かれていて、小学生の時分には少し照れて取りに行くのをためらった子もいたかもしれない、記憶に残りやすい一枚。', category: 'meisho' },
  { kana: 'ら', slug: 'ra', verse: '雷と空風 義理人情', topic: '上州気質', sampleCommentary: '群馬を代表する気候・風土と県民気質を詠んだ札。雷と空っ風と義理人情が上州人の象徴。', category: 'bunka' },
  { kana: 'り', slug: 'ri', verse: '理想の電化に 電源群馬', topic: '電源開発', sampleCommentary: '群馬県は矢木沢ダムなど多くのダムと水力発電所を持ち、関東圏の電力を支えてきた。', category: 'sangyo' },
  { kana: 'る', slug: 'ru', verse: 'ループで名高い 清水トンネル', topic: '清水トンネル', sampleCommentary: '上越線の土合駅付近を貫くトンネル。三国山脈の難工事として知られ、ループ線で高低差を克服した。', category: 'rekishi' },
  { kana: 'れ', slug: 're', verse: '歴史に名高い 新田義貞', topic: '新田義貞', sampleCommentary: '新田義貞（1301-1338）は、上野国新田荘を本拠とした鎌倉末期・南北朝時代の武将。1333年に鎌倉を攻め、鎌倉幕府を滅ぼす大きな役割を果たした。稲村ヶ崎で太刀を海へ投じたという伝説が残る。', category: 'jinbutsu' },
  { kana: 'ろ', slug: 'ro', verse: '老農 船津伝次平', topic: '船津伝次平', sampleCommentary: '船津伝次平（1832-1898）は、現在の前橋市富士見町原之郷出身の農業指導者。明治三老農の一人とされ、駒場農学校で実習指導にもあたった。農業技術を七五調の「ちょぼくれ節」にして、農民にも覚えやすく伝えた。', category: 'jinbutsu' },
  { kana: 'わ', slug: 'wa', verse: '和算の大家 関孝和', topic: '関孝和', sampleCommentary: '関孝和（生年不詳-1708年）は、江戸時代の日本の数学者である和算家。中国の数学をもとに日本で発展した「和算」を研究し、方程式や行列式、円周率の計算などで大きな成果を上げ、関流和算の祖とされる。同時代の渋川春海（1639-1715年）は、囲碁の家元・安井家に生まれ、水戸光圀らの知遇を得ながら、日本独自の暦「貞享暦」を作った。二人は授時暦を研究したが、個人的な交流を裏付ける確かな史料は確認されていない。関孝和が西洋に先駆けて微分積分を発見したと単純にいうことはできないが、和算独自の方法で高度な数学を発展させた人物である。関連作品として、冲方丁の歴史小説『天地明察』がある。', category: 'jinbutsu' },
];

// Every card is assigned explicitly so a new commentary cannot silently look verified.
const COMMENTARY_VERIFICATION_BY_SLUG = {
  a: 'traditional',
  i: 'official',
  u: 'official',
  e: 'official',
  o: 'unverified',
  ka: 'traditional',
  ki: 'traditional',
  ku: 'traditional',
  ke: 'official',
  ko: 'unverified',
  sa: 'unverified',
  shi: 'official',
  su: 'official',
  se: 'official',
  so: 'unverified',
  ta: 'traditional',
  chi: 'unverified',
  tsu: 'official',
  te: 'traditional',
  to: 'unverified',
  na: 'official',
  ni: 'official',
  nu: 'official',
  ne: 'unverified',
  no: 'official',
  ha: 'traditional',
  hi: 'trusted',
  fu: 'unverified',
  he: 'trusted',
  ho: 'unverified',
  ma: 'unverified',
  mi: 'official',
  mu: 'official',
  me: 'unverified',
  mo: 'unverified',
  ya: 'unverified',
  yu: 'traditional',
  yo: 'traditional',
  ra: 'unverified',
  ri: 'unverified',
  ru: 'unverified',
  re: 'unverified',
  ro: 'unverified',
  wa: 'trusted',
};

const DEFAULT_COMMENTARY_METADATA = {
  commentaryStatus: '独自補足・個別出典確認前',
  commentarySources: [],
  commentaryPeople: [],
  commentarySummary: '',
  commentarySections: [],
};

const COMMENTARY_METADATA = {
  ki: {
    commentaryStatus: '桐生市・京都市・山梨県の資料で確認（地名語源・旗絹・白瀧姫は伝承や推定を含む）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySources: [
      {
        label: '桐生市立図書館「桐生市地名考」',
        url: 'https://www.city.kiryu.lg.jp/_res/projects/default_project/_page_/001/001/127/timeikou.pdf',
      },
      {
        label: '桐生市「桐生織物の歴史」',
        url: 'https://www.city.kiryu.lg.jp/sangyou/1012348/1012405/1012412/index.html',
      },
      {
        label: '桐生市「歴史的風致維持向上計画」',
        url: 'https://www.city.kiryu.lg.jp/_res/projects/default_project/_page_/001/012/273/2025keikaku.pdf',
      },
      {
        label: '京都市「国指定伝統的工芸品（染織）」',
        url: 'https://www.city.kyoto.lg.jp/sankan/page/0000041367.html',
      },
      {
        label: '山梨県「甲斐絹用語辞典」',
        url: 'https://www.pref.yamanashi.jp/kaiki/kaiki_museum/kaiki-museum/kaiki-yougo.htm',
      },
      {
        label: '桐生織物記念館',
        url: 'https://kiryuorimonokinenkan.com/',
      },
    ],
  },
  a: {
    commentaryStatus: '気象庁・国土交通省資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '気象庁「浅間山」',
        url: 'https://www.data.jma.go.jp/vois/data/tokyo/306_Asamayama/306_index.html',
      },
      {
        label: '気象庁「浅間山 有史以降の火山活動」',
        url: 'https://www.data.jma.go.jp/vois/data/tokyo/306_Asamayama/306_history.html',
      },
      {
        label: '国土交通省「ふじあざみ」',
        url: 'https://www.cbr.mlit.go.jp/fujisabo/oshirase/fujiazami/fujiazami_36/fujiazami_03.html',
      },
    ],
  },
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
  ta: {
    commentaryStatus: '沼田市・文化庁資料で確認（浮島観音堂の創設年と竜宮の話は伝承を含む）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySummary: '高さ7メートル、幅30メートル。高さよりも、川床の割れ目へ周囲から水が流れ込む独特の姿が見どころの滝である。',
    commentarySections: [
      {
        title: 'どんな滝？',
        body: '沼田市利根町を流れる片品川にある。川床にできた大きな割れ目へ周囲から水が流れ込み、激しいしぶきが吹き上がる姿から「東洋のナイアガラ」と呼ばれている。',
      },
      {
        title: 'なぜ「吹割」？',
        body: '川床をつくる凝灰岩や花崗岩の軟らかい部分が、長い年月をかけて水に削られた。多数の割れ目が、巨大な岩が吹き割れたように見えることが名前の由来である。周辺には、約850万年以上前の火砕流が固まってできた岩石も見られる。',
      },
      {
        title: '歴史',
        body: '滝の近くの浮島観音堂は、延暦14年（795年）に創設されたと伝わる。この伝承から、周辺は約1200年前には信仰の場になっていたと考えられる。「吹割の滝」という名称の文献上の初出年は確認できないが、1936年12月16日に「吹割渓ならびに吹割瀑」として国の名勝・天然記念物に指定された。日本の滝百選にも選ばれている。',
      },
      {
        title: '竜宮伝説',
        body: '滝つぼは竜宮へ通じていると伝えられる。昔、村で祝い事があると、手紙を滝へ投げ入れて竜宮から膳や椀を借りていた。ある年に一組を返し忘れ、それ以降は貸してもらえなくなったという。',
      },
      {
        title: '見学ポイント',
        body: '周辺には鱒飛の滝、般若岩、獅子岩、甌穴、浮島観音堂などがある。水際は滑りやすいため、現地の白線やロープを越えず、案内に従って見学する。',
      },
    ],
    commentarySources: [
      {
        label: '沼田市「吹割の滝の紹介」',
        url: 'https://www.city.numata.gunma.jp/kanko/fukiware/1003062.html',
      },
      {
        label: '文化庁「吹割渓ならびに吹割瀑」',
        url: 'https://online.bunka.go.jp/heritages/detail/209760',
      },
      {
        label: '沼田市観光協会「吹割の滝」',
        url: 'https://www.numata-kankou.jp/fukiwarenotaki/',
      },
      {
        label: '沼田市「広報ぬまた 平成19年1月号」',
        url: 'https://www.city.numata.gunma.jp/_res/projects/default_project/_page_/001/006/628/1901.pdf',
      },
    ],
  },
  na: {
    commentaryStatus: '安中市・文化庁・国立国会図書館資料で確認（植樹時期には諸説あり）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySummary: '安中市原市の旧中山道沿いに残る杉並木。天保15年（1844年）には732本あったが、現在、国指定天然記念物として残る杉は13本である。',
    commentarySections: [
      {
        title: 'いつ植えられた？',
        body: '植樹時期には、1604年、1615年、第6代安中藩主・板倉重形が藩主だった1681～1686年という三つの説がある。伐採木の年輪がそろっていないため、枯れた木を地元の人々が何度も植え継いだと考えられている。',
      },
      {
        title: 'なぜ街道に杉を植えた？',
        body: '江戸時代の街道では、旅人を風や日差しから守るために並木が植えられた。神社や寺の参道ではなく、主要街道の両側に杉が並ぶ例は珍しい。安中市内には板鼻宿・安中宿・松井田宿・坂本宿があり、この道を大名から庶民まで多くの人が通った。',
      },
      {
        title: '732本から13本へ',
        body: '杉は1844年に732本、1932年には321本が残っていた。1933年に国の天然記念物となったが、交通量の増加や枯死などで減少し、1968年には安中側の指定が解除された。現在残る13本は、江戸時代の街道風景を伝える貴重な存在である。',
      },
      {
        title: '「中仙道」と「中山道」',
        body: '札には「中仙道」と書かれているが、現在の正式表記は「中山道」。江戸時代には両方の表記が使われ、幕府が1716年に「中山道」へ統一した。「中仙道」は誤字ではなく、かつて実際に使われていた歴史的な表記である。',
      },
      {
        title: '現代へ続く「安政遠足」',
        body: '安中市では毎年、思い思いの仮装で旧中山道を走る「安政遠足（あんせいとおあし）侍マラソン」が開かれる。始まりは安政2年（1855年）。安中藩主・板倉勝明が藩士の心身を鍛えるため、安中城から碓氷峠の熊野権現まで約7里を走らせ、着順を記録したことに由来し、「日本最古のマラソン」とも呼ばれる。現在は侍やアニメの登場人物などに仮装したランナーが、杉並木、茶屋本陣、碓氷関所跡、坂本宿などを通って碓氷峠を目指す。速さだけでなく仮装も見どころで、「仮装アイデア賞」も設けられている。',
      },
    ],
    commentarySources: [
      {
        label: '安中市「安中原市のスギ並木」',
        url: 'https://www.city.annaka.lg.jp/page/21674.html',
      },
      {
        label: '安中市「市内文化財の詳細」',
        url: 'https://www.city.annaka.lg.jp/page/2134.html',
      },
      {
        label: '文化遺産オンライン「安中原市のスギ並木」',
        url: 'https://bunka.nii.ac.jp/heritages/detail/162291',
      },
      {
        label: '国立国会図書館「中仙道が中山道に変わった経緯」',
        url: 'https://crd.ndl.go.jp/reference/entry/index.php?id=1000104874&page=ref_view',
      },
      {
        label: '安政遠足侍マラソン公式「大会の特徴」',
        url: 'https://ansei-toashi.jp/feature/',
      },
      {
        label: '安中市「観光行事」',
        url: 'https://www.city.annaka.lg.jp/page/2058.html',
      },
    ],
  },
  ha: {
    commentaryStatus: '館林市公式資料で確認（勾当内侍遺愛のつつじは伝承を含む）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySummary: '館林市のつつじが岡公園には、約1万株のツツジが植えられている。東側の約1.7ヘクタールの丘は、地元で昔から「花山」と呼ばれ、1934年に「躑躅ヶ岡」の名で国の名勝に指定された。',
    commentarySections: [
      {
        title: 'なぜ「花山」？',
        body: '古くからヤマツツジが群生し、城沼へ突き出した地形は「つつじが崎」と呼ばれていた。春になると丘全体が赤や桃色の花で覆われ、山が燃えるように見えることから、地元の人々に「花山」と親しまれてきた。札の「花山公園」は、現在のつつじが岡公園を指している。',
      },
      {
        title: 'いつから名所になった？',
        body: '寛永4年（1627年）、館林城主・松平忠次が、現在の太田市尾島町から数百株を移植したとされる。1661～1672年には、後に5代将軍となる館林城主・徳川綱吉も、日光から数十株を移した。城主が交代するときには、役人がツツジを一本ずつ数え、目録を付けて次の城主へ引き継いだ記録も残る。',
      },
      {
        title: '樹齢800年のツツジ',
        body: '園内には、推定樹齢800年の「勾当内侍遺愛（こうとうのないし・いあい）のつつじ」がある。新田義貞が妻の勾当内侍のために植えたという伝承を持つ古木である。歴史上の事実として確定しているわけではないが、ツツジが長く大切に守られてきたことを伝える物語になっている。',
      },
      {
        title: '将軍から宇宙飛行士へ',
        body: '平成6年（1994年）、館林市出身の宇宙飛行士・向井千秋が、園内で採取したツツジの種をスペースシャトル「コロンビア」へ持って行った。その種から育った「宇宙つつじ」が、現在も園内で花を咲かせている。館林のツツジは、館林城主から現代の宇宙飛行士へ受け継がれたことになる。',
      },
      {
        title: '見学ポイント',
        body: '見頃は例年4月中旬から5月上旬。普通のツツジは上から眺めることが多いが、花山には見上げるほど大きな古木があり、ツツジのトンネルを歩ける。開花期には「つつじまつり」が開催される。城沼では夏にハスの花も楽しめる。',
      },
    ],
    commentarySources: [
      {
        label: '館林市「つつじが岡公園 公園案内」',
        url: 'https://www.city.tatebayashi.gunma.jp/tsutsuji/010/010/20201110184919.html',
      },
      {
        label: '館林市「つつじが岡公園の歴史」',
        url: 'https://www.city.tatebayashi.gunma.jp/tsutsuji/020/030/20201111150126.html',
      },
      {
        label: '館林市「名勝 躑躅ヶ岡と見どころ」',
        url: 'https://www.city.tatebayashi.gunma.jp/tsutsuji/020/010/20201111151502.html',
      },
      {
        label: '館林市「指定文化財一覧」',
        url: 'https://www.city.tatebayashi.gunma.jp/s091/kanko/040/050/030/20200104025000.html',
      },
    ],
  },
  mi: {
    commentaryStatus: '群馬県・観光庁・みなかみ町・日本大学資料で確認（耳の語源は有力説）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySummary: '谷川岳は群馬県と新潟県の境にある標高1,977メートルの山。2,000メートルに届かない山だが、急峻な岩壁、多量の雪、変わりやすい天候を併せ持つ。日本百名山の一つで、登山、岩登り、スキーの名所として知られる。',
    commentarySections: [
      {
        title: '二つの「耳」を持つ山',
        body: '山頂は、手前の「トマの耳」1,963メートルと、奥の「オキの耳」1,977メートルからなる双耳峰（そうじほう）である。「トマ」は利根地方で手前の入口を表す「とま口」、「オキ」は離れた奥側を表す言葉に由来するといわれる。麓から二峰が猫の耳のように見えるため、古くから「耳二つ」と呼ばれた。語源を示す古い命名記録は確認できないため、有力な説として紹介する。谷川連峰は約440万年前から隆起し、水や雪などの浸食を受けて、現在の険しい地形がつくられた。',
      },
      {
        title: 'なぜ有名な登山の山になった？',
        body: '近代登山史では、1920年7月2日、藤島敏男と森喬が地元案内人とともに谷川岳を縦走した記録が残る。1931年に上越線が開通すると、東京方面から訪れやすくなり、登山者が増えた。1960年にはロープウェイが開業し、天神平から山頂を目指す道も広く知られるようになった。',
      },
      {
        title: '一ノ倉沢と登山の危険',
        body: '一ノ倉沢は、剱岳、穂高岳の岩場と並ぶ「日本三大岩場」の一つとされる。一方、急な岩壁と天候の変化により遭難事故も相次ぎ、1966年までに455人が亡くなった。群馬県は1967年に谷川岳遭難防止条例を施行し、登山指導センターを設置した。一般登山道と専門的な岩登りの危険地区は、明確に分けて理解する必要がある。',
      },
      {
        title: 'なぜスキーにも向いている？',
        body: '谷川岳は日本海側と太平洋側の境に位置し、冬の北西季節風が大量の雪を降らせる。天神平周辺は雪を生かしたスキーの名所となった。札の「スキーと登山」は、同じ雪と険しい地形が、冬はスキー、雪のない時期は登山の舞台になることを表している。',
      },
      {
        title: '札の「水上」はどこ？',
        body: '札の「水上」は、かつての水上町を指す。2005年に水上町、月夜野町、新治村が合併し、現在の「みなかみ町」になった。漢字の「水上」は旧町名として、温泉や駅などに今も残っている。',
      },
      {
        title: '見学ポイント',
        body: 'ロープウェイとリフトを利用すると、標高約1,500メートルまで上がり、谷川連峰や高山植物を観察できる。一ノ倉沢出合までの散策と山頂登山、岩壁登攀は難易度が大きく異なる。登山では最新の天候と登山道情報を確認し、経験に合ったコースを選ぶ必要がある。',
      },
    ],
    commentarySources: [
      {
        label: '群馬県「谷川岳登山指導センター」',
        url: 'https://www.pref.gunma.jp/page/1583.html',
      },
      {
        label: '群馬県「谷川岳登山の留意点」',
        url: 'https://www.pref.gunma.jp/page/1494.html',
      },
      {
        label: '観光庁「上越線開通と登山ブーム」',
        url: 'https://www.mlit.go.jp/tagengo-db/R2-00737.html',
      },
      {
        label: '観光庁「上信越高原国立公園 谷川岳地域」',
        url: 'https://www.mlit.go.jp/tagengo-db/R2-00720.html',
      },
      {
        label: 'みなかみ町「新設10周年記念」',
        url: 'https://www.town.minakami.gunma.jp/politics/02gaiyou/files/2710-minakami10nen.pdf',
      },
      {
        label: '静岡県「ふるさと富士写真館 谷川富士」',
        url: 'https://www.pref.shizuoka.jp/kankosports/kanko/mtfuji/1040329/1002781/1019185.html',
      },
      {
        label: '日本大学水上演習林「谷川岳の二つの耳」',
        url: 'https://hp.brs.nihon-u.ac.jp/~uf/minakami_diary_08.html',
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
    commentaryStatus: '伝承を含む・各店の公式情報で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '本家ちちや「温泉まんじゅう」',
        url: 'https://honke-chichiya.com/manju/',
      },
      {
        label: '松むら饅頭本舗「商品について」',
        url: 'https://matsumura-manjyu.com/manjyu',
      },
      {
        label: '草津温泉プリン「商品紹介」',
        url: 'https://www.kusatsuonsen-purin.com/',
      },
      {
        label: 'グランデフューメ草津「草津ラスク」',
        url: 'https://grandefiume-kusatsu.com/collections/kusatsu-rusk',
      },
      {
        label: '湯の香本舗「手作り草津温泉クッキー」',
        url: 'https://www.yunokahonpo.com/products/list?category_id=36',
      },
      {
        label: '草津温泉たまごボーロ（草津たまごファーム）',
        url: 'https://nakayoshinoyu.com/products/kusatsuonsentamagoboro',
      },
    ],
  },
  ke: {
    commentaryStatus: '前橋市公式資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '前橋市公式「前橋市の歴史」',
        url: 'https://www.city.maebashi.gunma.jp/soshiki/seisaku/kohobrand/gyomu/3/2/3777.html',
      },
      {
        label: '前橋市公式「前橋の歴史を知ろう！」',
        url: 'https://www.city.maebashi.gunma.jp/soshiki/kyoiku/bunkazaihogo/gyomu/2/2531.html',
      },
    ],
  },
  ka: {
    commentaryStatus: '高崎市公式資料で確認（地名由来は伝承）',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '高崎市公式「高崎城址（三の丸外囲の土居と堀）」',
        url: 'https://www.city.takasaki.gunma.jp/site/cultural-assets/3512.html',
      },
      {
        label: '高崎市公式「高崎城址」',
        url: 'https://www.city.takasaki.gunma.jp/site/sightseeing/3511.html',
      },
    ],
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
  no: {
    commentaryStatus: '群馬県観光公式・作品公式資料で確認',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '群馬県観光公式「『イニD』の聖地巡礼 前編」',
        url: 'https://gunma-kanko.jp/features/380',
      },
      {
        label: '頭文字Dポータル（Official website）',
        url: 'https://initiald-portal.com/sp/contents/about/',
      },
    ],
  },
  ni: {
    commentaryStatus: '群馬県・富岡市・国土交通省の公式資料で確認',
    commentaryVerifiedAt: '2026-07-16',
    commentarySources: [
      {
        label: '群馬県立世界遺産センター「渋沢栄一と富岡製糸場」',
        url: 'https://worldheritage.pref.gunma.jp/shibusawa_eiichi/',
      },
      {
        label: '富岡製糸場公式「富岡製糸場を知る」',
        url: 'https://www.tomioka-silk.jp/_tomioka-silk-mill/about/',
      },
      {
        label: '国土交通省「富岡製糸場と日本の近代化」',
        url: 'https://www.mlit.go.jp/tagengo-db/en/H30-00385.html',
      },
      {
        label: '文化庁「文化遺産データベース：旧富岡製糸場 繰糸所」',
        url: 'https://online.bunka.go.jp/db/heritages/detail/124804',
      },
    ],
  },
  se: {
    commentaryStatus: '尾瀬保護財団・観光庁・群馬県公式資料で確認（仙境の命名者は未確認）',
    commentaryVerifiedAt: '2026-07-16',
    commentaryPeople: [
      {
        name: '平野長蔵',
        role: '尾瀬の開山者・山小屋開設者・自然保護活動家',
        url: 'https://www.mlit.go.jp/tagengo-db/common/001927657.pdf',
      },
      {
        name: '武田久吉',
        role: '植物学者・登山家・尾瀬の紹介者',
        url: 'https://kotobank.jp/word/%E6%AD%A6%E7%94%B0%E4%B9%85%E5%90%89-1088671',
      },
      {
        name: '大下藤次郎',
        role: '画家・水彩画家',
        url: 'https://www.city.koriyama.lg.jp/site/artmuseum/19676.html',
      },
    ],
    commentarySources: [
      {
        label: '尾瀬保護財団「尾瀬の歴史」',
        url: 'https://oze-fnd.or.jp/oza/a-st/',
      },
      {
        label: '観光庁「明治時代における尾瀬の大衆化」',
        url: 'https://www.mlit.go.jp/tagengo-db/common/001927656.pdf',
      },
      {
        label: '観光庁「平野家と武田久吉：ダム建設に対する同志」',
        url: 'https://www.mlit.go.jp/tagengo-db/common/001927657.pdf',
      },
      {
        label: '群馬県公式「上毛かるた」',
        url: 'https://www.pref.gunma.jp/page/3793.html',
      },
    ],
  },
  su: {
    commentaryStatus: '気象庁・環境省・自治体・国立国会図書館資料で確認（名前の由来と1251年の記録は諸説あり）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySources: [
      {
        label: '気象庁「赤城山」',
        url: 'https://www.data.jma.go.jp/vois/data/tokyo/303_Akagisan/303_index.html',
      },
      {
        label: '産業技術総合研究所「火山別噴火履歴：赤城山」',
        url: 'https://gbank.gsj.jp/volcano/cgi-bin/volcanic.cgi?id=040',
      },
      {
        label: '環境省「赤城山エコツーリズム全体構想」',
        url: 'https://www.env.go.jp/nature/ecotourism/try-ecotourism/certification/akagi/kousou/images/document/kousou.pdf',
      },
      {
        label: '国立国会図書館「赤城山残照：国定忠治一代記」',
        url: 'https://ndlsearch.ndl.go.jp/books/R100000038-I3708695',
      },
      {
        label: '日活「名月赤城山」',
        url: 'https://www.nikkatsu.com/movie/13800.html',
      },
      {
        label: '前橋市公式「テレビアニメ『ヤマノススメ』とタイアップした赤城山マップ」',
        url: 'https://www.city.maebashi.gunma.jp/material/files/group/10/teirei_20190611_1.pdf',
      },
      {
        label: '群馬県公式動画「精霊が息づく、群馬。信仰の山・赤城編」',
        url: 'https://tsulunos.jp/single.cgi?id=5929',
      },
      {
        label: '国立赤城青少年交流の家「マスコット ササビー」',
        url: 'https://akagi.niye.go.jp/about/about/',
      },
    ],
  },
  nu: {
    commentaryStatus: '沼田市・みなかみ町公式資料、信頼資料で確認（子孫の現況は未確認）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySources: [
      {
        label: 'みなかみ町観光協会「塩原太助翁記念公園（塩原太助生家）」',
        url: 'https://www.enjoy-minakami.jp/spot/8061/',
      },
      {
        label: '沼田市公式「沼田城跡（沼田公園）」',
        url: 'https://www.city.numata.gunma.jp/kanko/bunka/1001835.html',
      },
      {
        label: '沼田市公式「土岐家資料一括」',
        url: 'https://www.city.numata.gunma.jp/kyouiku/bunkazai/ichiran/shi/1014049.html',
      },
      {
        label: '沼田市公式「義民山口六郎右衛門の墓」',
        url: 'https://www.city.numata.gunma.jp/kyouiku/bunkazai/ichiran/shi/1000919.html',
      },
      {
        label: 'コトバンク「塩原多助一代記」',
        url: 'https://kotobank.jp/word/%E5%A1%A9%E5%8E%9F%E5%A4%9A%E5%8A%A9%E4%B8%80%E4%BB%A3%E8%A8%98-72284',
      },
    ],
  },
  yu: {
    commentaryStatus: '神社・群馬県・富岡市の公式資料で由緒・地形・スダジイを確認（創建年と藤太杉は伝承、下り宮の理由は未確定）',
    commentaryVerifiedAt: '2026-07-16',
    commentaryPeople: [
      {
        name: '藤原秀郷（俵藤太）',
        role: '平将門を討った平安時代の武将。藤太杉伝承に登場',
        url: 'https://crd.ndl.go.jp/reference/entry/reference/show?id=1000113752',
      },
    ],
    commentarySources: [
      {
        label: '一之宮貫前神社公式「御由緒」',
        url: 'https://nukisaki.or.jp/go_yui_sho.html',
      },
      {
        label: '群馬県「ぐんま じ・しゃ・じゃ・めぐり」',
        url: 'https://www.pref.gunma.jp/uploaded/attachment/147546.pdf',
      },
      {
        label: '富岡市「貫前神社のスダジイ」',
        url: 'https://www.city.tomioka.lg.jp/www/contents/1643589921440/index.html',
      },
      {
        label: 'ぐんたび「貫前神社」（藤太杉の伝承）',
        url: 'https://www.guntabi.com/tomioka/nukimae.html',
      },
      {
        label: '東京大学デジタルアーカイブ「俵藤太物語」',
        url: 'https://da.dl.itc.u-tokyo.ac.jp/portal/assets/6531714a-6ce5-4f86-b2fa-0ebeb75aead0',
      },
    ],
  },
  yo: {
    commentaryStatus: '独自補足・絵札の描写に関する解釈',
  },
  wa: {
    commentaryStatus: '国立国会図書館・国立天文台・国立科学博物館資料で確認（小説は関連作品）',
    commentaryVerifiedAt: '2026-07-14',
    commentarySources: [
      {
        label: '国立国会図書館「江戸の数学：関孝和」',
        url: 'https://www.ndl.go.jp/math/s1/2.html',
      },
      {
        label: '国立天文台「渋川春海と『天地明察』」',
        url: 'https://eco.mtk.nao.ac.jp/koyomi/exhibition/042/',
      },
      {
        label: '国立科学博物館「渋川春海」',
        url: 'https://www.kahaku.go.jp/pickup-science/nid00000990.html',
      },
      {
        label: '千葉県立東部図書館「渋川春海と関孝和の交流があったのか知りたい」',
        url: 'https://crd.ndl.go.jp/reference/entry/reference/show?id=1000188514',
      },
      {
        label: 'KADOKAWA「天地明察」冲方丁',
        url: 'https://www.kadokawa.co.jp/product/200907000044/',
      },
    ],
  },
  hi: {
    commentaryStatus: '高崎市・文化庁・高崎経済大学・図書館資料で確認（像の直接の空襲被害は未確認）',
    commentaryVerifiedAt: '2026-07-16',
    commentarySources: [
      {
        label: '高崎市公式「高崎白衣大観音像」',
        url: 'https://www.city.takasaki.gunma.jp/site/cultural-assets/3526.html',
      },
      {
        label: '文化庁「文化遺産オンライン：高崎白衣大観音像」',
        url: 'https://online.bunka.go.jp/db/heritages/detail/192899',
      },
      {
        label: '高崎経済大学「宗教的ランドマークの成立過程」',
        url: 'https://dl.ndl.go.jp/view/prepareDownload?contentNo=1&itemId=info%3Andljp%2Fpid%2F8557446',
      },
      {
        label: '高崎市公式「高崎白衣大観音（観光情報）」',
        url: 'https://www.city.takasaki.gunma.jp/site/sightseeing/3527.html',
      },
      {
        label: '高崎市立中央図書館「高崎白衣大観音についての資料」',
        url: 'https://crd.ndl.go.jp/reference/modules/d3ndlcrdentry/index.php?id=1000175433&page=ref_view',
      },
      {
        label: '高崎映画祭公式「家族のレシピ」',
        url: 'https://takasakifilmfes.jp/cinema/5679/',
      },
      {
        label: '国際交流基金 JFF Theater「ミニシアターを訪ねて」',
        url: 'https://www.jff.jpf.go.jp/article/ctqtakasaki/',
      },
    ],
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
  commentaryVerification: COMMENTARY_VERIFICATION_BY_SLUG[card.slug] || 'unverified',
}));
