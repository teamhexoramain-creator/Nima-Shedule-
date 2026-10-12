/* Runs every minute (UTC cron). Sends a push alert 10 minutes before each task
   to every phone that turned alerts on, skipping tasks already ticked off. */
import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
import { dueTasks, payloadFor } from '../lib/reminders.mjs';
import { getVapid, subject } from '../lib/vapid.mjs';

export default async () => {
  const due = dueTasks(Date.now());
  if (!due.length) return;

  const store = getStore({ name: 'push', consistency: 'strong' });
  const v = await getVapid(store);
  webpush.setVapidDetails(subject(), v.publicKey, v.privateKey);
  const { blobs } = await store.list({ prefix: 'subs/' });

  for (const { key } of blobs) {
    const id = key.slice('subs/'.length);
    const rec = await store.get(key, { type: 'json' });
    if (!rec || !rec.sub) continue;
    const done = new Set(rec.done || []);
    const sent = (await store.get(`sent/${id}`, { type: 'json' })) || [];
    const sentSet = new Set(sent);
    let changed = false;

    for (const item of due) {
      const tid = item.task.id;
      if (done.has(tid) || sentSet.has(tid)) continue;
      try {
        await webpush.sendNotification(rec.sub, JSON.stringify(payloadFor(item)), { TTL: 600, urgency: 'high' });
        sentSet.add(tid);
        changed = true;
      } catch (err) {
        if (err && (err.statusCode === 404 || err.statusCode === 410)) {
          // the phone unsubscribed or reinstalled: forget it
          await store.delete(key);
          await store.delete(`sent/${id}`);
          changed = false;
          break;
        }
        console.error('push failed', id, err && err.statusCode, err && err.body);
      }
    }
    if (changed) await store.setJSON(`sent/${id}`, [...sentSet].slice(-400));
  }
};

export const config = {
  schedule: '* * * * *', // every minute, UTC; the window logic handles Sri Lanka time
};
