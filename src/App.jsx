import React, { useState, useMemo } from 'react';

// =====================================================================
// 上毛かるた アプリ
// ⚠️ 札の文言・解説は群馬県の著作物です。本ファイルのCARDSデータは
//    構造サンプルです。公開・配布前に必ず群馬県地域創生部文化振興課
//    への利用許諾申請を完了し、公式データに差し替えてください。
//    申請先: bunshinka@pref.gunma.lg.jp
// =====================================================================

// ⚠️ 読み札・解説は記憶ベースのサンプルです。公開前に群馬県公式データへ差し替えてください。
const CARDS = [
  { kana: 'あ', verse: '浅間のいたずら鬼の押出し', topic: '浅間山', desc: '吾妻郡嬬恋村にある溶岩台地「鬼押出し」。浅間山の噴火(1783年)でできた奇岩の景勝地。', category: 'shizen' },
  { kana: 'い', verse: '伊香保温泉 日本の名湯', topic: '伊香保温泉', desc: '渋川市の山あいにある温泉地。石段街と黄金の湯で知られる古湯。', category: 'meisho' },
  { kana: 'う', verse: '碓氷峠の関所跡', topic: '碓氷峠', desc: '安中市坂本にある江戸時代の関所跡。中山道の難所として知られる。', category: 'rekishi' },
  { kana: 'え', verse: '縁起だるまの少林山', topic: '少林山達磨寺', desc: '高崎市鼻高町にある曹洞宗の寺院。全国シェア約8割を誇る高崎だるまの発祥の地。', category: 'meisho' },
  { kana: 'お', verse: '太田金山 子育て呑龍', topic: '呑龍上人', desc: '太田市にある大光院の開山・呑龍上人。捨て子を養育した「子育て呑龍」として信仰を集める。', category: 'jinbutsu' },
  { kana: 'か', verse: '関東と信越つなぐ高崎市', topic: '高崎市', desc: '群馬県最大の都市。北陸・上越・長野新幹線の分岐点として交通の要衝。', category: 'meisho' },
  { kana: 'き', verse: '桐生は日本の機どころ', topic: '桐生織物', desc: '桐生市は絹織物の産地として江戸時代から栄えた。「西の西陣、東の桐生」と称される。', category: 'sangyo' },
  { kana: 'く', verse: '草津よいとこ 薬の温泉', topic: '草津温泉', desc: '吾妻郡草津町。日本三名泉のひとつ。湯畑が町のシンボル。', category: 'meisho' },
  { kana: 'け', verse: '県都前橋 生糸の市', topic: '前橋市', desc: '群馬県の県庁所在地。明治期から生糸の集散地として栄えた。', category: 'meisho' },
  { kana: 'こ', verse: '心の燈台内村鑑三', topic: '内村鑑三', desc: '高崎市出身のキリスト教思想家・文学者。無教会主義を唱え、日本の精神的文化に大きな影響を与えた。', category: 'jinbutsu' },
  { kana: 'さ', verse: '三波石と共に名高い冬桜', topic: '桜山公園', desc: '藤岡市の桜山公園。秋から冬にかけて咲く冬桜と、庭石として名高い三波石が見どころ。', category: 'shizen' },
  { kana: 'し', verse: 'しのぶ毛の国 二子塚', topic: '岩宿遺跡', desc: 'みどり市の岩宿遺跡は関東ローム層から旧石器時代の石器が出土した日本考古学の転換点。', category: 'rekishi' },
  { kana: 'す', verse: '裾野は長し赤城山', topic: '赤城山', desc: '群馬県中央部にそびえる標高1828mの成層火山。上毛三山のひとつ。', category: 'shizen' },
  { kana: 'せ', verse: '仙境尾瀬沼 花の原', topic: '尾瀬', desc: '群馬・福島・新潟・栃木にまたがる高層湿原。ミズバショウで知られる日本最大の山岳湿原。', category: 'shizen' },
  { kana: 'そ', verse: 'そろいの支度で八木節音頭', topic: '八木節', desc: '桐生市・足利市を中心に伝わる民謡。夏祭りには揃いの浴衣で踊られる群馬を代表する民俗芸能。', category: 'bunka' },
  { kana: 'た', verse: '滝は吹割 片品渓谷', topic: '吹割の滝', desc: '沼田市の片品渓谷にある「東洋のナイアガラ」と呼ばれる瀑布。国の天然記念物。', category: 'shizen' },
  { kana: 'ち', verse: '力あわせる 二百万', topic: '群馬県民', desc: '群馬県民の団結を讃える札。人口の増加に伴い改訂が重ねられてきた。', category: 'bunka' },
  { kana: 'つ', verse: 'つる舞う形の群馬県', topic: '群馬県の形', desc: '群馬県の輪郭は鶴が舞う姿に似ている。県のシンボル。', category: 'shizen' },
  { kana: 'て', verse: '天下の義人 茂左衛門', topic: '茂左衛門', desc: '沼田藩領の農民一揆を率いた磔茂左衛門。農民のために命を捨てた義人として語り継がれる。', category: 'jinbutsu' },
  { kana: 'と', verse: '利根は坂東一の川', topic: '利根川', desc: '関東平野を貫く大河。「坂東太郎」の異名を持つ群馬発祥の川。', category: 'shizen' },
  { kana: 'な', verse: '中仙道しのぶ 安中杉並木', topic: '安中杉並木', desc: '安中市の旧中山道沿いに残る杉並木。江戸時代の街道の面影をとどめる。', category: 'rekishi' },
  { kana: 'に', verse: '日本で最初の富岡製糸', topic: '富岡製糸場', desc: '明治5年(1872)創設の官営模範工場。2014年に世界文化遺産に登録。', category: 'rekishi' },
  { kana: 'ぬ', verse: '沼田城下の塩原太助', topic: '塩原太助', desc: '沼田市出身の江戸の豪商。苦労人から成功した人物として落語の題材にもなっている。', category: 'jinbutsu' },
  { kana: 'ね', verse: 'ねぎとこんにゃく 下仁田名産', topic: '下仁田町', desc: '甘楽郡下仁田町は下仁田ねぎとこんにゃくの一大産地。', category: 'sangyo' },
  { kana: 'の', verse: '登る榛名の キャンプ村', topic: '榛名山', desc: '高崎市にある成層火山。榛名湖畔はキャンプや観光の名所。上毛三山のひとつ。', category: 'shizen' },
  { kana: 'は', verse: '花山公園 つつじの名所', topic: 'つつじが岡公園', desc: '館林市のつつじが岡公園は樹齢800年を超えるつつじを誇る日本最大級のつつじの名所。', category: 'meisho' },
  { kana: 'ひ', verse: '白衣観音 慈悲の御手', topic: '白衣大観音', desc: '高崎市の慈眼院にある高さ41.8mの白衣観音像。1936年建立。高崎のシンボル。', category: 'meisho' },
  { kana: 'ふ', verse: '分福茶釜の茂林寺', topic: '茂林寺', desc: '館林市にある曹洞宗の寺院。「分福茶釜」の昔話の舞台として知られる。', category: 'meisho' },
  { kana: 'へ', verse: '平和の使徒 新島襄', topic: '新島襄', desc: '安中市出身のキリスト教教育者。同志社英学校（現・同志社大学）の創設者。', category: 'jinbutsu' },
  { kana: 'ほ', verse: '誇る文豪 田山花袋', topic: '田山花袋', desc: '館林市出身の自然主義文学の代表的作家。代表作「蒲団」は日本近代文学の金字塔。', category: 'jinbutsu' },
  { kana: 'ま', verse: '繭と生糸は日本一', topic: '養蚕・生糸業', desc: '群馬県は明治以来、養蚕・製糸業で日本一の生産量を誇った。富岡製糸場の世界遺産登録でも注目。', category: 'sangyo' },
  { kana: 'み', verse: '水上谷川 スキーと登山', topic: '谷川岳', desc: 'みなかみ町の谷川岳（標高1977m）は岩壁登山とスキーで知られる山岳リゾート。', category: 'shizen' },
  { kana: 'む', verse: '昔を語る 多胡の古碑', topic: '多胡碑', desc: '高崎市吉井町にある奈良時代の石碑。日本三古碑のひとつ。国の特別史跡。', category: 'rekishi' },
  { kana: 'め', verse: '銘仙織出す 伊勢崎市', topic: '伊勢崎銘仙', desc: '伊勢崎市は大正・昭和初期に独自の絣技法「伊勢崎銘仙」で全国にその名を馳せた織物産地。', category: 'sangyo' },
  { kana: 'も', verse: '紅葉に映える妙義山', topic: '妙義山', desc: '富岡市・安中市にまたがる奇峰の山塊。上毛三山のひとつ。秋の紅葉が絶景。', category: 'shizen' },
  { kana: 'や', verse: '耶馬溪しのぐ 吾妻峡', topic: '吾妻峡', desc: '吾妻郡東吾妻町にある渓谷。大正時代に「日本の三大渓谷美」のひとつと称された景勝地。', category: 'shizen' },
  { kana: 'ゆ', verse: 'ゆかりは古し貫前神社', topic: '貫前神社', desc: '富岡市にある延喜式内社。一之宮として崇敬を集める群馬県最古の神社のひとつ。', category: 'rekishi' },
  { kana: 'よ', verse: '世のちり洗う 四万温泉', topic: '四万温泉', desc: '吾妻郡中之条町の秘湯。「四万の病を癒す」が地名の由来とされる歴史ある温泉地。', category: 'meisho' },
  { kana: 'ら', verse: '雷と空風 義理人情', topic: '上州気質', desc: '群馬を代表する気候・風土と県民気質を詠んだ札。雷と空っ風と義理人情が上州人の象徴。', category: 'bunka' },
  { kana: 'り', verse: '理想の電化に 電源群馬', topic: '電源開発', desc: '群馬県は矢木沢ダムなど多くのダムと水力発電所を持ち、関東圏の電力を支えてきた。', category: 'sangyo' },
  { kana: 'る', verse: 'ループで名高い 清水トンネル', topic: '清水トンネル', desc: '上越線の土合駅付近を貫くトンネル。三国山脈の難工事として知られ、ループ線で高低差を克服した。', category: 'rekishi' },
  { kana: 'れ', verse: '歴史に名高い 新田義貞', topic: '新田義貞', desc: '太田市出身の南北朝時代の武将。鎌倉幕府を滅ぼした英雄として歴史に名を刻む。', category: 'jinbutsu' },
  { kana: 'ろ', verse: '老農船津伝次平', topic: '船津伝次平', desc: '前橋市出身の明治時代の農業改良家。近代農法を広め「老農」として尊敬された人物。', category: 'jinbutsu' },
  { kana: 'わ', verse: '和算の大家 関孝和', topic: '関孝和', desc: '藤岡市出身の江戸時代の数学者。行列式・円周率計算など日本独自の和算を大成した。', category: 'jinbutsu' },
];

const CATEGORIES = {
  meisho:   { label: '名所', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  jinbutsu: { label: '人物', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  rekishi:  { label: '歴史', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  shizen:   { label: '自然', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  sangyo:   { label: '産業', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  bunka:    { label: '文化', color: 'bg-rose-100 text-rose-900 border-rose-300' },
};

export default function App() {
  const [view, setView] = useState('list');
  const [selectedCard, setSelectedCard] = useState(null);
  const [filter, setFilter] = useState('all');
  const [quizCard, setQuizCard] = useState(null);
  const [quizChoices, setQuizChoices] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const filteredCards = useMemo(
    () => filter === 'all' ? CARDS : CARDS.filter(c => c.category === filter),
    [filter]
  );

  const startQuiz = () => {
    const card = CARDS[Math.floor(Math.random() * CARDS.length)];
    const wrong = CARDS.filter(c => c.kana !== card.kana)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [card, ...wrong].sort(() => Math.random() - 0.5);
    setQuizCard(card);
    setQuizChoices(choices);
    setQuizResult(null);
    setView('quiz');
  };

  const answerQuiz = (kana) => {
    const correct = kana === quizCard.kana;
    setQuizResult(correct);
    setQuizScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const openCard = (card) => { setSelectedCard(card); setView('detail'); };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif' }}>
      <header className="border-b border-stone-300 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl tracking-wider">
            <span className="text-red-700">上毛</span>かるた
          </h1>
          <nav className="flex gap-2 text-sm">
            <button onClick={() => setView('list')}
              className={`px-3 py-1.5 border ${view === 'list' ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white border-stone-300'}`}>一覧</button>
            <button onClick={startQuiz}
              className={`px-3 py-1.5 border ${view === 'quiz' ? 'bg-red-700 text-stone-50 border-red-700' : 'bg-white border-stone-300'}`}>クイズ</button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'list' && (
          <ListView cards={filteredCards} filter={filter} setFilter={setFilter} onSelect={openCard} />
        )}
        {view === 'detail' && selectedCard && (
          <DetailView card={selectedCard} onBack={() => setView('list')} />
        )}
        {view === 'quiz' && quizCard && (
          <QuizView card={quizCard} choices={quizChoices} result={quizResult} score={quizScore}
            onAnswer={answerQuiz} onNext={startQuiz} onExit={() => setView('list')} />
        )}
      </main>

      <footer className="border-t border-stone-300 bg-stone-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-xs text-stone-600 text-center space-y-1">
          <p>「上毛かるた」© 群馬県　／　利用許諾番号 第◯◯-◯◯◯◯号</p>
          <p>本アプリは群馬県の利用許諾を得て制作されたもので、群馬県の公式アプリではありません。</p>
        </div>
      </footer>
    </div>
  );
}

function ListView({ cards, filter, setFilter, onSelect }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterButton label="すべて" active={filter === 'all'} onClick={() => setFilter('all')} />
        {Object.entries(CATEGORIES).map(([key, { label }]) => (
          <FilterButton key={key} label={label} active={filter === key} onClick={() => setFilter(key)} />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <button key={card.kana} onClick={() => onSelect(card)}
            className="group bg-white border border-stone-300 p-4 text-left hover:border-red-700 hover:shadow-md transition-all">
            <div className="text-5xl text-red-700 mb-2">{card.kana}</div>
            <div className="text-sm leading-relaxed">{card.verse}</div>
            <div className={`mt-3 inline-block text-[10px] px-2 py-0.5 border ${CATEGORIES[card.category]?.color || ''}`}>
              {CATEGORIES[card.category]?.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 text-sm border ${active ? 'bg-stone-900 text-stone-50 border-stone-900' : 'bg-white border-stone-300 hover:border-stone-500'}`}>
      {label}
    </button>
  );
}

function DetailView({ card, onBack }) {
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="text-sm text-stone-600 hover:text-stone-900 mb-6">← 一覧に戻る</button>
      <div className="bg-white border border-stone-300 p-8 sm:p-12">
        <div className="text-8xl text-red-700 mb-6 text-center">{card.kana}</div>
        <div className="text-2xl text-center mb-4">{card.verse}</div>
        <div className={`inline-block text-xs px-2 py-0.5 border mb-6 ${CATEGORIES[card.category]?.color || ''}`}>
          {CATEGORIES[card.category]?.label}
        </div>
        <h2 className="text-xl font-bold mb-2">{card.topic}</h2>
        <p className="text-stone-700 leading-relaxed">{card.desc}</p>
      </div>
    </div>
  );
}

function QuizView({ card, choices, result, score, onAnswer, onNext, onExit }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 text-sm">
        <button onClick={onExit} className="text-stone-600 hover:text-stone-900">← 終わる</button>
        <div className="text-stone-600">スコア: {score.correct} / {score.total}</div>
      </div>
      <div className="bg-white border border-stone-300 p-8 mb-6">
        <p className="text-sm text-stone-600 mb-3">読み札の頭文字はどれ?</p>
        <p className="text-xl">{card.verse}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {choices.map(c => (
          <button key={c.kana} onClick={() => result === null && onAnswer(c.kana)} disabled={result !== null}
            className={`text-5xl py-6 border ${
              result === null
                ? 'bg-white border-stone-300 hover:border-red-700'
                : c.kana === card.kana
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                  : 'bg-white border-stone-300 opacity-50'
            }`}>
            {c.kana}
          </button>
        ))}
      </div>
      {result !== null && (
        <div className="mt-6 text-center">
          <p className={`text-xl mb-4 ${result ? 'text-emerald-700' : 'text-red-700'}`}>
            {result ? '正解!' : `不正解。正解は「${card.kana}」`}
          </p>
          <button onClick={onNext} className="px-6 py-2 bg-stone-900 text-stone-50">次の問題</button>
        </div>
      )}
    </div>
  );
}
