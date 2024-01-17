import { useState } from "react";
import { customRender as render, screen, userEvent } from "../../test-utils";
import Rule from "@/app/[locale]/components/SearchSection/AssistedSearch/Rule";
import type {
  BooleanNode,
  RangeNode,
  TextComparator,
  TextNode,
} from "@/lib/queryAst";

describe("Rule", () => {
  const RuleComponentTest = () => {
    const [comparator, setComparator] = useState<TextComparator>("");
    const [field, setField] = useState("");
    const node: TextNode = {
      nodeType: "node",
      fieldType: "text",
      value: "",
      comparator,
      field,
    };

    return (
      <Rule
        node={node}
        displayError={false}
        setField={(newField) => {
          setField(newField);
        }}
        setComparator={(newComparator) => {
          setComparator(newComparator as TextComparator);
        }}
        setValue={() => {}}
        setRangeValue={() => {}}
        remove={() => {}}
      />
    );
  };

  it("should render an empty Rule", () => {
    render(<RuleComponentTest />);
    expect(screen.getByLabelText("Champ")).toBeInTheDocument();
    expect(screen.getByLabelText("Comparateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Valeur")).toBeInTheDocument();
    expect(screen.getByTestId("CancelIcon")).toBeInTheDocument();
  });
  it("should render a simple Rule", () => {
    const node: TextNode = {
      nodeType: "node",
      fieldType: "text",
      field: "corpusName",
      value: "elsevier",
      comparator: "equals",
    };
    render(
      <Rule
        node={node}
        displayError={false}
        setField={() => {}}
        setComparator={() => {}}
        setValue={() => {}}
        setRangeValue={() => {}}
        remove={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Corpus éditeur" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("elsevier");
  });
  it("should render a Rule with a boolean fieldType", () => {
    const node: BooleanNode = {
      nodeType: "node",
      fieldType: "boolean",
      field: "hasFormula",
      value: true,
      comparator: "equals",
    };
    render(
      <Rule
        node={node}
        displayError={false}
        setField={() => {}}
        setComparator={() => {}}
        setValue={() => {}}
        setRangeValue={() => {}}
        remove={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Contient une formule" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "vrai" })).toBeInTheDocument();
  });
  it("should render a Rule with a range fieldType", () => {
    const node: RangeNode = {
      nodeType: "node",
      fieldType: "range",
      field: "publicationDate",
      min: 2010,
      max: 2020,
      comparator: "between",
    };
    render(
      <Rule
        node={node}
        displayError={false}
        setField={() => {}}
        setComparator={() => {}}
        setValue={() => {}}
        setRangeValue={() => {}}
        remove={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Date de publication" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "est entre" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("2010");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("2020");
  });
  it("should toggle field", async () => {
    render(<RuleComponentTest />);
    await userEvent.click(screen.getByLabelText("Champ"));
    expect(screen.getAllByRole("option").length).toBe(59);
    await userEvent.click(screen.getAllByRole("option")[4]);
    expect(
      screen.getByRole("button", { name: "Noms d’auteur" }),
    ).toBeInTheDocument();
  });
  it("should toggle comparator", async () => {
    render(<RuleComponentTest />);
    await userEvent.click(screen.getByLabelText("Comparateur"));
    expect(screen.getAllByRole("option").length).toBe(8);
    await userEvent.click(screen.getAllByRole("option")[4]);
    expect(
      screen.getByRole("button", { name: "commence par" }),
    ).toBeInTheDocument();
  });
});
