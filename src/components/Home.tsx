import { useEffect, useState } from 'react';
import { useAI } from '../hooks/useAI';
import { getEntry, saveEntry, formatDateJP, toDateString } from '../utils/storage';

interface HomeProps {
  onStartAnswer: (questionIndex: number, questions: string[]) => void;
}

const QUESTION_STYLES = [
  {
    gradient: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    icon: '✦',
    iconColor: 'text-rose-400',
    label: '自 愛',
    labelColor: 'text-rose-400',
  },
  {
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    icon: '✧',
    iconColor: 'text-amber-500',
    label: '気 づき',
    labelColor: 'text-amber-500',
  },
  {
    gradient: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    icon: '◇',
    iconColor: 'text-violet-400',
    label: '喜 び',
    labelColor: 'text-violet-400',
  },
] as const;

export function Home({ onStartAnswer }: HomeProps) {
  const today = new Date();
  const dateStr = toDateString(today);
  const dateJP = formatDateJP(today);

  const [questions, setQuestions] = useState<string[]>([]);
  const { loading, error, generateQuestions } = useAI();

  useEffect(() => {
    const existing = getEntry(dateStr);
    if (existing && existing.questions.length > 0) {
      setQuestions(existing.questions);
      return;
    }

    generateQuestions(dateJP).then((qs) => {
      if (qs.length > 0) {
        setQuestions(qs);
        const entry = getEntry(dateStr);
        saveEntry({
          date: dateStr,
          questions: qs,
          answers: entry?.answers ?? [],
          phrase: entry?.phrase ?? '',
        });
      }
    });
  }, [dateStr]);

  const handleRetry = () => {
    generateQuestions(dateJP).then((qs) => {
      if (qs.length > 0) {
        setQuestions(qs);
        const entry = getEntry(dateStr);
        saveEntry({
          date: dateStr,
          questions: qs,
          answers: entry?.answers ?? [],
          phrase: entry?.phrase ?? '',
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#fdf8f0]">
      {/* Header */}
      <header className="relative pt-10 pb-6 px-6 text-center">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e8d5c4] to-transparent" />
        <p
          className="text-3xl tracking-[0.3em] text-[#7c3f58]"
          style={{ fontFamily: '"Yuji Syuku", serif' }}
        >
          おのれみち
        </p>
        <p
          className="text-lg tracking-[0.5em] text-[#d4956a] mt-1"
          style={{ fontFamily: '"Yuji Syuku", serif' }}
        >
          AI ノート
        </p>
        <p className="text-xs text-[#8b6b6b] mt-2 tracking-widest">己道愛ノート</p>
      </header>

      {/* Date */}
      <div className="text-center pt-7 pb-4 px-6">
        <p className="text-sm text-[#8b6b6b] tracking-widest">{dateJP}</p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-[#d4956a] text-sm">✦</span>
          <h2
            className="text-lg text-[#2d1f1f] tracking-[0.25em]"
            style={{ fontFamily: '"Noto Serif JP", serif' }}
          >
            今日の問い
          </h2>
          <span className="text-[#d4956a] text-sm">✦</span>
        </div>
        <p className="text-xs text-[#8b6b6b] mt-2 tracking-wider">
          こころの声に耳をすませて
        </p>
      </div>

      {/* Main content */}
      <main className="flex-1 px-5 pb-8 space-y-4">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-[#e8d5c4]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#7c3f58] animate-spin" />
            </div>
            <p
              className="text-sm text-[#8b6b6b] tracking-wider"
              style={{ fontFamily: '"Noto Serif JP", serif' }}
            >
              問いを紡いでいます...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 text-center">
            <p className="text-rose-600 text-sm">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 text-sm text-[#7c3f58] underline underline-offset-2 tracking-wider"
            >
              もう一度試す
            </button>
          </div>
        )}

        {/* Question cards */}
        {!loading &&
          questions.map((q, i) => {
            const style = QUESTION_STYLES[i % QUESTION_STYLES.length];
            const answered = !!getEntry(dateStr)?.answers[i]?.answer;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onStartAnswer(i, questions)}
                className={`
                  w-full text-left rounded-2xl border bg-gradient-to-br
                  ${style.gradient} ${style.border}
                  p-5 shadow-sm hover:shadow-md
                  transition-all duration-200 active:scale-[0.98]
                  relative overflow-hidden
                `}
              >
                {answered && (
                  <span className="absolute top-3 right-3 text-xs text-[#8b6b6b] bg-white/60 rounded-full px-2 py-0.5">
                    回答済み
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 pt-0.5 min-w-[2rem]">
                    <span className={`text-xl ${style.iconColor}`}>{style.icon}</span>
                    <span
                      className={`text-[10px] ${style.labelColor} tracking-widest`}
                      style={{ fontFamily: '"Noto Serif JP", serif' }}
                    >
                      {style.label}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-[#2d1f1f] text-base leading-relaxed"
                      style={{ fontFamily: '"Noto Serif JP", serif' }}
                    >
                      {q}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs text-[#7c3f58] tracking-wider flex items-center gap-1">
                        {answered ? '見直す' : '答える'}
                        <span className="text-base">›</span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

        {/* Empty state (no questions yet, not loading, no error) */}
        {!loading && !error && questions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[#8b6b6b] text-sm tracking-wider">準備中...</p>
          </div>
        )}
      </main>

      {/* Decorative footer divider */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#e8d5c4]" />
          <span className="text-[#d4956a] text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#e8d5c4]" />
        </div>
        <p
          className="text-center text-xs text-[#8b6b6b] mt-3 tracking-widest"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          今日も、己の道を歩もう
        </p>
      </div>
    </div>
  );
}
