const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export async function sendMessage(messages, system) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function screenMessage(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 100,
      system: SCREENER_SYSTEM,
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!response.ok) {
    return { level: 0 };
  }

  const data = await response.json();
  try {
    return JSON.parse(data.content[0].text);
  } catch {
    return { level: 0 };
  }
}

const SCREENER_SYSTEM = `You are a message screener for a couples therapy app. Evaluate the message and respond ONLY with a JSON object containing a "level" number.

Screening criteria — focus on CONTEMPT, not passion. Strong language alone is NOT abuse. Culturally intelligent screening understands that some people express strong emotions with strong words.

Level 0: Safe message. No issues detected. Most messages fall here, including passionate or emotionally intense language.
Level 1: Harsh language that could wound — sarcasm, dismissiveness, eye-rolling tone. Not contempt yet, but could escalate.
Level 2: Contempt — superiority, mockery, character assassination, dehumanising language. "You always...", "You never...", "You're pathetic", "What kind of person..."
Level 3: Abuse — sustained personal attack, coercive control language, intimidation, threats to the relationship used as weapons.
Level 4: Threats — explicit or implicit threats of physical harm, self-harm threats used manipulatively, stalking language.

Respond ONLY with JSON, e.g.: {"level": 0}`;
