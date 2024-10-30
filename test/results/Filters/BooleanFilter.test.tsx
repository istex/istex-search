import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";
import BooleanFilter from "@/app/[locale]/results/components/Filters/BooleanFilter";
import { useRouter } from "@/i18n/routing";
import { getDefaultOperatorNode, type AST } from "@/lib/ast";
import type { IstexApiResponse } from "@/lib/istexApi";

describe("BooleanFilter", () => {
  it("automatically selects the value found in filters", () => {
    renderBooleanFilter(true);

    const trueRadioButton = getTrueRadioButton();

    expect(trueRadioButton).toBeChecked();
  });

  it("disables the radio buttons when in import mode", () => {
    renderBooleanFilter(undefined, { searchMode: "import" });

    const trueRadioButton = getTrueRadioButton();
    const falseRadioButton = getFalseRadioButton();

    expect(trueRadioButton).toBeDisabled();
    expect(falseRadioButton).toBeDisabled();
  });

  it("disables the apply button when the selected value is the same as the initial one", () => {
    renderBooleanFilter(true);

    const applyButton = getApplyButton();

    expect(applyButton).toBeDisabled();
  });

  it("disables the clear button when no filters are active for the current field", () => {
    renderBooleanFilter();

    const clearButton = getClearButton();

    expect(clearButton).toBeDisabled();
  });

  it("calls router.push with a correct AST when clicking on the apply button", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    const router = useRouter();
    renderBooleanFilter();

    const trueRadioButton = getTrueRadioButton();
    await userEvent.click(trueRadioButton);

    const applyButton = getApplyButton();
    await userEvent.click(applyButton);

    const expectedFilters: AST = [
      getDefaultOperatorNode(),
      {
        id: Math.random(),
        nodeType: "node",
        field: "qualityIndicators.refBibsNative",
        fieldType: "boolean",
        value: true,
        comparator: "equals",
      },
    ];

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the filter on the current field when clicking on the clear button", async () => {
    const router = useRouter();
    renderBooleanFilter(true);

    const clearButton = getClearButton();
    await userEvent.click(clearButton);

    expect(router.push).toHaveBeenCalledWith("/results?");
  });
});

function getTrueRadioButton() {
  return screen.getByRole("radio", { name: "Fournies par l'éditeur 3" });
}

function getFalseRadioButton() {
  return screen.getByRole("radio", { name: "Recherchées via Grobid 4" });
}

function getApplyButton() {
  return screen.getByRole("button", { name: "Appliquer" });
}

function getClearButton() {
  return screen.getByRole("button", { name: "Effacer" });
}

function renderBooleanFilter(
  filterValue?: boolean,
  searchParams: Parameters<typeof mockSearchParams>[0] = {},
) {
  if (filterValue != null) {
    const finalFilters: AST = [
      getDefaultOperatorNode(),
      {
        id: Math.random(),
        nodeType: "node",
        field: "qualityIndicators.refBibsNative",
        fieldType: "boolean",
        value: filterValue,
        comparator: "equals",
      },
    ];

    searchParams.filters = btoa(JSON.stringify(finalFilters));
  }
  mockSearchParams(searchParams);

  const results: IstexApiResponse = {
    total: 3,
    hits: [],
    aggregations: {
      "qualityIndicators.refBibsNative": {
        buckets: [
          {
            key: 0,
            keyAsString: "false",
            docCount: 4,
          },
          {
            key: 1,
            keyAsString: "true",
            docCount: 3,
          },
        ],
      },
    },
  };

  render(
    <BooleanFilter
      field={{
        name: "qualityIndicators.refBibsNative",
        type: "boolean",
        requiresLabeling: true,
      }}
    />,
    { results },
  );
}
