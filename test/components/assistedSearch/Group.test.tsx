import { customRender as render, screen } from "../../test-utils";
import Group from "@/app/[locale]/components/SearchSection/AssistedSearch/Group";
import type { AST } from "@/lib/queryAst";

describe("Group", () => {
  it("should render an empty Group", () => {
    render(
      <Group
        nodes={[]}
        displayError={false}
        updateData={() => {}}
        remove={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Ajouter une règle" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ajouter un groupe" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Supprimer" }),
    ).toBeInTheDocument();
  });

  it("should render a simple Group", () => {
    const nodes: AST = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "corpusName",
        value: "elsevier",
        comparator: "equals",
      },
    ];
    render(
      <Group
        nodes={nodes}
        displayError={false}
        updateData={() => {}}
        remove={() => {}}
      />,
    );

    expect(screen.getAllByRole("combobox")[0]).toHaveValue("Corpus éditeur");
    expect(screen.getAllByRole("combobox")[1]).toHaveTextContent("égal");
    expect(screen.getByRole("textbox")).toHaveValue("elsevier");
  });

  it("should render a Group with other nested Groups", () => {
    const nodes: AST = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "keywords.teeft",
        value: "elsevier",
        comparator: "equals",
      },
      {
        nodeType: "operator",
        value: "AND",
      },
      {
        nodeType: "group",
        nodes: [
          {
            nodeType: "node",
            fieldType: "text",
            field: "host.title",
            value: "rings of Saturn",
            comparator: "contains",
          },
        ],
      },
    ];
    render(
      <Group
        nodes={nodes}
        displayError={false}
        updateData={() => {}}
        remove={() => {}}
      />,
    );

    expect(
      screen.getAllByRole("button", { name: "Ajouter une règle" }),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: "Ajouter un groupe" }),
    ).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Supprimer" })).toHaveLength(
      2,
    );

    const dropdowns = screen.getAllByRole("combobox");
    const textboxes = screen.getAllByRole("textbox");

    expect(dropdowns[0]).toHaveValue("Mots-clés teeft");
    expect(dropdowns[1]).toHaveTextContent("égal");
    expect(textboxes[0]).toHaveValue("elsevier");

    expect(dropdowns[2]).toHaveTextContent("AND");

    expect(dropdowns[3]).toHaveValue("Titre revue ou monographie");
    expect(dropdowns[4]).toHaveTextContent("contient");
    expect(textboxes[1]).toHaveValue("rings of Saturn");
  });
});
