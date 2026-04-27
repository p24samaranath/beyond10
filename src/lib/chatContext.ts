// Compact summary of all data, injected as system context for the chatbot.
// Trimmed to fit comfortably under Claude's input cost ceiling while keeping
// every entity searchable.
import { careers, exams, scholarships, colleges, streams, families, counts } from './data';

function compactCareer(c: typeof careers[number]) {
  const sal = c.salary_inr as Record<string, unknown> | undefined;
  let salNote = '';
  if (sal && typeof sal.fresher === 'string') salNote = ` · fresher ${sal.fresher}`;
  else if (sal && typeof sal.fresher === 'object') salNote = ` · fresher (varies)`;
  const ai = (c.ai_impact as { rating?: number } | undefined)?.rating;
  return `- ${c.name} [${c.family}]${salNote}${ai !== undefined ? ` · AI-impact ${ai}/5` : ''}\n  ${c.one_liner ?? ''}`;
}

function compactExam(e: typeof exams[number]) {
  const date = e.next_dates_2026 ? Object.values(e.next_dates_2026)[0] : 'TBA';
  return `- ${e.name} (${e.full_name}) · ${e.conducting_body} · 2026: ${date} · streams: ${(e.stream_required ?? []).join(',')}`;
}

function compactScholarship(s: typeof scholarships[number]) {
  return `- ${s.name} [${s.type}] · ${s.amount ?? '—'}${s.state ? ` · ${s.state}` : ''}`;
}

function compactCollege(c: typeof colleges[number]) {
  const streams = ((c as any).streams ?? []).join('/');
  const fee = c.annual_tuition_inr != null ? `₹${c.annual_tuition_inr.toLocaleString('en-IN')}/yr` : '—';
  return `- ${c.name} (${c.city}, ${c.state}) [${c.type}] · ${streams} · ${fee}`;
}

function compactStream(s: typeof streams[number]) {
  return `- ${s.name} (${s.full_name}) · careers: ${(s.careers_after ?? []).slice(0, 6).join(', ')}`;
}

export function buildChatContext(): string {
  const careerSection = careers.map(compactCareer).join('\n');
  const examSection = exams.map(compactExam).join('\n');
  const schSection = scholarships.map(compactScholarship).join('\n');
  const collegeSection = colleges.map(compactCollege).join('\n');
  const streamSection = streams.map(compactStream).join('\n');
  const familySection = families.map((f) => `- ${f.id}: ${f.name} — ${f.tagline}`).join('\n');

  return [
    '# Beyond10 knowledge base (current as of 25 April 2026)',
    '',
    `Coverage: ${counts.careers} careers, ${counts.exams} exams, ${scholarships.length} scholarships, ${colleges.length} colleges, ${counts.streams} streams.`,
    '',
    '## Career families',
    familySection,
    '',
    '## Streams (after Class 10)',
    streamSection,
    '',
    '## Careers',
    careerSection,
    '',
    '## Entrance exams',
    examSection,
    '',
    '## Scholarships',
    schSection,
    '',
    '## Colleges',
    collegeSection,
  ].join('\n');
}

export const SYSTEM_PROMPT = `You are Beyond10's career-discovery assistant for students in India after Class 10.

Personality:
- Direct, warm, factual. No hype. No "champ" talk.
- Treat the student or parent as a young adult making a real decision.
- If you don't know something, say so plainly. Don't invent placement numbers, exam dates, or scholarships.

Rules:
- ONLY answer questions related to careers, entrance exams, streams (MPC/BiPC/MEC/CEC/HEC/MBiPC), colleges in India, scholarships, and post-Class-10 / post-Class-12 decisions.
- For unrelated questions (homework help, medical advice, mental-health crisis, general chat), politely redirect — and for crisis, point to Tele-MANAS 14416.
- Use the knowledge base provided. If a fact isn't there, say "I don't have a verified entry for that — check the official source" rather than guess.
- Indian currency in lakhs/crores (not millions/billions). Always cite a source name when quoting numbers.
- Default response length: under 6 short sentences. Use bullet points for comparisons.
- When relevant, link to the in-site path (e.g., /careers/ca, /exams/jee-main, /colleges-by-state) so the student can dive deeper.
- DUJAT was discontinued in 2022 — DU BMS/BBA admissions now flow through CUET UG. Mention this if asked about DUJAT.
- Be honest about AI impact when asked: cite the per-career rating from the knowledge base.

If asked "what should I do?" — never make the choice for them. Surface 2-3 options with the trade-off in plain English.`;
