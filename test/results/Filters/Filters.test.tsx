import Filters from "@/app/[locale]/results/components/Filters";
import { useRouter } from "@/i18n/navigation";
import { type AST, getDefaultOperatorNode } from "@/lib/ast";
import fields from "@/lib/fields";
import type { IstexApiResponse } from "@/lib/istexApi";
import { customRender as render, screen, userEvent } from "../../test-utils";

describe("Filters", () => {
  it("expands the accordion when the field has an active filter", () => {
    const { container } = renderFilters(getWosCategoriesFilter());

    const wosCategoriesAccordionHeader = container.querySelector(
      "#categories\\.wos-header",
    );

    expect(wosCategoriesAccordionHeader).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("expands the accordion when the field is open by default and no filters are active", () => {
    const { container } = renderFilters();

    const corpusNameAccordionHeader =
      container.querySelector("#corpusName-header");

    expect(corpusNameAccordionHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("doesn't expand the accordion when the field is open by default and filters are active", () => {
    const { container } = renderFilters(getWosCategoriesFilter());

    const corpusNameAccordionHeader =
      container.querySelector("#corpusName-header");

    expect(corpusNameAccordionHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("disables the clear button when no filters are active", () => {
    renderFilters();

    const clearButton = screen.getByRole("button", { name: "Effacer tout" });

    expect(clearButton).toBeDisabled();
  });

  it("removes all filters when clicking on the clear button", async () => {
    const router = useRouter();
    renderFilters(getWosCategoriesFilter());

    const clearButton = screen.getByRole("button", { name: "Effacer tout" });
    await userEvent.click(clearButton);

    expect(router.push).toHaveBeenCalledWith("/results");
  });
});

function getWosCategoriesFilter() {
  return [
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
  ] satisfies AST;
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

function renderFilters(filters?: AST) {
  return render(
    <Filters />,
    { results },
    { searchParams: { filters: btoa(JSON.stringify(filters)) } },
  );
}
