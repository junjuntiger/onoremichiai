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

const STORAGE_KEY = 'onoremichiai_entries';

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

export function formatDateJP(date: Date): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekdays[date.getDay()]}）`;
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
