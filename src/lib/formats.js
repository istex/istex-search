import { formats } from '@/config';

// The selected formats are represented as an integer where each bit represents a format
// so we use bitwise operators to select/deselect formats (cf. https://stackoverflow.com/a/47990)

/**
 * Select `formatToSelect` in `baseFormat`.
 * @param {number} baseFormat The format to select in.
 * @param {number} formatToSelect The format to select.
 * @returns `baseFormat` after selecting `formatToSelect` in it.
 */
export function selectFormat (baseFormat, formatToSelect) {
  return baseFormat | formatToSelect;
}

/**
 * Deselect `formatToDeselect` in `baseFormat`.
 * @param {number} baseFormat The format to deselect in.
 * @param {number} formatToDeselect The format to deselect.
 * @returns `baseFormat` after deselecting `formatToDeselect` in it.
 */
export function deselectFormat (baseFormat, formatToDeselect) {
  return baseFormat & ~formatToDeselect;
}

/**
 * Toggle `formatToToggle` in `baseFormat`.
 * @param {number} baseFormat The format to toggle in.
 * @param {number} formatToToggle The format to toggle.
 * @returns `baseFormat` after toggling `formatToToggle` in it.
 */
export function toggleFormat (baseFormat, formatToToggle) {
  return baseFormat ^ formatToToggle;
}

/**
 * Returns a format with nothing selected (0).
 * @returns A format with nothing selected (0).
 */
export function noFormatSelected () {
  return 0;
}

/**
 * Check if `formatToCheck` is selected in `baseFormat`.
 * @param {number} baseFormat The format to check in.
 * @param {number} formatToCheck Teh format to check.
 * @returns `true` if `formatToCheck` is selected in `baseFormat`. `false` otherwise.
 */
export function isFormatSelected (baseFormat, formatToCheck) {
  return (baseFormat & formatToCheck) === formatToCheck;
}

/**
 * Returns a format corresponding to all the formats inside `categoryName`.
 * @param {string} categoryName The name of the category.
 * @returns A format corresponding to all the formats inside `categoryName`.
 */
export function getWholeCategoryFormat (categoryName) {
  if (!formats[categoryName]) return 0;

  let wholeCategoryFormat = 0;
  for (const formatName in formats[categoryName].formats) {
    wholeCategoryFormat = selectFormat(wholeCategoryFormat, formats[categoryName].formats[formatName].value);
  }

  return wholeCategoryFormat;
}

/**
 * Build the extract parameter from the selected formats.
 * @param {number} selectedFormats The selected formats as an integer.
 * @returns The extract parameter as a string.
 * @example 'fulltext[txt,pdf];metadata[multicat,nb]'
 */
export function buildExtractParamsFromFormats (selectedFormats) {
  const extractParams = [];

  // Build every category (fulltext, metadata and enrichments) of the extract parameter
  for (const formatCategory in formats) {
    const currentCategoryParams = [];

    // Cases of covers and annexes which are not in a category
    if (formats[formatCategory].value !== undefined) {
      if (isFormatSelected(selectedFormats, formats[formatCategory].value)) {
        extractParams.push(formatCategory);
      }
      continue;
    }

    // Build every format of the current category (e.g. pdf, txt for the fulltext category)
    for (const currentCategoryFormat in formats[formatCategory].formats) {
      if (isFormatSelected(selectedFormats, formats[formatCategory].formats[currentCategoryFormat].value)) {
        currentCategoryParams.push(currentCategoryFormat);
      }
    }

    // Only add the category if the category is not empty
    if (currentCategoryParams.length > 0) {
      extractParams.push(`${formatCategory}[${currentCategoryParams.join(',')}]`);
    }
  }

  return extractParams.join(';');
}

/**
 * Parse the extract URL parameter and create the selected formats integer.
 * @param {string} extractParamsAsString The extract URL parameter (e.g. `fulltext[txt,pdf];metadata[multicat,nb]`).
 * @returns The selected formats as an integer.
 */
export function parseExtractParams (extractParamsAsString) {
  let selectedFormats = 0;

  // Get the categories by splitting with ';' and only keep the supported format categories
  const formatCategories = extractParamsAsString.split(';')
    .filter(category => {
      // category would look like this: 'fulltext[txt,pdf]' so we
      // need to make sure supportedFormatCategory is at the beginning of category
      for (const supportedFormatCategory in formats) {
        if (category.startsWith(supportedFormatCategory)) return true;
      }
      return false;
    });

  for (const formatCategory of formatCategories) {
    const indexOfOpeningBracket = formatCategory.indexOf('[');
    const indexOfClosingBracket = formatCategory.indexOf(']');

    // If formatCategory does not contain '[' and ']', it means it's 'covers' or 'annexes'
    if (indexOfOpeningBracket === -1 || indexOfClosingBracket === -1) {
      if (formats[formatCategory].value !== undefined) {
        selectedFormats = selectFormat(selectedFormats, formats[formatCategory].value);
      }
      continue;
    }

    // Get the format category name (e.g. for 'fulltext[txt,pdf]' get 'fulltext')
    const formatCategoryName = formatCategory.substring(0, indexOfOpeningBracket);

    // Get the formats within formatCategoryName and only keep the supported formats
    const currentCategoryFormats = formatCategory.substring(indexOfOpeningBracket + 1, indexOfClosingBracket)
      .split(',')
      .filter(categoryFormat => Object.keys(formats[formatCategoryName].formats).includes(categoryFormat));

    for (const currentCategoryFormat of currentCategoryFormats) {
      selectedFormats = selectFormat(selectedFormats, formats[formatCategoryName].formats[currentCategoryFormat].value);
    }
  }

  return selectedFormats;
}
