import { useState } from 'react';
import { likePhrase, unlikePhrase, isLiked, toDateString } from '../utils/storage';

interface PhraseViewProps {
  phrase: string;
  onBack: () => void;
}

export function PhraseView({ phrase, onBack }: PhraseViewProps) {
  const today = toDateString(new Date());
  const [liked, setLiked] = useState(() => isLiked(phrase, today));
  const [showToast, setShowToast] = useState(false);

  const handleLike = () => {
    if (liked) {
      unlikePhrase(phrase, today);
      setLiked(false);
    } else {
      likePhrase(phrase, today);
      setLiked(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-svh bg-gradient-to-b from-[#fdf8f0] to-[#f0e6d8]">
      {/* Header label */}
      <div className="flex items-center justify-center gap-3 pt-12 pb-8">
        <div className="w-10 h-px bg-[#d4956a]/50" />
        <span
          className="text-[#d4956a] text-xs tracking-[0.3em]"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          己書フレーズ
        </span>
        <div className="w-10 h-px bg-[#d4956a]/50" />
      </div>

      {/* Main area — horizontal scroll-free vertical layout */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="relative flex items-center justify-center">
          {/* Paper card */}
          <div
            className="bg-white/70 rounded-2xl border border-[#e8d5c4] shadow-md flex items-center justify-center"
            style={{ width: '180px', minHeight: '340px', padding: '2rem 1.5rem' }}
          >
            {/* Vertical phrase */}
            <p
              className="text-[#7c3f58]"
              style={{
                fontFamily: '"Yuji Syuku", serif',
                fontSize: '2rem',
                lineHeight: '1.8',
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                letterSpacing: '0.15em',
              }}
            >
              {phrase}
            </p>
          </div>

          {/* Decorative dots */}
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#d4956a] text-xs">✦</span>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[#d4956a] text-xs">✦</span>
        </div>
      </div>

      {/* Like button */}
      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
        >
          <span
            className="text-4xl transition-transform duration-200 group-active:scale-125"
            style={{ filter: liked ? 'none' : 'grayscale(1) opacity(0.4)' }}
          >
            {liked ? '♥' : '♡'}
          </span>
          <span
            className="text-xs tracking-wider"
            style={{
              fontFamily: '"Noto Serif JP", serif',
              color: liked ? '#c06080' : '#b0a0a0',
            }}
          >
            {liked ? 'お気に入り' : 'お気に入りに追加'}
          </span>
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#7c3f58] text-white text-sm px-5 py-2.5 rounded-full shadow-lg">
          フレーズを保存しました ♥
        </div>
      )}

      {/* Footer */}
      <div className="px-8 pt-6 pb-10 space-y-3 text-center">
        <p
          className="text-[#8b6b6b] text-xs tracking-widest"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          この言葉を己書で書いてみよう
        </p>
        <button
          type="button"
          onClick={onBack}
          className="w-full max-w-xs mx-auto block py-3 rounded-2xl border border-[#e8d5c4] text-[#8b6b6b] text-sm tracking-wider hover:border-[#7c3f58] hover:text-[#7c3f58] transition-colors bg-white/50"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          問いの一覧にもどる
        </button>
      </div>
    </div>
  );
}
