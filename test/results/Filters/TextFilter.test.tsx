import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";
import TextFilter from "@/app/[locale]/results/components/Filters/TextFilter";
import { useRouter } from "@/i18n/routing";
import { getDefaultOperatorNode, type AST } from "@/lib/ast";
import type { Aggregation, IstexApiResponse } from "@/lib/istexApi";

describe("TextFilter", () => {
  it("automatically selects the values found in filters", () => {
    renderTextFilter(
      [
        {
          key: "elsevier",
          docCount: 3,
        },
        {
          key: "wiley",
          docCount: 3,
        },
      ],
      ["elsevier"],
    );

    const elsevierCheckbox = screen.getByRole("checkbox", {
      name: "elsevier 3",
    });
    const wileyCheckbox = screen.getByRole("checkbox", {
      name: "wiley 3",
    });

    expect(elsevierCheckbox).toBeChecked();
    expect(wileyCheckbox).not.toBeChecked();
  });

  it("disables the values when in import mode", () => {
    renderTextFilter(
      [
        {
          key: "elsevier",
          docCount: 3,
        },
        {
          key: "wiley",
          docCount: 3,
        },
      ],
      undefined,
      { searchMode: "import" },
    );

    const elsevierCheckbox = screen.getByRole("checkbox", {
      name: "elsevier 3",
    });
    const wileyCheckbox = screen.getByRole("checkbox", {
      name: "wiley 3",
    });
    const searchInput = screen.getByRole("textbox");

    expect(elsevierCheckbox).toBeDisabled();
    expect(wileyCheckbox).toBeDisabled();
    expect(searchInput).not.toBeDisabled();
  });

  it("filters the list of values based on the content of the search bar", async () => {
    renderTextFilter([
      {
        key: "elsevier",
        docCount: 3,
      },
      {
        key: "wiley",
        docCount: 3,
      },
    ]);

    const searchInput = screen.getByRole("textbox");
    await userEvent.type(searchInput, "elsevier");

    const elsevierCheckbox = screen.queryByRole("checkbox", {
      name: "elsevier 3",
    });
    const wileyCheckbox = screen.queryByRole("checkbox", {
      name: "wiley 3",
    });

    expect(elsevierCheckbox).toBeInTheDocument();
    expect(wileyCheckbox).not.toBeInTheDocument();
  });

  it("sorts the values by name in ascending order when clicking on the asc sort button above the keys", async () => {
    renderTextFilter([
      {
        key: "elsevier",
        docCount: 3,
      },
      {
        key: "wiley",
        docCount: 4,
      },
    ]);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("wiley 4");
      expect(secondCheckbox).toHaveAccessibleName("elsevier 3");
    }

    const ascNameSortButton = screen.getByRole("button", {
      name: "Trier les valeurs par ordre alphanumérique croissant",
    });
    await userEvent.click(ascNameSortButton);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("elsevier 3");
      expect(secondCheckbox).toHaveAccessibleName("wiley 4");
    }
  });

  it("sorts the values by name in descending order when clicking on the desc sort button above the keys", async () => {
    renderTextFilter([
      {
        key: "elsevier",
        docCount: 4,
      },
      {
        key: "wiley",
        docCount: 3,
      },
    ]);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("elsevier 4");
      expect(secondCheckbox).toHaveAccessibleName("wiley 3");
    }

    const descNameSortButton = screen.getByRole("button", {
      name: "Trier les valeurs par ordre alphanumérique décroissant",
    });
    await userEvent.click(descNameSortButton);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("wiley 3");
      expect(secondCheckbox).toHaveAccessibleName("elsevier 4");
    }
  });

  it("sorts the values by doc count in ascending order when clicking on the asc sort button above the doc counts", async () => {
    renderTextFilter([
      {
        key: "elsevier",
        docCount: 3,
      },
      {
        key: "wiley",
        docCount: 4,
      },
    ]);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("wiley 4");
      expect(secondCheckbox).toHaveAccessibleName("elsevier 3");
    }

    const ascDocCountSortButton = screen.getByRole("button", {
      name: "Trier par volumétrie croissante",
    });
    await userEvent.click(ascDocCountSortButton);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("elsevier 3");
      expect(secondCheckbox).toHaveAccessibleName("wiley 4");
    }
  });

  it("sorts the values by doc count in descending order when clicking on the desc sort button above the doc counts", async () => {
    renderTextFilter([
      {
        key: "elsevier",
        docCount: 4,
      },
      {
        key: "wiley",
        docCount: 3,
      },
    ]);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("elsevier 4");
      expect(secondCheckbox).toHaveAccessibleName("wiley 3");
    }

    const descDocCountSortButton = screen.getByRole("button", {
      name: "Trier par volumétrie décroissante",
    });
    await userEvent.click(descDocCountSortButton);

    {
      const [firstCheckbox, secondCheckbox] = screen.getAllByRole("checkbox");
      expect(firstCheckbox).toHaveAccessibleName("elsevier 4");
      expect(secondCheckbox).toHaveAccessibleName("wiley 3");
    }
  });

  it("disables the apply button when the selected values are the same as the initial ones", async () => {
    renderTextFilter(
      [
        {
          key: "elsevier",
          docCount: 3,
        },
        {
          key: "wiley",
          docCount: 3,
        },
      ],
      ["elsevier"],
    );

    const wileyCheckbox = screen.getByRole("checkbox", { name: "wiley 3" });
    await userEvent.click(wileyCheckbox); // check wiley to change list of selected values from initial one
    await userEvent.click(wileyCheckbox); // uncheck wiley to go back to the initial list of selected values

    const applyButton = getApplyButton();

    expect(applyButton).toBeDisabled();
  });

  it("disables the clear button when no filters are active for the current field", () => {
    renderTextFilter([
      {
        key: "elsevier",
        docCount: 3,
      },
      {
        key: "wiley",
        docCount: 3,
      },
    ]);

    const clearButton = getClearButton();

    expect(clearButton).toBeDisabled();
  });

  it("calls router.push with a correct AST when clicking on the apply button", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    const router = useRouter();
    renderTextFilter(
      [
        {
          key: "elsevier",
          docCount: 3,
        },
        {
          key: "wiley",
          docCount: 3,
        },
      ],
      ["elsevier"],
    );

    const wileyCheckbox = screen.getByRole("checkbox", { name: "wiley 3" });
    await userEvent.click(wileyCheckbox);

    const applyButton = getApplyButton();
    await userEvent.click(applyButton);

    const expectedFilters: AST = [
      { id: 0, nodeType: "operator", value: "AND" },
      {
        id: 0,
        nodeType: "group",
        nodes: ["elsevier", "wiley"].map((value) => ({
          id: 0,
          nodeType: "node",
          field: "corpusName",
          fieldType: "text",
          value,
          comparator: "equals",
        })),
      },
    ];

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the filter on the current field when clicking on the clear button", async () => {
    const router = useRouter();
    renderTextFilter(
      [
        {
          key: "elsevier",
          docCount: 3,
        },
        {
          key: "wiley",
          docCount: 3,
        },
      ],
      ["elsevier"],
    );

    const clearButton = getClearButton();
    await userEvent.click(clearButton);

    expect(router.push).toHaveBeenCalledWith("/results?");
  });
});

function getApplyButton() {
  return screen.getByRole("button", { name: "Appliquer" });
}

function getClearButton() {
  return screen.getByRole("button", { name: "Effacer" });
}

function renderTextFilter(
  aggregationValues: Aggregation["string"]["buckets"],
  filterValues?: string[],
  searchParams: Parameters<typeof mockSearchParams>[0] = {},
) {
  if (filterValues != null && filterValues.length > 0) {
    const finalFilters: AST = [
      getDefaultOperatorNode(),
      {
        id: Math.random(),
        nodeType: "group",
        nodes: filterValues.map((value) => ({
          id: Math.random(),
          nodeType: "node",
          field: "corpusName",
          fieldType: "text",
          value,
          comparator: "equals",
        })),
      },
    ];

    searchParams.filters = btoa(JSON.stringify(finalFilters));
  }

  mockSearchParams(searchParams);

  const results: IstexApiResponse = {
    total: 3,
    hits: [],
    aggregations: {
      corpusName: {
        buckets: aggregationValues,
      },
    },
  };

  render(<TextFilter field={{ name: "corpusName", type: "text" }} />, {
    results,
  });
}
