// Centralised data loaders. Astro inlines these JSON files at build time
// — every page is generated statically from these files.
import careersJson from '../data/careers.json';
import examsJson from '../data/exams.json';
import topPayingJson from '../data/top-paying.json';
import scholarshipsJson from '../data/scholarships.json';
import collegesJson from '../data/colleges.json';
import streamsJson from '../data/streams.json';
import familiesJson from '../data/career-families.json';
import sourcesJson from '../data/sources.json';

export const careers = careersJson.careers;
export const exams = examsJson.exams;
export const topPaying = topPayingJson.rankings;
export const topPayingContext = topPayingJson.context;
export const scholarships = scholarshipsJson.scholarships;
export const colleges = collegesJson.colleges;
export const streams = streamsJson.streams;
export const families = familiesJson.families;
export const sources = sourcesJson.sources;

export const counts = {
  careers: careers.length,
  exams: exams.length,
  topPaying: topPaying.length,
  scholarships: scholarships.length,
  colleges: colleges.length,
  streams: streams.length,
  families: families.length,
};

export type Family = (typeof families)[number];
export type Career = (typeof careers)[number];
export type Exam = (typeof exams)[number];
export type Scholarship = (typeof scholarships)[number];
export type College = (typeof colleges)[number];
export type Stream = (typeof streams)[number];

export function familyById(id: string): Family | undefined {
  return families.find((f) => f.id === id);
}

export function careerById(id: string): Career | undefined {
  return careers.find((c) => c.id === id);
}

export function examById(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}

export function scholarshipById(id: string): Scholarship | undefined {
  return scholarships.find((s) => s.id === id);
}

export function streamById(id: string): Stream | undefined {
  return streams.find((s) => s.id === id);
}

export function collegeById(id: string): College | undefined {
  return colleges.find((c) => c.id === id);
}

export function careersByFamily(familyId: string): Career[] {
  return careers.filter((c) => c.family === familyId);
}

export function examsByFamily(familyId: string): Exam[] {
  return exams.filter((e) => e.family === familyId);
}
