import type { SxProps } from "@mui/system/styleFunctionSx";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/navigation";

export function lineclamp(lines: number): SxProps {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

export function closest(number: number, values: number[] | readonly number[]) {
  return values.reduce((prev, curr) =>
    Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev,
  );
}

export function isValidMd5(hash: string) {
  return /^[a-f0-9]{32}$/gi.test(hash);
}

export function isValidDoi(doi: string) {
  return /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'])\S)+)\b/gi.test(doi);
}

export function isValidArk(ark: string) {
  return /ark:\/67375\/[0-9B-DF-HJ-TV-XZ]{3}-[0-9B-DF-HJ-NP-TV-XZ]{8}-[0-9B-DF-HJ-NP-TV-XZ]/.test(
    ark,
  );
}

export function isValidIstexId(istexId: string) {
  return /^[A-F0-9]{40}$/g.test(istexId);
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function formatDate(timestamp: number, locale: Locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}
