import { type FormatCategoryName, formats, NO_FORMAT_SELECTED } from "@/config";

// The selected formats are represented as an integer where each bit represents a format
// so we use bitwise operators to select/deselect formats (cf. https://stackoverflow.com/a/47990)

export function selectFormat(baseFormat: number, formatToSelect: number) {
  return baseFormat | formatToSelect;
}

export function deselectFormat(baseFormat: number, formatToDeselect: number) {
  return baseFormat & ~formatToDeselect;
}

export function toggleFormat(baseFormat: number, formatToToggle: number) {
  return baseFormat ^ formatToToggle;
}

export function isFormatSelected(baseFormat: number, formatToCheck: number) {
  return Boolean(baseFormat & formatToCheck);
}

export function isWholeCategorySelected(
  baseFormat: number,
  categoryName: FormatCategoryName
) {
  const wholeCategoryFormat = getWholeCategoryFormat(categoryName);
  const res = baseFormat & wholeCategoryFormat;

  return res === wholeCategoryFormat;
}

export function getWholeCategoryFormat(categoryName: FormatCategoryName) {
  let wholeCategoryFormat = NO_FORMAT_SELECTED;
  for (const format of Object.values(formats[categoryName])) {
    wholeCategoryFormat = selectFormat(wholeCategoryFormat, format);
  }

  return wholeCategoryFormat;
}
