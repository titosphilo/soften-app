import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set the env var before importing the module
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key-for-testing');

const { sendMessage, screenMessage } = await import('./api');

function geminiResponse(text) {
  return {
    candidates: [{ content: { parts: [{ text }] } }],
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('sendMessage', () => {
  it('returns the assistant text on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(geminiResponse('Hello there')),
    }));

    const result = await sendMessage(
      [{ role: 'user', content: 'Hi' }],
      'You are helpful.'
    );
    expect(result).toBe('Hello there');
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    }));

    await expect(
      sendMessage([{ role: 'user', content: 'Hi' }], 'system')
    ).rejects.toThrow('API error 401');
  });

  it('throws on unexpected response shape', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ candidates: [] }),
    }));

    await expect(
      sendMessage([{ role: 'user', content: 'Hi' }], 'system')
    ).rejects.toThrow('Unexpected API response shape');
  });

  it('supports abort signal', async () => {
    const controller = new AbortController();
    controller.abort();

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError')));

    await expect(
      sendMessage([{ role: 'user', content: 'Hi' }], 'system', { signal: controller.signal })
    ).rejects.toThrow();
  });

  it('maps assistant role to "model" for Gemini', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(geminiResponse('ok')),
    });
    vi.stubGlobal('fetch', fetchMock);

    await sendMessage(
      [
        { role: 'user', content: 'first' },
        { role: 'assistant', content: 'reply' },
        { role: 'user', content: 'second' },
      ],
      'system'
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.contents.map((c) => c.role)).toEqual(['user', 'model', 'user']);
    expect(body.system_instruction.parts[0].text).toBe('system');
  });
});

describe('screenMessage', () => {
  it('returns parsed level on valid response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(geminiResponse('{"level": 2}')),
    }));

    const result = await screenMessage('test message');
    expect(result).toEqual({ level: 2 });
  });

  it('throws on non-ok response (fail closed)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Server error'),
    }));

    await expect(screenMessage('test')).rejects.toThrow('Screening API error 500');
  });

  it('throws on invalid JSON from model', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(geminiResponse('not json')),
    }));

    await expect(screenMessage('test')).rejects.toThrow('Failed to parse screening response');
  });

  it('throws on out-of-range level', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(geminiResponse('{"level": 99}')),
    }));

    await expect(screenMessage('test')).rejects.toThrow('Invalid screening level');
  });

  it('coerces string level to number', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(geminiResponse('{"level": "3"}')),
    }));

    const result = await screenMessage('test');
    expect(result).toEqual({ level: 3 });
    expect(typeof result.level).toBe('number');
  });

  it('throws on empty candidates array', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ candidates: [] }),
    }));

    await expect(screenMessage('test')).rejects.toThrow('Unexpected screening response shape');
  });
});
