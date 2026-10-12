/* Which tasks need an alert right now, and what the notification says.
   Pure logic with no Netlify or web-push imports, so it can be tested anywhere. */
import { PLAN, SUBJ, KIND, isoAdd, mins } from './plan.mjs';

const OFFSET_MS = 5.5 * 60 * 60 * 1000; // Sri Lanka (UTC+05:30, no daylight saving)
export const LEAD_MIN = 10;              // alert this many minutes before a task starts
const WINDOW_MS = (LEAD_MIN + 0.5) * 60 * 1000;

/** Colombo calendar date for a UTC timestamp. */
export function colomboDate(nowMs) {
  return new Date(nowMs + OFFSET_MS).toISOString().slice(0, 10);
}

/** UTC timestamp when a task starts. */
export function taskStartMs(task) {
  const [y, m, d] = task.date.split('-').map(Number);
  const startMin = mins(task.t, task.ap);
  return Date.UTC(y, m - 1, d, 0, 0) + startMin * 60000 - OFFSET_MS;
}

/** Tasks starting within the next LEAD_MIN minutes (today or early tomorrow). */
export function dueTasks(nowMs) {
  const today = colomboDate(nowMs);
  const days = [today, isoAdd(today, 1)].filter(d => PLAN[d]);
  const out = [];
  for (const d of days) {
    for (const t of PLAN[d].tasks) {
      if (t.k === 'rest' || !t.ap || !t.e) continue;
      const left = taskStartMs(t) - nowMs;
      if (left > 0 && left <= WINDOW_MS) out.push({ task: t, minutesLeft: Math.max(1, Math.round(left / 60000)) });
    }
  }
  return out;
}

const AP = { am: 'පෙ.ව.', pm: 'ප.ව.' };

/** Notification payload for one task. */
export function payloadFor({ task, minutesLeft }) {
  const s = SUBJ[task.s] || { n: '' };
  const kind = KIND[task.k] ? ` · ${KIND[task.k]}` : '';
  return {
    title: `විනාඩි ${minutesLeft}කින් · ${s.n}`,
    body: `${task.t} ${AP[task.ap] || ''} – ${task.ti}${kind}`,
    tag: task.id,
    url: '/',
  };
}
