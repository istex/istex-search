import type { SxProps } from "@mui/system/styleFunctionSx";
import { isoLanguagesToLabelize } from "@/config";
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

export function debounce<T extends (...args: never[]) => void>(
  callback: T,
  delay = 1000,
) {
  let timeoutId: number | undefined;

  const debounced = (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(callback, delay, ...args);
  };

  debounced.cancel = () => {
    if (timeoutId != null) {
      window.clearTimeout(timeoutId);
    }
  };

  return debounced;
}

// Taken from here:
// https://gist.github.com/lanqy/5193417?permalink_comment_id=4379535#gistcomment-4379535
export function bytesToSize(bytes: number, locale: Locale) {
  const units = ["byte", "kilobyte", "megabyte", "gigabyte"];
  const unitIndex = Math.max(
    0,
    Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1),
  );

  return Intl.NumberFormat(locale, {
    notation: "compact",
    style: "unit",
    unit: units[unitIndex],
    unitDisplay: "short",
  }).format(bytes / 1024 ** unitIndex);
}

export function labelizeIsoLanguage(
  locale: string,
  iso: string,
  t: (key: string) => string,
) {
  if (isoLanguagesToLabelize.includes(iso)) {
    return t(iso);
  }

  const dictionary = new Intl.DisplayNames([locale], { type: "language" });
  try {
    return dictionary.of(iso) ?? iso;
  } catch {
    return iso;
  }
}

export function areSetsEqual<T>(first: Set<T>, second: Set<T>) {
  // Use the native implementation if it's available
  // TODO: Remove this function and just use the native implementation once browser support is >95%
  if (typeof Set.prototype.symmetricDifference === "function") {
    return first.symmetricDifference(second).size === 0;
  }

  return (
    first.size === second.size &&
    Array.from(first).every((value) => second.has(value))
  );
}
