import Filters from "@/app/[locale]/results/components/Filters";
import { useRouter } from "@/i18n/routing";
import { type AST, getDefaultOperatorNode } from "@/lib/ast";
import fields from "@/lib/fields";
import type { IstexApiResponse } from "@/lib/istexApi";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";

describe("Filters", () => {
  it("expands the accordion when the field has an active filter", () => {
    mockSearchParams({
      filters: getWosCategoriesFilter(),
    });
    const { container } = renderFilters();

    const wosCategoriesAccordionHeader = container.querySelector(
      "#categories\\.wos-header",
    );

    expect(wosCategoriesAccordionHeader).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("expands the accordion when the field is open by default and no filters are active", () => {
    mockSearchParams({});
    const { container } = renderFilters();

    const corpusNameAccordionHeader =
      container.querySelector("#corpusName-header");

    expect(corpusNameAccordionHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("doesn't expand the accordion when the field is open by default and filters are active", () => {
    mockSearchParams({
      filters: getWosCategoriesFilter(),
    });
    const { container } = renderFilters();

    const corpusNameAccordionHeader =
      container.querySelector("#corpusName-header");

    expect(corpusNameAccordionHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("disables the clear button when no filters are active", () => {
    mockSearchParams({});
    renderFilters();

    const clearButton = screen.getByRole("button", { name: "Effacer tout" });

    expect(clearButton).toBeDisabled();
  });

  it("removes all filters when clicking on the clear button", async () => {
    const router = useRouter();
    mockSearchParams({
      filters: getWosCategoriesFilter(),
    });
    renderFilters();

    const clearButton = screen.getByRole("button", { name: "Effacer tout" });
    await userEvent.click(clearButton);

    expect(router.push).toHaveBeenCalledWith("/results?");
  });
});

function getWosCategoriesFilter() {
  const filters: AST = [
    getDefaultOperatorNode(),
    {
      id: Math.random(),
      nodeType: "group",
      nodes: [
        {
          nodeType: "node",
          fieldType: "text",
          field: "categories.wos",
          value: "1 - science",
          comparator: "equals",
        },
      ],
    },
  ];

  return btoa(JSON.stringify(filters));
}

const results: IstexApiResponse = {
  total: 10,
  hits: [],
  aggregations: Object.fromEntries(
    fields
      .filter((field) => field.inFilters != null && field.inFilters)
      .map((field) => {
        const buckets = [];
        if (field.isDate === true) {
          buckets.push({
            key: 0,
            docCount: 3,
            fromAsString: "2010",
            toAsString: "2020",
          });
        }

        return [
          field.name,
          {
            buckets,
          },
        ];
      }),
  ),
};

function renderFilters() {
  return render(<Filters />, { results });
}
