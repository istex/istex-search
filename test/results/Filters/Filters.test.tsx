import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";
import Filters from "@/app/[locale]/results/components/Filters";
import { useRouter } from "@/i18n/routing";
import { getDefaultOperatorNode, type AST } from "@/lib/ast";

describe("Filters", () => {
  it("expands the accordion when the field has an active filter", () => {
    mockSearchParams({
      filters: getWosCategoriesFilter(),
    });
    const { container } = render(<Filters />);

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
    const { container } = render(<Filters />);

    const corpusNameAccordionHeader =
      container.querySelector("#corpusName-header");

    expect(corpusNameAccordionHeader).toHaveAttribute("aria-expanded", "true");
  });

  it("doesn't expand the accordion when the field is open by default and filters are active", () => {
    mockSearchParams({
      filters: getWosCategoriesFilter(),
    });
    const { container } = render(<Filters />);

    const corpusNameAccordionHeader =
      container.querySelector("#corpusName-header");

    expect(corpusNameAccordionHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("disables the clear button when no filters are active", () => {
    mockSearchParams({});
    render(<Filters />);

    const clearButton = screen.getByRole("button", { name: "Effacer tout" });

    expect(clearButton).toBeDisabled();
  });

  it("removes all filters when clicking on the clear button", async () => {
    const router = useRouter();
    mockSearchParams({
      filters: getWosCategoriesFilter(),
    });
    render(<Filters />);

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
