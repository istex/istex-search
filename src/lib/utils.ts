import type { SxProps } from "@mui/system/styleFunctionSx";

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
