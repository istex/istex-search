import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";
import FilterTags from "@/app/[locale]/results/components/Filters/FilterTags";
import { useRouter } from "@/i18n/navigation";
import { getDefaultOperatorNode, type AST } from "@/lib/ast";

describe("FilterTags", () => {
  it("renders a tag for each value of each active fitler", () => {
    const filters = generateFilters({
      corpusName: ["elsevier", "wiley"],
      publicationDate: 2010,
    });
    renderFilterTags(filters);

    const buttons = screen.getAllByRole("button");

    // buttons[0] is the tooltip
    expect(buttons[1]).toHaveTextContent(/elsevier/);
    expect(buttons[2]).toHaveTextContent(/wiley/);
    expect(buttons[3]).toHaveTextContent(/2010/);
  });

  it("removes the field node from the group when clicking on the remove button", async () => {
    const router = useRouter();
    const filters = generateFilters({ corpusName: ["elsevier", "wiley"] });
    renderFilterTags(filters);

    await userEvent.click(getRemoveCorpusNameButton());

    const expectedFilters = generateFilters({ corpusName: ["wiley"] });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the field node and its preceding NOT operator when present from the group when clicking on the remove button", async () => {
    const router = useRouter();
    const filters = generateFilters({
      corpusName: { values: ["elsevier", "wiley"], not: true },
    });
    renderFilterTags(filters);

    await userEvent.click(getRemoveNotCorpusNameButton());

    const expectedFilters = generateFilters({ corpusName: ["wiley"] });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the whole group when removing the last child node", async () => {
    const router = useRouter();
    const filters = generateFilters({
      corpusName: ["elsevier"],
      publicationDate: 2010,
    });
    renderFilterTags(filters);

    await userEvent.click(getRemoveCorpusNameButton());

    const expectedFilters = generateFilters({ publicationDate: 2010 });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the field node and the preceding operator for field nodes when clicking on the remove button", async () => {
    const router = useRouter();
    const filters = generateFilters({
      corpusName: ["elsevier"],
      publicationDate: 2010,
    });
    renderFilterTags(filters);

    await userEvent.click(getRemovePublicationDateButton());

    const expectedFilters = generateFilters({ corpusName: ["elsevier"] });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("adds a NOT operator before the node within a group when not already present when clicking on the tag", async () => {
    const router = useRouter();
    const filters = generateFilters({ corpusName: ["elsevier"] });
    renderFilterTags(filters);

    await userEvent.click(getCorpusNameButton());

    const expectedFilters = generateFilters({
      corpusName: { values: ["elsevier"], not: true },
    });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("removes the NOT operator before the node within a group when already present when clicking on the tag", async () => {
    const router = useRouter();
    const filters = generateFilters({
      corpusName: { values: ["elsevier"], not: true },
    });
    renderFilterTags(filters);

    await userEvent.click(getCorpusNameButton());

    const expectedFilters = generateFilters({ corpusName: ["elsevier"] });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("turns the preceding operator to NOT when set to AND for field nodes when clicking on the tag", async () => {
    const router = useRouter();
    const filters = generateFilters({ publicationDate: 2010 });
    renderFilterTags(filters);

    await userEvent.click(getPublicationDateButton());

    const expectedFilters = generateFilters({
      publicationDate: { value: 2010, not: true },
    });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  it("turns the preceding operator to AND when set to NOT for field nodes when clicking on the tag", async () => {
    const router = useRouter();
    const filters = generateFilters({
      publicationDate: { value: 2010, not: true },
    });
    renderFilterTags(filters);

    await userEvent.click(getPublicationDateButton());

    const expectedFilters = generateFilters({ publicationDate: 2010 });

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ filters: btoa(JSON.stringify(expectedFilters)) }).toString()}`,
    );
  });

  // Make Math.random always return the same value to avoid mismatches in node IDs when testing
  beforeAll(() => {
    jest.spyOn(Math, "random").mockReturnValue(0);
  });
  afterAll(() => {
    jest.spyOn(Math, "random").mockRestore();
  });
});

function getCorpusNameButton() {
  return screen.getByRole("button", { name: /elsevier/ });
}

function getRemoveCorpusNameButton() {
  return screen.getByRole("img", {
    name: "Supprimer le filtre « elsevier »",
  });
}

function getRemoveNotCorpusNameButton() {
  return screen.getByRole("img", {
    name: "Supprimer le filtre « NOT elsevier »",
  });
}

function getPublicationDateButton() {
  return screen.getByRole("button", { name: /2010/ });
}

function getRemovePublicationDateButton() {
  return screen.getByRole("img", {
    name: "Supprimer le filtre « 2010 »",
  });
}

function generateFilters(options: {
  corpusName?: string[] | { values: string[]; not: boolean };
  publicationDate?: number | { value: number; not: boolean };
}) {
  const filters: AST = [];

  if (options.corpusName != null) {
    const values = Array.isArray(options.corpusName)
      ? options.corpusName.map((v) => v)
      : options.corpusName.values;
    const not = Array.isArray(options.corpusName)
      ? false
      : options.corpusName.not;
    const nodes: AST = values.map((corpusName) => ({
      id: Math.random(),
      nodeType: "node",
      fieldType: "text",
      field: "corpusName",
      value: corpusName,
      comparator: "equals",
    }));
    if (not) {
      nodes.unshift({ id: Math.random(), nodeType: "operator", value: "NOT" });
    }

    filters.push(getDefaultOperatorNode(), {
      id: 1,
      nodeType: "group",
      nodes,
    });
  }

  if (options.publicationDate != null) {
    const publicationDate =
      typeof options.publicationDate === "number"
        ? options.publicationDate
        : options.publicationDate.value;
    const not =
      typeof options.publicationDate === "number"
        ? false
        : options.publicationDate.not;

    filters.push(
      { id: Math.random(), nodeType: "operator", value: not ? "NOT" : "AND" },
      {
        id: 2,
        nodeType: "node",
        fieldType: "number",
        field: "publicationDate",
        value: publicationDate,
        comparator: "equals",
      },
    );
  }

  return filters;
}

function renderFilterTags(filters: AST) {
  mockSearchParams({
    filters: btoa(JSON.stringify(filters)),
  });

  render(<FilterTags />);
}
