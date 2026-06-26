import { useState } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    const detail = errBody?.error?.message ?? response.statusText;
    throw new Error(`APIエラー ${response.status}: ${detail}`);
  }

  const data = (await response.json()) as GeminiResponse;
  return data.candidates[0].content.parts[0].text;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async (dateJP: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `今日の日付：${dateJP}
以下の3つの問いを生成してください。
・自分を大切にすることに関する問い
・今日の気づきに関する問い
・自分の強みや喜びに関する問い
やさしい日本語で、自愛、慈愛、勇気、喜び、わくわくを引き出す問いにしてください。
番号や記号なしで、1行ずつ3つの問いだけを返してください。`;

      const text = await callGemini(prompt);
      return text
        .split('\n')
        .map((q) => q.trim())
        .filter((q) => q.length > 0)
        .slice(0, 3);
    } catch (e) {
      setError(e instanceof Error ? e.message : '問いの生成に失敗しました');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateFeedback = async (answer: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `ユーザーの回答：${answer}
この回答を受けて、さらに内側を深掘りするような
温かいフィードバックと追加の問いを返してください。
200文字以内でやさしく。`;
      return await callGemini(prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'フィードバックの生成に失敗しました');
      return '';
    } finally {
      setLoading(false);
    }
  };

  const generatePhrase = async (summary: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `ユーザーの、自愛、慈愛、勇気、喜び、わくわく内容：${summary}
これを己書で書きたくなるような
10文字以内の美しい日本語フレーズに変換してください。
例：「今ここに在る」「光は内にあり」
1フレーズだけ返してください。`;
      return await callGemini(prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'フレーズの生成に失敗しました');
      return '';
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlySummary = async (monthData: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `今月の記録：${monthData}
この1ヶ月の自愛・慈愛・勇気・喜び・わくわくをふりかえり、
その人の成長や気づきを温かくまとめてください。
300文字以内で。`;
      return await callGemini(prompt);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'まとめの生成に失敗しました');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, generateQuestions, generateFeedback, generatePhrase, generateMonthlySummary };
}
