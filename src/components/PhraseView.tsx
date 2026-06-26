interface PhraseViewProps {
  phrase: string;
  onBack: () => void;
}

export function PhraseView({ phrase, onBack }: PhraseViewProps) {
  return (
    <div className="flex flex-col min-h-svh bg-[#2d1f1f] items-center justify-center px-8">
      {/* Decorative top */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-px bg-[#d4956a]/40" />
        <span className="text-[#d4956a] text-xs tracking-widest">己書フレーズ</span>
        <div className="w-12 h-px bg-[#d4956a]/40" />
      </div>

      {/* Phrase */}
      <div className="text-center space-y-6">
        <p className="text-[#d4956a] text-sm tracking-[0.3em]">✦</p>
        <p
          className="text-[#fdf8f0] text-4xl leading-relaxed tracking-[0.2em]"
          style={{ fontFamily: '"Yuji Syuku", serif' }}
        >
          {phrase}
        </p>
        <p className="text-[#d4956a] text-sm tracking-[0.3em]">✦</p>
      </div>

      {/* Subtitle */}
      <p
        className="mt-10 text-[#8b6b6b] text-xs tracking-widest"
        style={{ fontFamily: '"Noto Serif JP", serif' }}
      >
        この言葉を己書で書いてみよう
      </p>

      {/* Decorative bottom */}
      <div className="mt-16 space-y-4 w-full max-w-xs">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-2xl border border-[#8b6b6b]/40 text-[#8b6b6b] text-sm tracking-wider hover:border-[#d4956a] hover:text-[#d4956a] transition-colors"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          問いの一覧にもどる
        </button>
      </div>
    </div>
  );
}
