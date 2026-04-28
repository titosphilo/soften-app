const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.');
}

const HEADERS = {
  'Content-Type': 'application/json',
  'x-goog-api-key': API_KEY,
};

// The screener evaluates harsh/contemptuous content by design, so model-side
// safety filters must not pre-empt it. The app does its own classification.
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
];

function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

export async function sendMessage(messages, system, { signal } = {}) {
  if (!API_KEY) {
    throw new Error('API key is not configured. Create a .env file with VITE_GEMINI_API_KEY.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: toGeminiContents(messages),
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { maxOutputTokens: 1024 },
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Unexpected API response shape');
  }

  return text;
}

export async function screenMessage(text, { signal } = {}) {
  if (!API_KEY) {
    throw new Error('API key is not configured.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SCREENER_SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text }] }],
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        maxOutputTokens: 100,
        responseMimeType: 'application/json',
      },
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Screening API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw new Error('Unexpected screening response shape');
  }

  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    throw new Error('Failed to parse screening response');
  }

  const level = Number(result.level);
  if (!Number.isFinite(level) || level < 0 || level > 4) {
    throw new Error('Invalid screening level');
  }
  return { level };
}

const SCREENER_SYSTEM = `You are a message screener for a couples therapy app. Evaluate the message and respond ONLY with a JSON object containing a "level" number.

Screening criteria — focus on CONTEMPT, not passion. Strong language alone is NOT abuse. Culturally intelligent screening understands that some people express strong emotions with strong words.

Level 0: Safe message. No issues detected. Most messages fall here, including passionate or emotionally intense language.
Level 1: Harsh language that could wound — sarcasm, dismissiveness, eye-rolling tone. Not contempt yet, but could escalate.
Level 2: Contempt — superiority, mockery, character assassination, dehumanising language. "You always...", "You never...", "You're pathetic", "What kind of person..."
Level 3: Abuse — sustained personal attack, coercive control language, intimidation, threats to the relationship used as weapons.
Level 4: Threats — explicit or implicit threats of physical harm, self-harm threats used manipulatively, stalking language.

Respond ONLY with JSON, e.g.: {"level": 0}`;
