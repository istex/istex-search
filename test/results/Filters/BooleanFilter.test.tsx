import BooleanFilter from "@/app/[locale]/results/components/Filters/BooleanFilter";
import { useRouter } from "@/i18n/routing";
import { type AST, getDefaultOperatorNode } from "@/lib/ast";
import { getAggregation, type IstexApiResponse } from "@/lib/istexApi";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
  waitFor,
} from "../../test-utils";

describe("BooleanFilter", () => {
  it("automatically selects the value found in filters", () => {
    renderBooleanFilter({ filterValue: true });

    const trueRadioButton = getTrueRadioButton();

    expect(trueRadioButton).toBeChecked();
  });

  it("disables the radio buttons when in import mode", () => {
    renderBooleanFilter({ searchParams: { searchMode: "import" } });

    const trueRadioButton = getTrueRadioButton();
    const falseRadioButton = getFalseRadioButton();

    expect(trueRadioButton).toBeDisabled();
    expect(falseRadioButton).toBeDisabled();
  });

  it("disables the apply button when the selected value is the same as the initial one", () => {
    renderBooleanFilter({ filterValue: true });

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
    renderBooleanFilter({ filterValue: true });

    const clearButton = getClearButton();
    await userEvent.click(clearButton);

    expect(router.push).toHaveBeenCalledWith("/results?");
  });

  it("dynamically gets the available values when the filter isn't open by default", async () => {
    const aggregation = [
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
    ];
    (getAggregation as jest.Mock).mockReturnValueOnce(aggregation);
    renderBooleanFilter({ defaultOpen: false });

    await waitFor(() => {
      const trueRadioButton = getTrueRadioButton();
      const falseRadioButton = getFalseRadioButton();

      expect(trueRadioButton).toBeInTheDocument();
      expect(falseRadioButton).toBeInTheDocument();
    });
  });

  it("dislpays an error card when dynamically getting the available values fails", async () => {
    (getAggregation as jest.Mock).mockReturnValueOnce(
      Promise.reject(new Error()),
    );
    renderBooleanFilter({ defaultOpen: false });

    await waitFor(() => {
      const alert = screen.getByRole("alert");

      expect(alert).toBeInTheDocument();
    });
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

interface RenderBooleanFilterOptions {
  filterValue?: boolean;
  searchParams?: Parameters<typeof mockSearchParams>[0];
  defaultOpen?: boolean;
}

function renderBooleanFilter({
  filterValue,
  searchParams = {},
  defaultOpen = true,
}: RenderBooleanFilterOptions = {}) {
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
        defaultOpen,
      }}
    />,
    { results },
  );
}
