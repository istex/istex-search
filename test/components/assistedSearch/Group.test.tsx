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
    expect(
      screen.getByRole("button", { name: "Corpus éditeur" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
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
    expect(
      screen.getByRole("button", { name: "Mots-clés teeft" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Titre revue ou monographie" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "contient" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("elsevier");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("rings of Saturn");
    expect(screen.getByRole("button", { name: "AND" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(13);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });
});
