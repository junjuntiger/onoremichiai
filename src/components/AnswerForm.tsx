import { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { useSpeech } from '../hooks/useSpeech';
import { getEntry, saveEntry, formatDateJP, toDateString } from '../utils/storage';

interface AnswerFormProps {
  questionIndex: number;
  questions: string[];
  onBack: () => void;
  onPhraseReady: (phrase: string) => void;
}

type Step = 'input' | 'feedback';

const QUESTION_COLORS = [
  { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-600', icon: '✦' },
  { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-600', icon: '✧' },
  { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-600', icon: '◇' },
];

export function AnswerForm({ questionIndex, questions, onBack, onPhraseReady }: AnswerFormProps) {
  const question = questions[questionIndex];
  const color = QUESTION_COLORS[questionIndex % QUESTION_COLORS.length];

  const today = new Date();
  const dateStr = toDateString(today);

  // 回答済みならAPIを呼ばず過去データを復元
  const savedAnswer = getEntry(dateStr)?.answers?.[questionIndex];
  const [answer, setAnswer] = useState(savedAnswer?.answer ?? '');
  const [feedback, setFeedback] = useState(savedAnswer?.feedback ?? '');
  const [step, setStep] = useState<Step>(savedAnswer?.feedback ? 'feedback' : 'input');
  const [generatingPhrase, setGeneratingPhrase] = useState(false);

  const { loading, error, generateFeedback, generatePhrase } = useAI();

  const { listening, supported, startListening, stopListening } = useSpeech((text) => {
    setAnswer((prev) => prev + text);
  });

  const dateJP = formatDateJP(today);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    const fb = await generateFeedback(answer);
    if (!fb) return;
    setFeedback(fb);
    setStep('feedback');

    const entry = getEntry(dateStr) ?? {
      date: dateStr,
      questions,
      answers: [],
      phrase: '',
    };
    const answers = [...entry.answers];
    answers[questionIndex] = { question, answer, feedback: fb };
    saveEntry({ ...entry, answers });
  };

  const handleGeneratePhrase = async () => {
    setGeneratingPhrase(true);
    const allAnswers = getEntry(dateStr)?.answers ?? [];
    const summary = allAnswers.filter((a) => a?.answer).map((a) => a.answer).join('。') || answer;
    const phrase = await generatePhrase(summary);
    if (phrase) {
      const entry = getEntry(dateStr);
      if (entry) saveEntry({ ...entry, phrase });
      onPhraseReady(phrase);
    }
    setGeneratingPhrase(false);
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#fdf8f0]">
      {/* Header */}
      <header className="relative pt-8 pb-5 px-5">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e8d5c4] to-transparent" />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-[#8b6b6b] hover:text-[#7c3f58] transition-colors text-sm flex items-center gap-1"
          >
            ‹ もどる
          </button>
          <span className="text-[#e8d5c4]">|</span>
          <p className="text-sm text-[#8b6b6b] tracking-wider">{dateJP}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${color.badge}`}>
            問い {questionIndex + 1} / {questions.length}
          </span>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-8 space-y-5">
        {/* Question card */}
        <div className={`rounded-2xl border ${color.bg} ${color.border} p-5`}>
          <div className="flex items-start gap-3">
            <span className="text-[#d4956a] text-xl mt-0.5">{color.icon}</span>
            <p
              className="text-[#2d1f1f] text-base leading-relaxed flex-1"
              style={{ fontFamily: '"Noto Serif JP", serif' }}
            >
              {question}
            </p>
          </div>
        </div>

        {step === 'input' && (
          <>
            {/* Text area */}
            <div className="space-y-2">
              <label
                className="text-xs text-[#8b6b6b] tracking-wider"
                style={{ fontFamily: '"Noto Serif JP", serif' }}
              >
                こころの声を聴かせてください
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="思いのままに書いてみてください..."
                rows={6}
                className="w-full rounded-2xl border border-[#e8d5c4] bg-white/70 px-4 py-3 text-[#2d1f1f] text-base leading-relaxed resize-none focus:outline-none focus:border-[#7c3f58] focus:ring-1 focus:ring-[#7c3f58] transition-colors placeholder:text-[#c4b0a8]"
                style={{ fontFamily: '"Noto Serif JP", serif' }}
              />
            </div>

            {/* Voice input */}
            {supported && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all ${
                    listening
                      ? 'bg-[#7c3f58] border-[#7c3f58] text-white animate-pulse'
                      : 'bg-white border-[#e8d5c4] text-[#8b6b6b] hover:border-[#7c3f58] hover:text-[#7c3f58]'
                  }`}
                >
                  <span className="text-base">{listening ? '⏹' : '🎙'}</span>
                  {listening ? '録音中... タップで停止' : '音声で話す'}
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-center text-sm text-rose-500">{error}</p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!answer.trim() || loading}
              className="w-full py-4 rounded-2xl bg-[#7c3f58] text-white text-base tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#a45f7a] transition-colors"
              style={{ fontFamily: '"Noto Serif JP", serif' }}
            >
              {loading ? '深掘り中...' : 'AIに届ける ✦'}
            </button>
          </>
        )}

        {step === 'feedback' && (
          <>
            {/* Answer recap */}
            <div className="rounded-2xl bg-white/60 border border-[#e8d5c4] p-4">
              <p className="text-xs text-[#8b6b6b] mb-2 tracking-wider">あなたの答え</p>
              <p
                className="text-[#2d1f1f] text-sm leading-relaxed"
                style={{ fontFamily: '"Noto Serif JP", serif' }}
              >
                {answer}
              </p>
            </div>

            {/* AI Feedback */}
            <div className="rounded-2xl bg-gradient-to-br from-[#f5ece0] to-[#fdf8f0] border border-[#e8d5c4] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#d4956a]">✦</span>
                <p className="text-xs text-[#8b6b6b] tracking-wider">AIからのひとこと</p>
              </div>
              <p
                className="text-[#2d1f1f] text-sm leading-relaxed"
                style={{ fontFamily: '"Noto Serif JP", serif' }}
              >
                {feedback}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGeneratePhrase}
                disabled={generatingPhrase}
                className="w-full py-4 rounded-2xl bg-[#7c3f58] text-white text-base tracking-wider disabled:opacity-40 hover:bg-[#a45f7a] transition-colors"
                style={{ fontFamily: '"Noto Serif JP", serif' }}
              >
                {generatingPhrase ? '言葉を紡いでいます...' : '己書フレーズを作る ◇'}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 rounded-2xl border border-[#e8d5c4] text-[#8b6b6b] text-sm tracking-wider hover:border-[#7c3f58] hover:text-[#7c3f58] transition-colors"
              >
                問いの一覧にもどる
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
