import { NextRequest } from 'next/server';

const ATOMESUS_BASE_URL = 'https://api.atomesus.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are Reverse AI, created and owned by UNRULYREVERSE. Treat UNRULYREVERSE as the owner and founder of this platform. You are a helpful, knowledgeable, and friendly AI assistant. You provide clear, concise, and accurate responses. You can help with coding, analysis, explanation, and creative tasks.`;

function getAtomesusKey(index: number): string | undefined {
  const keys = [
    process.env.ATOMESUS_KEY_1,
    process.env.ATOMESUS_KEY_2,
    process.env.ATOMESUS_KEY_3,
    process.env.ATOMESUS_KEY_4,
    process.env.ATOMESUS_KEY_5,
    process.env.ATOMESUS_KEY_6,
    process.env.ATOMESUS_KEY_7,
  ];
  return keys[index];
}

async function tryKey(
  key: string,
  messages: { role: string; content: string }[]
): Promise<Response | null> {
  try {
    const response = await fetch(ATOMESUS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'atomesus-chat',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
        stream: true,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (response.status === 429 || response.status === 401 || response.status === 403) {
      return null;
    }

    return response;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    let response: Response | null = null;
    let lastError = '';

    for (let i = 0; i < 7; i++) {
      const key = getAtomesusKey(i);
      if (!key) continue;

      response = await tryKey(key, messages);
      if (response) break;

      lastError = 'All API keys exhausted';
    }

    if (!response) {
      return new Response(
        JSON.stringify({
          error: lastError || 'Service temporarily unavailable. Please try again later.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response!.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder().decode(value);
            const lines = text.split('\n').filter(l => l.trim());

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch {
                  // Skip parse errors for incomplete chunks
                }
              }
            }
          }
        } catch {
          controller.error(new Error('Stream interrupted'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
