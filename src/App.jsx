import React, { useEffect, useMemo, useState } from 'react';
import { CARDS, COMMENTARY_VERIFICATION_LEVELS } from './data/cards.js';
import { CATEGORIES } from './data/categories.js';
import { LICENSE, getCreditLine } from './data/license.js';

// =====================================================================
// 上毛かるた 学習アプリ
// 公開・販売前に必ず行うこと:
// 1. 公式絵札・読み札の全体表示と可読性を確認する
// 2. 許諾番号、利用期間、非公式アプリ表記を確認する
// 3. src/data/license.js の公開可否を人間確認後に確定する
// =====================================================================

const DIFFICULTY = {
  easy: { label: 'かんたん', choices: 2, desc: '2択' },
  normal: { label: 'ふつう', choices: 4, desc: '4択' },
  hard: { label: 'むずかしい', choices: 6, desc: '6択' },
};

const QUIZ_MODES = {
  verseToKana: {
    label: '読みから頭文字',
    desc: '読み札を見て、合う頭文字を選ぶ',
  },
  imageToVerse: {
    label: '絵札から読み札',
    desc: '絵札を見て、合う読み札を選ぶ',
  },
};

const QUIZ_LENGTH = 10;
const REVIEW_STORAGE_KEY = 'jomo-karuta-review-kanas-v1';
const LEARNING_STORAGE_KEY = 'jomo-karuta-learning-v1';
const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
const READING_CARDS_WITH_RIGHT_SCAN_MARGIN = new Set(['あ', 'い', 'う', 'え', 'お']);
const COMMENTARY_PREVIEW_SECTION_COUNT = 3;

const shuffleItems = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const getJapanDateKey = () => new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Tokyo',
}).format(new Date());

const getDailyCards = () => {
  const seed = getJapanDateKey();
  let value = Array.from(seed).reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
  const ordered = [...CARDS];

  for (let index = ordered.length - 1; index > 0; index -= 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const swapIndex = value % (index + 1);
    [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
  }

  return ordered.slice(0, QUIZ_LENGTH);
};

const readReviewKanas = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((kana) => CARDS.some((card) => card.kana === kana)) : [];
  } catch {
    return [];
  }
};

const writeReviewKanas = (kanas) => {
  try {
    window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(kanas));
  } catch {
    // Private browsing or storage restrictions should not block learning.
  }
};

const emptyLearningRecord = () => ({ cards: {}, history: [], sessions: [], dailyCompletions: [] });

const readLearningRecord = () => {
  if (typeof window === 'undefined') return emptyLearningRecord();
  try {
    const stored = JSON.parse(window.localStorage.getItem(LEARNING_STORAGE_KEY) || '{}');
    return {
      cards: stored?.cards && typeof stored.cards === 'object' ? stored.cards : {},
      history: Array.isArray(stored?.history) ? stored.history.slice(-200) : [],
      sessions: Array.isArray(stored?.sessions) ? stored.sessions.slice(-30) : [],
      dailyCompletions: Array.isArray(stored?.dailyCompletions)
        ? stored.dailyCompletions.filter((key) => typeof key === 'string').slice(-400)
        : [],
    };
  } catch {
    return emptyLearningRecord();
  }
};

const writeLearningRecord = (record) => {
  try {
    window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private browsing or storage restrictions should not block learning.
  }
};

const getTokyoDateKey = (date = new Date()) => new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Tokyo',
}).format(date);

const addDaysToDateKey = (dateKey, days) => {
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  date.setDate(date.getDate() + days);
  return getTokyoDateKey(date);
};

const formatDateKey = (dateKey) => dateKey ? dateKey.replaceAll('-', '/') : '未設定';

const getDailyStreak = (dailyCompletions) => {
  const days = new Set(dailyCompletions);
  const today = getTokyoDateKey();
  let dateKey = days.has(today) ? today : addDaysToDateKey(today, -1);
  let streak = 0;
  while (days.has(dateKey)) {
    streak += 1;
    dateKey = addDaysToDateKey(dateKey, -1);
  }
  return streak;
};

const getCardFromHash = () => {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#\/card\/([a-z0-9-]+)$/);
  if (!match) return null;
  return CARDS.find((card) => card.slug === match[1]) || null;
};

const getCardLearning = (record, card) => record.cards[card.slug] || {
  attempts: 0,
  correct: 0,
  incorrect: 0,
  streak: 0,
  bestStreak: 0,
  lastAnsweredAt: null,
  nextReviewAt: null,
};

const getAccuracy = (stats) => stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : null;

const formatDateTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '日時不明';
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const getModeLabel = (mode) => QUIZ_MODES[mode]?.label || mode || '学習';

function LearningStatsView({ cards, learningRecord, onSelect }) {
  const today = getTokyoDateKey();
  const attemptedCards = cards.filter((card) => getCardLearning(learningRecord, card).attempts > 0);
  const totals = attemptedCards.reduce((summary, card) => {
    const stats = getCardLearning(learningRecord, card);
    return {
      attempts: summary.attempts + stats.attempts,
      correct: summary.correct + stats.correct,
    };
  }, { attempts: 0, correct: 0 });
  const dueCards = attemptedCards.filter((card) => {
    const nextReviewAt = getCardLearning(learningRecord, card).nextReviewAt;
    return nextReviewAt && nextReviewAt <= today;
  });
  const weakCards = [...attemptedCards]
    .sort((left, right) => {
      const leftStats = getCardLearning(learningRecord, left);
      const rightStats = getCardLearning(learningRecord, right);
      const leftDue = leftStats.nextReviewAt && leftStats.nextReviewAt <= today ? 0 : 1;
      const rightDue = rightStats.nextReviewAt && rightStats.nextReviewAt <= today ? 0 : 1;
      if (leftDue !== rightDue) return leftDue - rightDue;
      return (getAccuracy(leftStats) ?? 101) - (getAccuracy(rightStats) ?? 101);
    })
    .slice(0, 8);
  const categoryRows = Object.entries(CATEGORIES).map(([key, category]) => {
    const categoryCards = cards.filter((card) => card.category === key);
    const categoryTotals = categoryCards.reduce((summary, card) => {
      const stats = getCardLearning(learningRecord, card);
      return {
        attempts: summary.attempts + stats.attempts,
        correct: summary.correct + stats.correct,
      };
    }, { attempts: 0, correct: 0 });
    return { key, label: category.label, ...categoryTotals };
  });
  const recentHistory = [...learningRecord.history].reverse().slice(0, 10);
  const recentSessions = [...learningRecord.sessions].reverse().slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl">学習記録</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          この端末のブラウザ内に、クイズの結果と復習の目安を保存しています。外部には送信しません。
        </p>
      </div>

      <section aria-label="学習の概要" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['解答数', `${totals.attempts}問`],
          ['正答率', totals.attempts > 0 ? `${Math.round((totals.correct / totals.attempts) * 100)}%` : '未記録'],
          ['学習した札', `${attemptedCards.length} / ${cards.length}枚`],
          ['復習時期', `${dueCards.length}枚`],
        ].map(([label, value]) => (
          <div key={label} className="border border-stone-300 bg-white p-4">
            <div className="text-xs text-stone-500">{label}</div>
            <div className="mt-2 text-xl font-bold text-stone-900">{value}</div>
          </div>
        ))}
      </section>

      <section className="mb-6 border border-stone-300 bg-white p-5">
        <h3 className="mb-3 text-lg font-bold">今日の10枚</h3>
        {learningRecord.dailyCompletions.length === 0 ? (
          <p className="text-sm leading-relaxed text-stone-600">まだ完走記録がありません。一覧の「今日の10枚」を最後まで見ると、ここに記録されます。</p>
        ) : (
          <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600">
            <span>
              <span className="mr-1 text-2xl font-bold text-red-700">{getDailyStreak(learningRecord.dailyCompletions)}</span>日連続
            </span>
            <span>
              累計 <span className="font-bold text-stone-900">{learningRecord.dailyCompletions.length}</span>日
            </span>
            <span className={learningRecord.dailyCompletions.includes(today) ? 'text-emerald-700' : 'text-red-700'}>
              {learningRecord.dailyCompletions.includes(today) ? '今日の分は完走済み' : '今日の分はまだです'}
            </span>
          </div>
        )}
      </section>

      <section className="mb-6 border border-stone-300 bg-white p-5">
        <h3 className="mb-3 text-lg font-bold">苦手な札・復習が近い札</h3>
        {weakCards.length === 0 ? (
          <p className="text-sm leading-relaxed text-stone-600">まだ学習記録がありません。クイズを解くと、札ごとの正答率と復習日がここに表示されます。</p>
        ) : (
          <div className="grid gap-2">
            {weakCards.map((card) => {
              const stats = getCardLearning(learningRecord, card);
              const due = stats.nextReviewAt && stats.nextReviewAt <= today;
              return (
                <button
                  key={card.slug}
                  type="button"
                  onClick={() => onSelect(card)}
                  className="flex min-w-0 items-center justify-between gap-3 border border-stone-200 bg-stone-50 p-3 text-left hover:border-red-700"
                >
                  <span className="min-w-0">
                    <span className="mr-3 text-2xl text-red-700">{card.kana}</span>
                    <span className="text-sm">{card.verse}</span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-stone-600">
                    <span className="block font-bold text-stone-900">正答率 {getAccuracy(stats)}%</span>
                    <span className={due ? 'text-red-700' : ''}>{due ? '復習時期です' : `次回 ${formatDateKey(stats.nextReviewAt)}`}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-6 border border-stone-300 bg-white p-5">
        <h3 className="mb-3 text-lg font-bold">カテゴリ別成績</h3>
        <div className="grid gap-2">
          {categoryRows.map((row) => (
            <div key={row.key} className="grid grid-cols-[5rem_1fr_auto] items-center gap-3 border-b border-stone-100 py-2 text-sm last:border-b-0">
              <span className="font-bold">{row.label}</span>
              <span className="text-stone-600">{row.attempts > 0 ? `${row.correct} / ${row.attempts}問` : '未記録'}</span>
              <span className="font-bold text-stone-900">{row.attempts > 0 ? `${Math.round((row.correct / row.attempts) * 100)}%` : '—'}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 border border-stone-300 bg-white p-5">
        <h3 className="mb-3 text-lg font-bold">学習履歴</h3>
        {recentSessions.length === 0 && recentHistory.length === 0 ? (
          <p className="text-sm text-stone-600">学習履歴はまだありません。</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-bold text-stone-700">最近のクイズ</h4>
              {recentSessions.length === 0 ? (
                <p className="text-sm text-stone-500">未記録</p>
              ) : (
                <ul className="space-y-2 text-sm text-stone-600">
                  {recentSessions.map((session) => (
                    <li key={session.id} className="border-b border-stone-100 pb-2">
                      {formatDateTime(session.at)}：{getModeLabel(session.mode)} {session.correct} / {session.total}問
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-stone-700">最近の解答</h4>
              {recentHistory.length === 0 ? (
                <p className="text-sm text-stone-500">未記録</p>
              ) : (
                <ul className="space-y-2 text-sm text-stone-600">
                  {recentHistory.map((entry) => (
                    <li key={entry.id} className="border-b border-stone-100 pb-2">
                      {formatDateTime(entry.at)}：<span className={entry.correct ? 'text-emerald-700' : 'text-red-700'}>{entry.correct ? '正解' : '不正解'}</span> {entry.kana}（{getModeLabel(entry.mode)}）
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState(() => (getCardFromHash() ? 'detail' : 'list'));
  const [selectedCard, setSelectedCard] = useState(() => getCardFromHash());
  const [filter, setFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('normal');
  const [quizMode, setQuizMode] = useState('verseToKana');

  const [quizCard, setQuizCard] = useState(null);
  const [quizChoices, setQuizChoices] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [quizDeck, setQuizDeck] = useState([]);
  const [quizStartedAt, setQuizStartedAt] = useState(null);
  const [reviewKanas, setReviewKanas] = useState(readReviewKanas);
  const [learningRecord, setLearningRecord] = useState(readLearningRecord);

  const [flashIndex, setFlashIndex] = useState(0);
  const [flashOrder, setFlashOrder] = useState([]);
  const [flashTitle, setFlashTitle] = useState('フラッシュカード');
  const [flashKind, setFlashKind] = useState('all');

  useEffect(() => {
    const applyHash = () => {
      const card = getCardFromHash();
      if (card) {
        setSelectedCard(card);
        setView('detail');
      } else {
        setView((current) => (current === 'detail' ? 'list' : current));
      }
    };
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const filteredCards = useMemo(
    () => (filter === 'all' ? CARDS : CARDS.filter((card) => card.category === filter)),
    [filter],
  );
  const reviewCards = useMemo(
    () => reviewKanas.map((kana) => CARDS.find((card) => card.kana === kana)).filter(Boolean),
    [reviewKanas],
  );

  const buildQuestion = (card, diff = difficulty) => {
    const n = DIFFICULTY[diff].choices;
    const wrong = shuffleItems(CARDS.filter((candidate) => candidate.kana !== card.kana))
      .slice(0, n - 1);

    return {
      card,
      choices: shuffleItems([card, ...wrong]),
    };
  };

  const startQuiz = (diff = difficulty) => {
    const [card, ...remainingCards] = shuffleItems(CARDS);
    const { choices } = buildQuestion(card, diff);
    setQuizCard(card);
    setQuizChoices(choices);
    setQuizDeck(remainingCards);
    setQuizResult(null);
    setQuizScore({ correct: 0, total: 0 });
    setCombo(0);
    setMaxCombo(0);
    setMistakes([]);
    setQuizStartedAt(new Date().toISOString());
    setView('quiz');
  };

  const nextQuestion = () => {
    const [card, ...remainingCards] = quizDeck;
    if (!card) return;
    const { choices } = buildQuestion(card);
    setQuizCard(card);
    setQuizChoices(choices);
    setQuizDeck(remainingCards);
    setQuizResult(null);
  };

  const rememberReviewCard = (card) => {
    setReviewKanas((current) => {
      if (current.includes(card.kana)) return current;
      const next = [...current, card.kana];
      writeReviewKanas(next);
      return next;
    });
  };

  const removeReviewCard = (card) => {
    setReviewKanas((current) => {
      const next = current.filter((kana) => kana !== card.kana);
      writeReviewKanas(next);
      return next;
    });
  };

  const recordLearningAnswer = (card, correct, mode) => {
    setLearningRecord((current) => {
      const previous = getCardLearning(current, card);
      const nextStreak = correct ? previous.streak + 1 : 0;
      const intervalDays = correct
        ? REVIEW_INTERVALS_DAYS[Math.min(nextStreak - 1, REVIEW_INTERVALS_DAYS.length - 1)]
        : REVIEW_INTERVALS_DAYS[0];
      const now = new Date().toISOString();
      const nextCard = {
        ...previous,
        attempts: previous.attempts + 1,
        correct: previous.correct + (correct ? 1 : 0),
        incorrect: previous.incorrect + (correct ? 0 : 1),
        streak: nextStreak,
        bestStreak: Math.max(previous.bestStreak, nextStreak),
        lastAnsweredAt: now,
        nextReviewAt: addDaysToDateKey(getTokyoDateKey(), intervalDays),
      };
      const nextRecord = {
        ...current,
        cards: { ...current.cards, [card.slug]: nextCard },
        history: [
          ...current.history,
          { id: `${now}-${card.slug}`, at: now, slug: card.slug, kana: card.kana, correct, mode },
        ].slice(-200),
      };
      writeLearningRecord(nextRecord);
      return nextRecord;
    });
  };

  const recordLearningSession = (score, mode, startedAt) => {
    setLearningRecord((current) => {
      const completedAt = new Date().toISOString();
      const durationSeconds = startedAt
        ? Math.max(0, Math.round((Date.now() - new Date(startedAt).getTime()) / 1000))
        : null;
      const nextRecord = {
        ...current,
        sessions: [
          ...current.sessions,
          {
            id: completedAt,
            at: completedAt,
            correct: score.correct,
            total: score.total,
            mode,
            difficulty,
            durationSeconds,
          },
        ].slice(-30),
      };
      writeLearningRecord(nextRecord);
      return nextRecord;
    });
  };

  const answerQuiz = (kana) => {
    if (!quizCard || quizResult !== null) return;
    const correct = kana === quizCard.kana;
    const newCombo = correct ? combo + 1 : 0;
    setCombo(newCombo);
    setMaxCombo((current) => Math.max(current, newCombo));
    setQuizResult(correct);
    recordLearningAnswer(quizCard, correct, quizMode);
    if (!correct) {
      const chosen = CARDS.find((card) => card.kana === kana);
      rememberReviewCard(quizCard);
      setMistakes((current) => [
        ...current,
        {
          card: quizCard,
          chosenKana: chosen?.kana || kana,
          chosenVerse: chosen?.verse || '',
          mode: quizMode,
        },
      ]);
    }
    const nextScore = {
      correct: quizScore.correct + (correct ? 1 : 0),
      total: quizScore.total + 1,
    };
    setQuizScore(nextScore);
    if (nextScore.total >= QUIZ_LENGTH) {
      recordLearningSession(nextScore, quizMode, quizStartedAt);
    }
  };

  const startFlashSession = (order, title, kind) => {
    setFlashOrder(order);
    setFlashIndex(0);
    setFlashTitle(title);
    setFlashKind(kind);
    setView('flash');
  };

  const startFlash = () => {
    startFlashSession(shuffleItems(CARDS), 'フラッシュカード', 'all');
  };

  const startDailyFlash = () => {
    startFlashSession(getDailyCards(), '今日の10枚', 'daily');
  };

  const recordDailyCompletion = () => {
    setLearningRecord((current) => {
      const today = getTokyoDateKey();
      if (current.dailyCompletions.includes(today)) return current;
      const nextRecord = {
        ...current,
        dailyCompletions: [...current.dailyCompletions, today].slice(-400),
      };
      writeLearningRecord(nextRecord);
      return nextRecord;
    });
  };

  const nextFlash = () => {
    if (flashIndex + 1 >= flashOrder.length) {
      if (flashKind === 'daily') {
        recordDailyCompletion();
        setView('daily-complete');
      } else {
        startFlash();
      }
    } else {
      setFlashIndex((index) => index + 1);
    }
  };

  const openCard = (card) => {
    setSelectedCard(card);
    setView('detail');
    window.location.hash = `/card/${card.slug}`;
  };

  const closeCard = () => {
    if (window.location.hash.startsWith('#/card/')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setView('list');
  };

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: '"Zen Maru Gothic", "Hiragino Maru Gothic ProN", "Hiragino Sans", sans-serif' }}
    >
      <header className="sticky top-0 z-10 border-b border-stone-300 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="title-dela text-3xl tracking-wide">
              <span className="text-red-700">上毛</span>かるた
            </h1>
            <p className="mt-1 text-xs text-stone-500">
              {LICENSE.publicReleaseAllowed
                ? '学習Webアプリ・許諾取得済み／公式データ反映済み・公開中'
                : '学習Webアプリ・許諾取得済み／公式データ反映済み・公開前確認中'}
            </p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            <NavButton active={view === 'list'} onClick={() => setView('list')}>一覧</NavButton>
            <NavButton active={view === 'flash'} onClick={() => startFlash()}>フラッシュ</NavButton>
            <NavButton active={view === 'quiz' || view === 'quiz-select'} onClick={() => setView('quiz-select')}>クイズ</NavButton>
            <NavButton active={view === 'review'} onClick={() => setView('review')}>復習</NavButton>
            <NavButton active={view === 'stats'} onClick={() => setView('stats')}>学習記録</NavButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <StatusBanner />

        {view === 'list' && (
          <ListView
            cards={filteredCards}
            filter={filter}
            setFilter={setFilter}
            onSelect={openCard}
            onStartDaily={startDailyFlash}
          />
        )}
        {view === 'detail' && selectedCard && (
          <DetailView card={selectedCard} onBack={closeCard} />
        )}
        {view === 'daily-complete' && (
          <DailyCompleteView
            streak={getDailyStreak(learningRecord.dailyCompletions)}
            totalDays={learningRecord.dailyCompletions.length}
            onRestart={startDailyFlash}
            onHome={() => setView('list')}
            onQuiz={() => setView('quiz-select')}
          />
        )}
        {view === 'flash' && flashOrder.length > 0 && (
          <FlashView
            key={flashIndex}
            card={flashOrder[flashIndex]}
            index={flashIndex}
            total={flashOrder.length}
            title={flashTitle}
            onNext={nextFlash}
            onExit={() => setView('list')}
          />
        )}
        {view === 'quiz-select' && (
          <QuizSelect
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            quizMode={quizMode}
            setQuizMode={setQuizMode}
            onStart={startQuiz}
          />
        )}
        {view === 'quiz' && quizCard && (
          <QuizView
            card={quizCard}
            choices={quizChoices}
            result={quizResult}
            score={quizScore}
            combo={combo}
            maxCombo={maxCombo}
            quizLength={QUIZ_LENGTH}
            quizMode={quizMode}
            onAnswer={answerQuiz}
            onNext={nextQuestion}
            onExit={() => setView('list')}
            onFinish={() => setView('quiz-result')}
          />
        )}
        {view === 'quiz-result' && (
          <QuizResult
            score={quizScore}
            maxCombo={maxCombo}
            mistakes={mistakes}
            onRetry={() => startQuiz()}
            onHome={() => setView('list')}
            onReview={(card) => openCard(card)}
          />
        )}
        {view === 'review' && (
          <ReviewView cards={reviewCards} onSelect={openCard} onRemove={removeReviewCard} />
        )}
        {view === 'stats' && (
          <LearningStatsView cards={CARDS} learningRecord={learningRecord} onSelect={openCard} />
        )}
      </main>

      <footer className="mt-16 border-t border-stone-300 bg-stone-100">
        <LicenseCredit />
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 ${
        active ? 'border-stone-900 bg-stone-900 text-stone-50' : 'border-stone-300 bg-white hover:border-stone-500'
      }`}
    >
      {children}
    </button>
  );
}

function StatusBanner() {
  if (LICENSE.publicReleaseAllowed) return null;

  return (
    <div className="mb-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
      <strong>公開前確認:</strong> {LICENSE.dataNotice}
    </div>
  );
}

function LicenseCredit() {
  return (
    <div className="mx-auto max-w-5xl space-y-1 px-4 py-6 text-center text-xs text-stone-600">
      <p>{getCreditLine()}</p>
      <p>利用期間: {LICENSE.usagePeriod} ／ 許諾範囲: {LICENSE.permittedMaterials}</p>
      <p>{LICENSE.officialAppNotice}</p>
    </div>
  );
}

function ListView({ cards, filter, setFilter, onSelect, onStartDaily }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onStartDaily}
          className="border border-red-700 bg-red-700 px-3 py-1.5 text-sm text-white hover:bg-red-800"
        >
          今日の10枚
        </button>
        <FilterButton label="すべて" active={filter === 'all'} onClick={() => setFilter('all')} />
        {Object.entries(CATEGORIES).map(([key, { label }]) => (
          <FilterButton key={key} label={label} active={filter === key} onClick={() => setFilter(key)} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.kana}
            type="button"
            onClick={() => onSelect(card)}
            className="group bg-white p-4 text-left transition-all hover:shadow-md"
          >
            <KarutaImage card={card} variant="thumb" />
            <div className="mb-2 mt-3 text-5xl text-red-700">{card.kana}</div>
            <div className="text-sm leading-relaxed">{card.verse}</div>
            <div className={`mt-3 inline-block border px-2 py-0.5 text-[10px] ${CATEGORIES[card.category]?.color || ''}`}>
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
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 text-sm ${
        active ? 'border-stone-900 bg-stone-900 text-stone-50' : 'border-stone-300 bg-white hover:border-stone-500'
      }`}
    >
      {label}
    </button>
  );
}

function KarutaImage({ card, variant = 'large' }) {
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [card.imageSrc]);

  const sizeClass = variant === 'pair'
    ? 'karuta-pair-frame text-sm'
    : variant === 'thumb'
      ? 'aspect-[4/5] text-xs'
      : 'aspect-[4/5] text-sm';
  const imageClass = 'karuta-card-image';

  if (card.imageSrc && !imageError) {
    return (
      <div className={`karuta-card-frame flex justify-center overflow-hidden border border-stone-300 bg-white ${sizeClass}`}>
        <img
          src={card.imageSrc}
          alt={card.imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className={imageClass}
        />
      </div>
    );
  }

  return (
    <div role="img" aria-label={`${card.imageAlt}：${imageError ? '画像を読み込めません' : '公式データ待ち'}`} className={`karuta-card-frame flex flex-col items-center justify-center border border-dashed border-stone-400 bg-stone-100 p-3 text-center text-stone-500 ${sizeClass}`}>
      <span className="font-bold text-stone-700">{imageError ? '画像エラー' : '絵札枠'}</span>
      <span>{imageError ? '画像を読み込めません' : '公式データ待ち'}</span>
    </div>
  );
}

function YomifudaImage({ card, variant = 'large' }) {
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [card.readingImageSrc]);

  const sizeClass = variant === 'pair' ? 'karuta-pair-frame' : 'aspect-[4/5]';
  const isWideScan = READING_CARDS_WITH_RIGHT_SCAN_MARGIN.has(card.kana);
  const imageClass = 'karuta-card-image';

  if (card.readingImageSrc && !imageError) {
    return (
      <div className={`karuta-card-frame flex overflow-hidden border border-stone-300 bg-white ${sizeClass} ${isWideScan ? 'karuta-reading-wide-frame' : 'justify-center'}`}>
        <img
          src={card.readingImageSrc}
          alt={card.readingImageAlt}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className={imageClass}
        />
      </div>
    );
  }

  return (
    <div role="img" aria-label={`${card.readingImageAlt}：${imageError ? '画像を読み込めません' : '公式データ待ち'}`} className={`karuta-card-frame flex flex-col items-center justify-center border border-dashed border-stone-400 bg-stone-100 p-3 text-center text-sm text-stone-500 ${sizeClass}`}>
      <span className="font-bold text-stone-700">{imageError ? '画像エラー' : '読み札枠'}</span>
      <span>{imageError ? '画像を読み込めません' : '公式データ待ち'}</span>
    </div>
  );
}

function CommentarySection({ section }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-stone-900">{section.title}</h4>
      <p className="mt-1 leading-relaxed text-stone-700">{section.body}</p>
    </div>
  );
}

function DetailView({ card, onBack }) {
  const verification = COMMENTARY_VERIFICATION_LEVELS[card.commentaryVerification]
    || COMMENTARY_VERIFICATION_LEVELS.unverified;
  const previewSections = card.commentarySections.slice(0, COMMENTARY_PREVIEW_SECTION_COUNT);
  const additionalSections = card.commentarySections.slice(COMMENTARY_PREVIEW_SECTION_COUNT);

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl">
      <div className="bg-white p-6 sm:p-10">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <figure className="min-w-0">
            <figcaption className="mb-2 text-sm font-bold text-stone-600">絵札</figcaption>
            <KarutaImage card={card} variant="pair" />
          </figure>
          <figure className="min-w-0">
            <figcaption className="mb-2 text-sm font-bold text-stone-600">読み札</figcaption>
            <YomifudaImage card={card} variant="pair" />
          </figure>
        </div>
        <div className="mb-4 mt-6 text-center text-8xl text-red-700">{card.kana}</div>
        <div className="mb-4 text-center text-2xl">{card.verse}</div>
        <div className={`mb-6 inline-block border px-2 py-0.5 text-xs ${CATEGORIES[card.category]?.color || ''}`}>
          {CATEGORIES[card.category]?.label}
        </div>

        <h2 className="mb-2 text-xl font-bold">{card.topic}</h2>
        <section className="border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-2 text-sm font-bold text-amber-900">まなびメモ（独自補足）</h3>
          {card.commentarySections.length > 0 ? (
            <div>
              {card.commentarySummary && (
                <p className="border-b border-amber-200 pb-4 leading-relaxed text-stone-800">
                  {card.commentarySummary}
                </p>
              )}
              <div className="mt-4 space-y-4">
                {previewSections.map((section) => (
                  <CommentarySection key={section.title} section={section} />
                ))}
              </div>
              {additionalSections.length > 0 && (
                <details key={card.slug} className="commentary-details mt-5 border-t border-amber-200 pt-2">
                  <summary className="cursor-pointer py-3 text-sm font-bold text-red-800">
                    もっと詳しく読む（残り{additionalSections.length}項目）
                  </summary>
                  <div className="space-y-4 pb-2 pt-2">
                    {additionalSections.map((section) => (
                      <CommentarySection key={section.title} section={section} />
                    ))}
                  </div>
                </details>
              )}
            </div>
          ) : (
            <p className="leading-relaxed text-stone-700">解説を準備中です。</p>
          )}
          <p className="mt-2 text-xs text-amber-900">絵札・読み札とは別の独自学習メモです。群馬県が作成した解説文ではありません。</p>
        </section>
        <section className="mt-4 border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-stone-800">出典状態：</span>
            <span className={`inline-flex items-center border px-2 py-0.5 text-xs font-bold ${verification.className}`}>
              {verification.label}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-stone-600">{verification.description}</p>
          <p className="mt-2">
            <span className="font-bold text-stone-800">確認メモ：</span>
            {card.commentaryStatus}
          </p>
          {card.commentaryVerifiedAt && (
            <p className="mt-1 text-xs text-stone-500">最終確認日：{card.commentaryVerifiedAt}</p>
          )}
          {card.commentaryPeople.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-stone-700">関連人物</p>
              <ul className="mt-1 space-y-1">
                {card.commentaryPeople.map((person) => (
                  <li key={person.url}>
                    <a
                      href={person.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-800 underline underline-offset-2 hover:text-red-950"
                    >
                      {person.name}
                    </a>
                    <span className="ml-1 text-stone-600">：{person.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {card.commentarySources.length > 0 ? (
            <div className="mt-2">
              <p className="text-xs font-bold text-stone-700">根拠資料</p>
              <ul className="mt-1 space-y-1">
                {card.commentarySources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-800 underline underline-offset-2 hover:text-red-950"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-xs text-stone-500">個別の根拠資料は未確認です。</p>
          )}
        </section>
      </div>
      <button type="button" onClick={onBack} className="mt-4 w-full border border-stone-300 bg-white py-4 text-sm text-stone-700 hover:bg-stone-50">
        ← 一覧に戻る
      </button>
    </div>
  );
}

function FlashView({ card, index, total, title, onNext, onExit }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm text-stone-500">
        <button type="button" onClick={onExit}>← やめる</button>
        <span>{title}　{index + 1} / {total}</span>
      </div>

      <div
        onClick={!revealed ? () => setRevealed(true) : undefined}
        role="button"
        tabIndex={revealed ? -1 : 0}
        aria-expanded={revealed}
        aria-label={revealed ? '読み札を表示中' : '絵札を見て読み札を表示'}
        onKeyDown={(event) => {
          if (!revealed && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setRevealed(true);
          }
        }}
        className={`select-none rounded-sm border-2 bg-white p-5 transition-all ${
          !revealed ? 'cursor-pointer border-amber-400 hover:border-amber-600' : 'border-stone-300'
        }`}
      >
        <div className="grid gap-5 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center">
          <div className="mx-auto w-full max-w-56">
            <KarutaImage card={card} />
          </div>
          <div className="text-center sm:text-left">
            <div className="mb-3 text-7xl font-bold leading-none text-red-700">{card.kana}</div>
            {!revealed ? (
              <div className="space-y-2">
                <p className="text-lg leading-relaxed text-stone-800">絵札を見て、読み札を思い出す</p>
                <p className="text-sm text-amber-700">タップして答えを表示</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-2xl leading-relaxed">{card.verse}</p>
                <p className="text-sm text-stone-500">{card.topic}</p>
              </div>
            )}
          </div>
        </div>

        {revealed && (
          <div className="mt-5 grid gap-4 border-t border-stone-200 pt-5 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="mx-auto w-full max-w-40">
              <YomifudaImage card={card} />
            </div>
            <p className="text-sm leading-relaxed text-stone-600">
              読み札画像とテキストを見比べて、文字のまとまりと絵札の印象を一緒に覚える。
            </p>
          </div>
        )}
      </div>

      <div className={`mt-6 flex gap-4 transition-opacity duration-300 ${revealed ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button type="button" onClick={onExit} className="flex-1 border border-stone-300 bg-white py-3 text-sm">やめる</button>
        <button type="button" onClick={onNext} className="flex-1 bg-stone-900 py-3 text-stone-50">次のカード →</button>
      </div>
    </div>
  );
}

function DailyCompleteView({ streak, totalDays, onRestart, onHome, onQuiz }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="mb-8 text-2xl">今日の10枚</h2>
      <div className="mb-6 border border-stone-300 bg-white p-10">
        <div className="mb-4 text-xl">今日の分、完走！</div>
        <div className="mb-2 text-6xl font-bold text-red-700">
          {streak}<span className="text-2xl">日連続</span>
        </div>
        <p className="mt-4 text-sm text-stone-600">これまでに完走した日数：{totalDays}日</p>
        <p className="mt-2 text-xs text-stone-500">明日になると、新しい10枚が選ばれます。</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={onHome} className="border border-stone-300 bg-white py-3 text-sm">一覧に戻る</button>
        <button type="button" onClick={onRestart} className="border border-stone-300 bg-white py-3 text-sm">もう一周</button>
        <button type="button" onClick={onQuiz} className="bg-red-700 py-3 text-sm text-stone-50">クイズに挑戦</button>
      </div>
    </div>
  );
}

function QuizSelect({ difficulty, setDifficulty, quizMode, setQuizMode, onStart }) {
  return (
    <div className="mx-auto max-w-xl">
      <h2 className="mb-8 text-center text-2xl">クイズ設定</h2>
      <section className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-stone-600">出題モード</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(QUIZ_MODES).map(([key, { label, desc }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setQuizMode(key)}
              aria-pressed={quizMode === key}
              className={`border p-4 text-left ${
                quizMode === key ? 'border-stone-900 bg-stone-900 text-stone-50' : 'border-stone-300 bg-white hover:border-stone-500'
              }`}
            >
              <div className="font-bold">{label}</div>
              <div className="mt-1 text-sm opacity-75">{desc}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-stone-600">選択肢の数</h3>
      <div className="mb-8 flex flex-col gap-4">
        {Object.entries(DIFFICULTY).map(([key, { label, desc }]) => (
          <button
            key={key}
            type="button"
            onClick={() => setDifficulty(key)}
            aria-pressed={difficulty === key}
            className={`border p-4 text-left ${
              difficulty === key ? 'border-stone-900 bg-stone-900 text-stone-50' : 'border-stone-300 bg-white hover:border-stone-500'
            }`}
          >
            <div className="font-bold">{label}</div>
            <div className="text-sm opacity-70">{desc}</div>
          </button>
        ))}
      </div>
      </section>
      <button type="button" onClick={() => onStart(difficulty)} className="w-full bg-red-700 py-3 text-lg text-stone-50">
        {QUIZ_LENGTH}問スタート
      </button>
    </div>
  );
}

function QuizView({ card, choices, result, score, combo, maxCombo, quizLength, quizMode, onAnswer, onNext, onExit, onFinish }) {
  const isFinished = score.total >= quizLength && result !== null;
  const isImageMode = quizMode === 'imageToVerse';
  const cols = isImageMode ? 'grid-cols-1 sm:grid-cols-2' : choices.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';
  const correctLabel = isImageMode ? card.verse : `「${card.kana}」`;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <button type="button" onClick={onExit} className="text-stone-600 hover:text-stone-900">← やめる</button>
        <div className="flex gap-4 text-stone-600">
          {combo >= 3 && <span className="font-bold text-amber-600">{combo}連続</span>}
          <span>{score.total} / {quizLength}問</span>
          <span className="text-emerald-700">{score.correct}正解</span>
        </div>
      </div>

      <div className="mb-6 h-1.5 w-full bg-stone-200">
        <div className="h-1.5 bg-red-700 transition-all" style={{ width: `${(score.total / quizLength) * 100}%` }} />
      </div>

      <div className="mb-6 border border-stone-300 bg-white p-8">
        <p className="mb-4 text-sm text-stone-500">
          {isImageMode ? '絵札に合う読み札はどれ？' : '読み札の頭文字はどれ？'}
        </p>
        {isImageMode ? (
          <div className="mx-auto max-w-72">
            <KarutaImage card={card} />
          </div>
        ) : (
          <p className="text-xl leading-relaxed">{card.verse}</p>
        )}
      </div>

      <div className={`grid ${cols} gap-4`}>
        {choices.map((choice) => (
          <button
            key={choice.kana}
            type="button"
            onClick={() => result === null && onAnswer(choice.kana)}
            disabled={result !== null}
            className={`border py-6 transition-all ${isImageMode ? 'px-4 text-left text-base leading-relaxed' : 'text-4xl'} ${
              result === null
                ? 'border-stone-300 bg-white hover:border-red-700 hover:shadow'
                : choice.kana === card.kana
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  : 'border-stone-200 bg-white opacity-40'
            }`}
          >
            {isImageMode ? choice.verse : choice.kana}
          </button>
        ))}
      </div>

      {result !== null && (
        <div className="mt-6 text-center">
          {combo >= 5 && <p className="mb-1 text-lg text-amber-500">{combo}連続コンボ</p>}
          {combo === 3 && <p className="mb-1 text-lg text-amber-500">3連続</p>}
          <div aria-live="polite">
            <p className={`mb-2 text-xl ${result ? 'text-emerald-700' : 'text-red-700'}`}>
              {result ? '正解！' : `不正解　正解は${correctLabel}`}
            </p>
            <p className="mb-4 text-sm text-stone-500">{card.verse}（{card.topic}）</p>
          </div>
          {isFinished ? (
            <button type="button" onClick={onFinish} className="bg-red-700 px-8 py-2 text-stone-50">結果を見る</button>
          ) : (
            <button type="button" onClick={onNext} className="bg-stone-900 px-8 py-2 text-stone-50">次の問題</button>
          )}
        </div>
      )}
    </div>
  );
}

function QuizResult({ score, maxCombo, mistakes, onRetry, onHome, onReview }) {
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const reviewCards = Array.from(new Map(mistakes.map((mistake) => [mistake.card.kana, mistake.card])).values());
  const grade =
    pct === 100 ? '満点！' :
    pct >= 80 ? 'すばらしい！' :
    pct >= 60 ? 'よくできました' :
    pct >= 40 ? 'もう少し' : 'もっと練習しよう';

  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="mb-8 text-2xl">クイズ結果</h2>
      <div className="mb-6 border border-stone-300 bg-white p-10">
        <div className="mb-2 text-6xl font-bold text-red-700">{pct}<span className="text-3xl">%</span></div>
        <div className="mb-6 text-xl">{grade}</div>
        <div className="flex justify-center gap-8 text-sm text-stone-600">
          <div><div className="text-2xl font-bold text-stone-900">{score.correct}</div>正解</div>
          <div><div className="text-2xl font-bold text-stone-900">{score.total - score.correct}</div>不正解</div>
          <div><div className="text-2xl font-bold text-amber-600">{maxCombo}</div>最大コンボ</div>
        </div>
      </div>
      <section className="mb-6 border border-stone-300 bg-white p-5 text-left">
        <h3 className="mb-3 text-sm font-bold text-stone-700">復習する札</h3>
        {reviewCards.length === 0 ? (
          <p className="text-sm text-stone-600">間違えた札はありません。次は別モードでも確認できます。</p>
        ) : (
          <div className="grid gap-2">
            <p className="mb-1 text-xs text-stone-500">間違えた札は、このブラウザの復習リストに保存されています。</p>
            {reviewCards.map((card) => (
              <button
                key={card.kana}
                type="button"
                onClick={() => onReview(card)}
                className="flex items-center justify-between border border-stone-200 bg-stone-50 px-3 py-2 text-left text-sm hover:border-red-700"
              >
                <span>
                  <span className="mr-3 text-xl text-red-700">{card.kana}</span>
                  {card.verse}
                </span>
                <span className="text-xs text-stone-500">詳細</span>
              </button>
            ))}
          </div>
        )}
      </section>
      <div className="flex gap-4">
        <button type="button" onClick={onHome} className="flex-1 border border-stone-300 bg-white py-3">一覧に戻る</button>
        <button type="button" onClick={onRetry} className="flex-1 bg-red-700 py-3 text-stone-50">もう一度</button>
      </div>
    </div>
  );
}

function ReviewView({ cards, onSelect, onRemove }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl">復習リスト</h2>
        <p className="mt-2 text-sm text-stone-600">クイズで間違えた札を、このブラウザ内だけで保存しています。</p>
      </div>

      {cards.length === 0 ? (
        <section className="border border-stone-300 bg-white p-6 text-sm text-stone-600">
          まだ復習する札はありません。クイズに挑戦すると、間違えた札がここに追加されます。
        </section>
      ) : (
        <section className="border border-stone-300 bg-white p-5">
          <div className="mb-4 flex items-center justify-between text-sm text-stone-600">
            <span>{cards.length}枚</span>
            <span>端末内保存</span>
          </div>
          <div className="grid gap-2">
            {cards.map((card) => (
              <div key={card.kana} className="flex items-center gap-2 border border-stone-200 bg-stone-50 p-2">
                <button
                  type="button"
                  onClick={() => onSelect(card)}
                  className="flex min-w-0 flex-1 items-center gap-3 px-2 py-1 text-left hover:text-red-800"
                >
                  <span className="text-2xl text-red-700">{card.kana}</span>
                  <span className="truncate text-sm">{card.verse}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(card)}
                  className="shrink-0 border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 hover:border-red-700 hover:text-red-800"
                >
                  外す
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
