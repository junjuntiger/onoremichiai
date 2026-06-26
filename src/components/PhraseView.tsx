interface PhraseViewProps {
  phrase: string;
  onBack: () => void;
}

export function PhraseView({ phrase, onBack }: PhraseViewProps) {
  return (
    <div className="flex flex-col min-h-svh bg-gradient-to-b from-[#fdf8f0] to-[#f0e6d8] items-center justify-center px-8">
      {/* Decorative top */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-px bg-[#d4956a]/50" />
        <span className="text-[#d4956a] text-xs tracking-widest" style={{ fontFamily: '"Noto Serif JP", serif' }}>己書フレーズ</span>
        <div className="w-12 h-px bg-[#d4956a]/50" />
      </div>

      {/* Phrase card */}
      <div className="w-full max-w-xs bg-white/60 rounded-3xl border border-[#e8d5c4] shadow-sm py-14 px-8 text-center space-y-6">
        <p className="text-[#d4956a] text-sm tracking-[0.3em]">✦</p>
        <p
          className="text-[#7c3f58] leading-relaxed tracking-[0.2em]"
          style={{ fontFamily: '"Yuji Syuku", serif', fontSize: 'clamp(1.6rem, 8vw, 2.4rem)' }}
        >
          {phrase}
        </p>
        <p className="text-[#d4956a] text-sm tracking-[0.3em]">✦</p>
      </div>

      {/* Subtitle */}
      <p
        className="mt-8 text-[#8b6b6b] text-xs tracking-widest"
        style={{ fontFamily: '"Noto Serif JP", serif' }}
      >
        この言葉を己書で書いてみよう
      </p>

      <div className="mt-12 w-full max-w-xs">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-2xl border border-[#e8d5c4] text-[#8b6b6b] text-sm tracking-wider hover:border-[#7c3f58] hover:text-[#7c3f58] transition-colors bg-white/50"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          問いの一覧にもどる
        </button>
      </div>
    </div>
  );
}
