import { formats, formatSizes } from '@/config';

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
  for (const format of Object.values(formats[categoryName].formats)) {
    wholeCategoryFormat = selectFormat(wholeCategoryFormat, format.value);
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
  for (const [formatCategoryName, formatCategory] of Object.entries(formats)) {
    const currentCategoryParams = [];

    // Cases of covers and annexes which are not in a category
    if (formatCategory.value !== undefined) {
      if (isFormatSelected(selectedFormats, formatCategory.value)) {
        extractParams.push(formatCategoryName);
      }
      continue;
    }

    // Build every format of the current category (e.g. pdf, txt for the fulltext category)
    for (const [currentCategoryFormatName, currentCategoryFormat] of Object.entries(formatCategory.formats)) {
      if (isFormatSelected(selectedFormats, currentCategoryFormat.value)) {
        currentCategoryParams.push(currentCategoryFormatName);
      }
    }

    // Only add the category if the category is not empty
    if (currentCategoryParams.length > 0) {
      extractParams.push(`${formatCategoryName}[${currentCategoryParams.join(',')}]`);
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
      return Object.keys(formats).some(supportedFormatCategory => category.startsWith(supportedFormatCategory));
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

/**
 * Estimate the size of an archive based on the average file sizes seen in Istex.
 * @param {number} selectedFormats The selected formats as an integer (bit field).
 * @param {number} numberOfDocuments The maximum number of documents.
 * @param {0|6|9} compressionLevel The level of compression.
 * @param {'zip'|'tar'} archiveType The type of archive.
 * @returns The estimated archive size.
 */
export function estimateArchiveSize (selectedFormats, numberOfDocuments, compressionLevel, archiveType) {
  let size = 0;

  for (const [formatCategoryName, formatCategory] of Object.entries(formats)) {
    // Cases of covers and annexes which are not in a category
    if (formatCategory.value !== undefined) {
      if (!isFormatSelected(selectedFormats, formatCategory.value)) continue;

      const formatSize = formatSizes.baseSizes[formatCategoryName];
      const multiplier = formatSizes[archiveType].multipliers[compressionLevel][formatCategoryName];

      size += formatSize * multiplier * numberOfDocuments;

      continue;
    }

    for (const [formatName, format] of Object.entries(formatCategory.formats)) {
      if (!isFormatSelected(selectedFormats, format.value)) continue;

      const formatSize = formatSizes.baseSizes[formatCategoryName][formatName];
      const multiplier = formatSizes[archiveType].multipliers[compressionLevel][formatCategoryName][formatName];

      size += formatSize * multiplier * numberOfDocuments;
    }
  }

  return size;
}
