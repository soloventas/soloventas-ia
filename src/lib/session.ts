// Firma y verificación de la cookie de sesión con Web Crypto (SubtleCrypto),
// para que funcione tanto en rutas normales como en el middleware (Edge runtime).

const COOKIE_NAME = "sv_session";
const SESSION_DAYS = 7;

type SessionPayload = { userId: string; email: string; exp: number };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "Falta SESSION_SECRET en el archivo .env — generá una clave y agregala."
    );
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function sign(data: string): Promise<string> {
  const key = await getKey();
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(
  userId: string,
  email: string
): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload: SessionPayload = { userId, email, exp };
  const data = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const signature = await sign(data);
  return `${data}.${signature}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = await sign(data);
  if (expected.length !== signature.length || expected !== signature) {
    return null;
  }

  try {
    const json = new TextDecoder().decode(fromBase64Url(data));
    const payload: SessionPayload = JSON.parse(json);
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;
