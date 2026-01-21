// src/lib/activityStore.ts

const KEY = "csignes_activity_days_v1"; // array de dates "YYYY-MM-DD"

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function markActivityToday() {
  const t = todayKey();
  const days = getActivityDays();
  if (!days.includes(t)) {
    days.push(t);
    days.sort(); // simple
    localStorage.setItem(KEY, JSON.stringify(days));
  }
}

export function getActivityDays(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function startOfWeekLocal(d = new Date()) {
  // semaine L->D en local
  const x = new Date(d);
  const day = x.getDay(); // 0 dim .. 6 sam
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getWeekRangeKeys(d = new Date()) {
  const start = startOfWeekLocal(d);
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    keys.push(cur.toISOString().slice(0, 10));
  }
  return keys;
}

export function didActivityOn(dateKey: string) {
  return getActivityDays().includes(dateKey);
}

export function didActivityToday() {
  return didActivityOn(todayKey());
}

export function getActiveDaysThisWeek() {
  const week = getWeekRangeKeys();
  const set = new Set(getActivityDays());
  return week.filter((k) => set.has(k)).length;
}

export function getStreakDays() {
  // streak = nb de jours consécutifs jusqu’à aujourd’hui inclus
  const set = new Set(getActivityDays());
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function buildHistoryWeek() {
  const labels = ["L", "M", "M", "J", "V", "S", "D"];
  const week = getWeekRangeKeys();
  const today = new Date().toISOString().slice(0, 10);

  const days = week.map((date, idx) => ({
    date,
    label: labels[idx],
    didActivity: didActivityOn(date),
    isToday: date === today,
  }));

  const activeDaysCount = days.filter((d) => d.didActivity).length;
  const streakDays = getStreakDays();

  // “progression globale” : si tu veux juste un truc simple
  // => 0..100 basé sur XP (si tu veux le brancher plus tard)
  const globalProgressPct = 0;

  return { days, activeDaysCount, streakDays, globalProgressPct };
}
