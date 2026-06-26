export interface QuestionAnswer {
  question: string;
  answer: string;
  feedback: string;
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  questions: string[];
  answers: QuestionAnswer[];
  phrase: string;
}

export interface LikedPhrase {
  phrase: string;
  date: string; // YYYY-MM-DD
  savedAt: string; // ISO timestamp
}

const STORAGE_KEY = 'onoremichiai_entries';
const LIKED_KEY = 'onoremichiai_liked';

export function getAllEntries(): DailyEntry[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as DailyEntry[]) : [];
}

export function getEntry(date: string): DailyEntry | null {
  return getAllEntries().find((e) => e.date === date) ?? null;
}

export function saveEntry(entry: DailyEntry): void {
  const entries = getAllEntries();
  const index = entries.findIndex((e) => e.date === entry.date);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntriesByMonth(year: number, month: number): DailyEntry[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getAllEntries().filter((e) => e.date.startsWith(prefix));
}

export function getLikedPhrases(): LikedPhrase[] {
  const data = localStorage.getItem(LIKED_KEY);
  return data ? (JSON.parse(data) as LikedPhrase[]) : [];
}

export function likePhrase(phrase: string, date: string): void {
  const liked = getLikedPhrases();
  const already = liked.some((l) => l.phrase === phrase && l.date === date);
  if (already) return;
  liked.unshift({ phrase, date, savedAt: new Date().toISOString() });
  localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
}

export function unlikePhrase(phrase: string, date: string): void {
  const liked = getLikedPhrases().filter(
    (l) => !(l.phrase === phrase && l.date === date)
  );
  localStorage.setItem(LIKED_KEY, JSON.stringify(liked));
}

export function isLiked(phrase: string, date: string): boolean {
  return getLikedPhrases().some((l) => l.phrase === phrase && l.date === date);
}

export function formatDateJP(date: Date): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
