import type { BlogFaqItem } from "./types";

export function extractFaq(markdown: string): BlogFaqItem[] {
  const heading = markdown.match(
    /^##\s+(FAQ|Frequently asked questions)\s*$/im
  );
  if (!heading || heading.index === undefined) return [];

  const start = heading.index + heading[0].length;
  const rest = markdown.slice(start);
  const nextHeading = rest.search(/^##\s+/m);
  const section = (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
  return parseFaqQuestions(section);
}

function parseFaqQuestions(section: string): BlogFaqItem[] {
  return section
    .split(/^###\s+/m)
    .slice(1)
    .map(toFaqItem)
    .filter((item): item is BlogFaqItem => item !== null);
}

function toFaqItem(chunk: string): BlogFaqItem | null {
  const newline = chunk.indexOf("\n");
  const rawQuestion = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
  const rawAnswer = newline === -1 ? "" : chunk.slice(newline).trim();
  const question = normalizeQuestion(rawQuestion);
  const answer = stripMarkdown(rawAnswer);
  if (!question || !answer) return null;
  return { question, answer };
}

function normalizeQuestion(value: string): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  return trimmed.endsWith("?") ? trimmed : `${trimmed}?`;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
