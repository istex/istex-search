import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";
import NumberFilter from "@/app/[locale]/results/components/Filters/NumberFilter";
import { useRouter } from "@/i18n/navigation";
import { getDefaultOperatorNode, type AST } from "@/lib/ast";
import type { IstexApiResponse } from "@/lib/istexApi";

describe("NumberFilter", () => {
  it("disables the mode selector and the number inputs when in import mode", () => {
    renderNumberFilter(2000, 2010, false, { searchMode: "import" });

    const rangeModeTab = getRangeModeTab();
    const valueModeTab = getValueModeTab();
    const minInput = getMinInput();
    const maxInput = getMaxInput();

    expect(rangeModeTab).toBeDisabled();
    expect(valueModeTab).toBeDisabled();
    expect(minInput).toBeDisabled();
    expect(maxInput).toBeDisabled();
  });

  it("initializes the min and max inputs with the min and max aggregation values", () => {
    const min = 2000;
    const max = 2010;
    renderNumberFilter(min, max);

    const rangeModeTab = getRangeModeTab();
    const valueModeTab = getValueModeTab();
    const minInput = getMinInput();
    const maxInput = getMaxInput();

    expect(rangeModeTab).toHaveAttribute("aria-selected", "true");
    expect(valueModeTab).toHaveAttribute("aria-selected", "false");
    expect(minInput).toHaveValue(min.toString());
    expect(maxInput).toHaveValue(max.toString());
  });

  it("sets the input mode to value and initializes the value input when the min and max aggregation values are equal", () => {
    const value = 2000;
    renderNumberFilter(value, value);

    const rangeModeTab = getRangeModeTab();
    const valueModeTab = getValueModeTab();
    const valueInput = getValueInput();

    expect(rangeModeTab).toHaveAttribute("aria-selected", "false");
    expect(valueModeTab).toHaveAttribute("aria-selected", "true");
    expect(valueInput).toHaveValue(value.toString());
  });

  it("disables the apply button when the min, max or single value are equal to their initial values coming from the aggregation", async () => {
    const min = 2000;
    const max = 2010;
    renderNumberFilter(min, max);

    const applyButton = getApplyButton();
    const minInput = getMinInput();

    await userEvent.clear(minInput);
    await userEvent.type(minInput, "2005");
    expect(applyButton).toBeEnabled();

    await userEvent.clear(minInput);
    await userEvent.type(minInput, min.toString());
    expect(applyButton).toBeDisabled();
  });

  it("disables the apply button when the min, max or single value inputs are empty", async () => {
    renderNumberFilter(2000, 2010);

    const applyButton = getApplyButton();
    const minInput = getMinInput();
    await userEvent.clear(minInput);

    expect(applyButton).toBeDisabled();
  });

  it("disables the clear button when no filters are active for the current field", () => {
    renderNumberFilter(2000, 2010);

    const clearButton = getClearButton();

    expect(clearButton).toBeDisabled();
  });

  it("calls router.push with a correct AST when clicking on the apply button while using a range", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    const router = useRouter();
    const min = 2000;
    const max = 2010;
    const newMin = 2005;
    renderNumberFilter(min, max);

    const minInput = getMinInput();
    await userEvent.clear(minInput);
    await userEvent.type(minInput, newMin.toString());

    const applyButton = getApplyButton();
    await userEvent.click(applyButton);

    const expectedFilters: AST = [
      { id: 0, nodeType: "operator", value: "AND" },
      {
        id: 0,
        nodeType: "node",
        field: "publicationDate",
        fieldType: "number",
        min: newMin,
        max,
        comparator: "between",
      },
    ];

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("calls router.push with a correct AST when clicking on the apply button while using a single value", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    const router = useRouter();
    const value = 2000;
    const newValue = 2005;
    renderNumberFilter(value, value);

    const valueInput = getValueInput();
    await userEvent.clear(valueInput);
    await userEvent.type(valueInput, newValue.toString());

    const applyButton = getApplyButton();
    await userEvent.click(applyButton);

    const expectedFilters: AST = [
      { id: 0, nodeType: "operator", value: "AND" },
      {
        id: 0,
        nodeType: "node",
        field: "publicationDate",
        fieldType: "number",
        value: newValue,
        comparator: "equals",
      },
    ];

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the filter on the current field when clicking on the clear button", async () => {
    const router = useRouter();
    renderNumberFilter(2000, 2010, true);

    const clearButton = getClearButton();
    await userEvent.click(clearButton);

    expect(router.push).toHaveBeenCalledWith("/results?");
  });
});

function getMinInput() {
  return screen.getByPlaceholderText("Minimum");
}

function getMaxInput() {
  return screen.getByPlaceholderText("Maximum");
}

function getValueInput() {
  return screen.getByPlaceholderText("Valeur");
}

function getRangeModeTab() {
  return screen.getByRole("tab", { name: "intervalle" });
}

function getValueModeTab() {
  return screen.getByRole("tab", { name: "valeur" });
}

function getApplyButton() {
  return screen.getByRole("button", { name: "Appliquer" });
}

function getClearButton() {
  return screen.getByRole("button", { name: "Effacer" });
}

function renderNumberFilter(
  min: number,
  max: number,
  withFilters = false,
  searchParams: Parameters<typeof mockSearchParams>[0] = {},
) {
  if (withFilters) {
    const finalFilters: AST = [
      getDefaultOperatorNode(),
      {
        id: Math.random(),
        nodeType: "node",
        field: "publicationDate",
        fieldType: "number",
        min,
        max,
        comparator: "between",
      },
    ];

    searchParams.filters = btoa(JSON.stringify(finalFilters));
  }

  const results: IstexApiResponse = {
    total: 3,
    hits: [],
    aggregations: {
      publicationDate: {
        buckets: [
          {
            key: `${min}-${max}`,
            fromAsString: min.toString(),
            toAsString: max.toString(),
            docCount: 3,
          },
        ],
      },
    },
  };

  mockSearchParams(searchParams);

  render(
    <NumberFilter
      field={{ name: "publicationDate", type: "number", isDate: true }}
    />,
    {
      results,
    },
  );
}
