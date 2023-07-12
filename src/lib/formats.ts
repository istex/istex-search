import { formats } from "@/config";

// The selected formats are represented as an integer where each bit represents a format
// so we use bitwise operators to select/deselect formats (cf. https://stackoverflow.com/a/47990)

export function selectFormat(
  baseFormat: number,
  formatToSelect: number
): number {
  return baseFormat | formatToSelect;
}

export function deselectFormat(
  baseFormat: number,
  formatToDeselect: number
): number {
  return baseFormat & ~formatToDeselect;
}

export function toggleFormat(
  baseFormat: number,
  formatToToggle: number
): number {
  return baseFormat ^ formatToToggle;
}

export function noFormatSelected(): number {
  return 0;
}

export function isFormatSelected(
  baseFormat: number,
  formatToCheck: number
): boolean {
  return (baseFormat & formatToCheck) === formatToCheck;
}

export function getWholeCategoryFormat(
  categoryName: keyof typeof formats
): number {
  if (formats[categoryName] == null) return 0;

  let wholeCategoryFormat = 0;
  for (const format of Object.values(formats[categoryName])) {
    wholeCategoryFormat = selectFormat(wholeCategoryFormat, format.value);
  }

  return wholeCategoryFormat;
}
