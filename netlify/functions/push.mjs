/* /api/push — the app saves its push subscription and its ticked tasks here.
   POST {subscription?, endpoint?, done?, test?}  save / update, optionally send a test alert
   DELETE {endpoint}                              turn alerts off for that phone */
import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
import { createHash } from 'node:crypto';

const idFor = endpoint => createHash('sha256').update(endpoint).digest('hex').slice(0, 40);
const json = (body, status = 200) => Response.json(body, { status });

export default async (req) => {
  let body;
  try { body = await req.json(); } catch { return json({ error: 'JSON body එකක් ඕන.' }, 400); }

  const endpoint = body.subscription?.endpoint || body.endpoint;
  if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
    return json({ error: 'Push subscription එක හරි නෑ.' }, 400);
  }
  const id = idFor(endpoint);
  const store = getStore({ name: 'push', consistency: 'strong' });
  const key = `subs/${id}`;

  if (req.method === 'DELETE') {
    await store.delete(key);
    await store.delete(`sent/${id}`);
    return json({ ok: true, removed: true });
  }

  const existing = (await store.get(key, { type: 'json' })) || {};
  const sub = body.subscription || existing.sub;
  if (!sub || !sub.keys) return json({ error: 'මේ phone එකට alerts on කරලා නෑ.' }, 404);
  const done = Array.isArray(body.done) ? body.done.filter(x => typeof x === 'string').slice(0, 2000) : (existing.done || []);
  await store.setJSON(key, { sub, done, updated: Date.now() });

  if (body.test) {
    webpush.setVapidDetails(
      Netlify.env.get('VAPID_SUBJECT') || 'mailto:teamhexoramain@gmail.com',
      Netlify.env.get('VAPID_PUBLIC_KEY'),
      Netlify.env.get('VAPID_PRIVATE_KEY'),
    );
    try {
      await webpush.sendNotification(sub, JSON.stringify({
        title: 'Nima Schedule alerts on ✓',
        body: 'හැම වැඩකටම විනාඩි 10කට කලින් මෙහෙම alert එකක් එනවා.',
        tag: 'nima-test',
        url: '/',
      }), { TTL: 300, urgency: 'high' });
    } catch (err) {
      return json({ ok: true, id, testSent: false, error: `Test alert එක යැව්වේ නෑ (${err?.statusCode || 'error'}).` }, 502);
    }
    return json({ ok: true, id, testSent: true });
  }
  return json({ ok: true, id });
};

export const config = { path: '/api/push', method: ['POST', 'DELETE'] };
