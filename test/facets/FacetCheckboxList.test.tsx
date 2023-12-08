import { customRender as render, screen, userEvent } from "../test-utils";
import FacetCheckboxList from "@/app/[locale]/results/facets/FacetCheckboxList";
import { FacetProvider } from "@/app/[locale]/results/facets/FacetContext";

describe("FacetCheckboxList", () => {
  const facetTitle = "corpusName";
  const facetItems = [
    { key: "Option 1", docCount: 10, selected: false },
    { key: "Option 2", docCount: 5, selected: true },
    { key: "Option 3", docCount: 3, selected: false },
  ];

  const facets = {
    [facetTitle]: facetItems,
  };

  it("should render the facet checkbox list correctly", () => {
    render(
      <FacetProvider facets={facets}>
        <FacetCheckboxList facetTitle={facetTitle} facetItems={facetItems} />
      </FacetProvider>,
    );

    const facetItemElements = screen.getAllByRole("checkbox");
    expect(facetItemElements).toHaveLength(facetItems.length);

    facetItems.forEach((facetItem, index) => {
      const facetItemElement = facetItemElements[index];
      const labelElement = facetItemElement.parentElement?.parentElement;
      expect(labelElement).toHaveTextContent(facetItem.key);
    });
  });

  it("should render checked checkbox for selected facet items", () => {
    render(
      <FacetProvider facets={facets}>
        <FacetCheckboxList facetTitle={facetTitle} facetItems={facetItems} />
      </FacetProvider>,
    );

    const facetItemElements = screen.getAllByRole("checkbox");
    expect(facetItemElements).toHaveLength(facetItems.length);

    expect(facetItemElements[1]).toBeChecked();
  });

  it("should toggle facet when a facet item is clicked", async () => {
    render(
      <FacetProvider facets={facets}>
        <FacetCheckboxList facetTitle={facetTitle} facetItems={facetItems} />
      </FacetProvider>,
    );

    const facetItemElement = screen.getAllByRole("checkbox")[0];
    const label = screen.getByText(facetItems[0].key);
    expect(facetItemElement).not.toBeChecked();
    expect(label).toHaveStyle("font-weight: 400");

    await userEvent.click(facetItemElement);
    expect(facetItemElement).toBeChecked();
    expect(label).toHaveStyle("font-weight: 700");

    await userEvent.click(facetItemElement);
    expect(facetItemElement).not.toBeChecked();
    expect(label).toHaveStyle("font-weight: 400");
  });

  it("should sort the list of facet items by key", async () => {
    render(
      <FacetProvider facets={facets}>
        <FacetCheckboxList facetTitle={facetTitle} facetItems={facetItems} />
      </FacetProvider>,
    );
    const sortAscButton = screen.getAllByTitle("Trier par ordre croissant")[0];
    expect(sortAscButton).toBeInTheDocument();
    await userEvent.click(sortAscButton);
    let labelElements = screen.getAllByText(/Option \d/);
    expect(labelElements[0]).toHaveTextContent("Option 1");
    expect(labelElements[1]).toHaveTextContent("Option 2");
    expect(labelElements[2]).toHaveTextContent("Option 3");

    const sortDescButton = screen.getAllByTitle(
      "Trier par ordre décroissant",
    )[0];
    expect(sortDescButton).toBeInTheDocument();
    await userEvent.click(sortDescButton);
    labelElements = screen.getAllByText(/Option \d/);
    expect(labelElements[0]).toHaveTextContent("Option 3");
    expect(labelElements[1]).toHaveTextContent("Option 2");
    expect(labelElements[2]).toHaveTextContent("Option 1");
  });

  it("should sort the list of facet items by docCount", async () => {
    render(
      <FacetProvider facets={facets}>
        <FacetCheckboxList facetTitle={facetTitle} facetItems={facetItems} />
      </FacetProvider>,
    );
    const sortAscButton = screen.getAllByTitle("Trier par ordre croissant")[1];
    expect(sortAscButton).toBeInTheDocument();
    await userEvent.click(sortAscButton);
    let labelElements = screen.getAllByText(/Option \d/);
    expect(labelElements[0]).toHaveTextContent("Option 3");
    expect(labelElements[1]).toHaveTextContent("Option 2");
    expect(labelElements[2]).toHaveTextContent("Option 1");

    const sortDescButton = screen.getAllByTitle(
      "Trier par ordre décroissant",
    )[1];
    expect(sortDescButton).toBeInTheDocument();
    await userEvent.click(sortDescButton);
    labelElements = screen.getAllByText(/Option \d/);
    expect(labelElements[0]).toHaveTextContent("Option 1");
    expect(labelElements[1]).toHaveTextContent("Option 2");
    expect(labelElements[2]).toHaveTextContent("Option 3");
  });

  it("should filter the list with the autocomplete input", async () => {
    render(
      <FacetProvider facets={facets}>
        <FacetCheckboxList facetTitle={facetTitle} facetItems={facetItems} />
      </FacetProvider>,
    );
    const autocomplete = screen.getByLabelText(/rechercher/i);
    await userEvent.type(autocomplete, "2");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    let labelElements = screen.getAllByText(/Option \d/);
    expect(labelElements).toHaveLength(1);
    expect(labelElements[0]).toHaveTextContent("Option 2");

    const clearButton = screen.getByLabelText("Vider");
    await userEvent.click(clearButton);
    labelElements = screen.getAllByText(/Option \d/);
    expect(labelElements).toHaveLength(3);
  });
});
