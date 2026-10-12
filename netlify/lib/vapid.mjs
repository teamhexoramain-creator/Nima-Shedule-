/* Push keys (VAPID). Made once on the server and kept in Netlify Blobs, so no
   environment variables are needed. Env vars VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY win if set. */
import { generateKeyPairSync } from 'node:crypto';

const KEY = 'config/vapid';

function makeKeys() {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const j = privateKey.export({ format: 'jwk' });
  const pub = Buffer.concat([Buffer.from([4]), Buffer.from(j.x, 'base64url'), Buffer.from(j.y, 'base64url')]).toString('base64url');
  return { publicKey: pub, privateKey: j.d, created: Date.now() };
}

export async function getVapid(store) {
  const envPub = globalThis.Netlify?.env?.get('VAPID_PUBLIC_KEY');
  const envPriv = globalThis.Netlify?.env?.get('VAPID_PRIVATE_KEY');
  if (envPub && envPriv) return { publicKey: envPub, privateKey: envPriv };

  const saved = await store.get(KEY, { type: 'json' });
  if (saved && saved.publicKey && saved.privateKey) return saved;

  const fresh = makeKeys();
  await store.setJSON(KEY, fresh, { onlyIfNew: true });
  // another request may have saved first: always use what is stored
  return (await store.get(KEY, { type: 'json' })) || fresh;
}

export function subject() {
  return globalThis.Netlify?.env?.get('VAPID_SUBJECT') || 'mailto:teamhexoramain@gmail.com';
}
