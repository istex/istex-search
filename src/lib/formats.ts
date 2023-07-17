import { type FormatCategoryName, NO_FORMAT_SELECTED, formats } from "@/config";

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

export function buildExtractParamsFromFormats(selectedFormats: number) {
  const extractParams = [];

  // Build every category (fulltext, metadata and enrichments) of the extract parameter
  for (const [formatCategoryName, formatCategory] of Object.entries(formats)) {
    const currentCategoryParams = [];

    // Build every format of the current category (e.g. pdf, txt for the fulltext category)
    for (const [
      currentCategoryFormatName,
      currentCategoryFormat,
    ] of Object.entries(formatCategory)) {
      if (isFormatSelected(selectedFormats, currentCategoryFormat)) {
        currentCategoryParams.push(currentCategoryFormatName);
      }
    }

    // Only add the category if the category is not empty
    if (currentCategoryParams.length > 0) {
      // Cases of annexes and covers which are formatted differently
      if (formatCategoryName === "others") {
        extractParams.push(currentCategoryParams.join(";"));
      } else {
        extractParams.push(
          `${formatCategoryName}[${currentCategoryParams.join(",")}]`
        );
      }
    }
  }

  return extractParams.join(";");
}

export function parseExtractParams(extractParams: string) {
  let selectedFormats = 0;

  // Get the categories by splitting with ';' and only keep the supported format categories
  const formatCategories = extractParams.split(";").filter((category) => {
    // category would look like this: 'fulltext[txt,pdf]' so we
    // need to make sure supportedFormatCategory is at the beginning of category.
    // Annexes and covers are formatted differently and look like categories but are not
    // internally in Istex-DL (behavior coming from legacy versions of Istex-DL and that
    // is still in the API)
    return [...Object.keys(formats), "annexes", "covers"].some(
      (supportedFormatCategory) => category.startsWith(supportedFormatCategory)
    );
  });

  for (const formatCategory of formatCategories) {
    const indexOfOpeningBracket = formatCategory.indexOf("[");
    const indexOfClosingBracket = formatCategory.indexOf("]");

    // If formatCategory does not contain '[' and ']', it means it's 'covers' or 'annexes'
    if (indexOfOpeningBracket === -1 || indexOfClosingBracket === -1) {
      const formatCategoryName = formatCategory as keyof typeof formats.others;
      if (formats.others[formatCategoryName] != null) {
        selectedFormats = selectFormat(
          selectedFormats,
          formats.others[formatCategoryName]
        );
      }
      continue;
    }

    // Get the format category name (e.g. for 'fulltext[txt,pdf]' get 'fulltext')
    const formatCategoryName = formatCategory.substring(
      0,
      indexOfOpeningBracket
    ) as FormatCategoryName;

    // Get the formats within formatCategoryName and only keep the supported formats
    const currentCategoryFormats = formatCategory
      .substring(indexOfOpeningBracket + 1, indexOfClosingBracket)
      .split(",")
      .filter((categoryFormat) =>
        Object.keys(formats[formatCategoryName]).includes(categoryFormat)
      );

    for (const currentCategoryFormat of currentCategoryFormats) {
      selectedFormats = selectFormat(
        selectedFormats,
        // @ts-expect-error TypeScript is not happy here because currentCategoryFormat is
        // just a regular string but the filter above makes sure currentCategoryFormat is
        // in formats[formatCategoryName]
        formats[formatCategoryName][currentCategoryFormat]
      );
    }
  }

  return selectedFormats;
}
