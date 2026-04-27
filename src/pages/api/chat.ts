import type { APIRoute } from 'astro';
import { buildChatContext, SYSTEM_PROMPT } from '../../lib/chatContext';

export const prerender = false;

const MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_TOKENS = 800;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'no_api_key',
        message:
          "Beyond10's chatbot is set up but no Claude API key is configured on the server. Add ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables and redeploy.",
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const messages = (body.messages ?? [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12);

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return new Response(JSON.stringify({ error: 'no_user_message' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const system = [
    { type: 'text', text: SYSTEM_PROMPT },
    {
      type: 'text',
      text: buildChatContext(),
      cache_control: { type: 'ephemeral' },
    },
  ];

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages,
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    return new Response(
      JSON.stringify({ error: 'upstream', status: upstream.status, detail: errText.slice(0, 500) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const data = await upstream.json();
  const reply: string =
    Array.isArray(data?.content)
      ? data.content
          .filter((b: any) => b.type === 'text')
          .map((b: any) => b.text)
          .join('')
      : '';

  return new Response(
    JSON.stringify({
      reply,
      usage: data?.usage ?? null,
      model: data?.model ?? MODEL,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, model: MODEL, hint: 'POST { messages: [{role, content}] }' }), {
    headers: { 'Content-Type': 'application/json' },
  });
