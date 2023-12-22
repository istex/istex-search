import { customRender as render, screen } from "../test-utils";
import Group from "@/app/[locale]/components/SearchSection/AssistedSearch/Group";

describe("Group", () => {
  it("should render an empty Group", () => {
    render(<Group nodes={[]} />);
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
    const nodes = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "corpusName",
        value: "elsevier",
        comparator: "equal",
      },
    ];
    render(<Group nodes={nodes} />);
    expect(
      screen.getByRole("button", { name: "corpusName" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("elsevier");
  });

  it("should render a Group with other nested Groups", () => {
    const nodes = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "corpusName",
        value: "elsevier",
        comparator: "equal",
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
            field: "abstract",
            value: "rings of Saturn",
            comparator: "contains",
          },
        ],
      },
    ];
    render(<Group nodes={nodes} />);
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
      screen.getByRole("button", { name: "corpusName" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "abstract" }),
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
