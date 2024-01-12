import { customRender as render, screen } from "../test-utils";
import Rule from "@/app/[locale]/components/SearchSection/AssistedSearch/Rule";
import type { BooleanNode, RangeNode, TextNode } from "@/lib/queryAst";

describe("Rule", () => {
  it("should render an empty Rule", () => {
    const node: TextNode = {
      nodeType: "node",
      fieldType: "text",
      value: "",
      comparator: "",
      field: "",
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
      screen.getByRole("button", { name: "corpusName" }),
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
      screen.getByRole("button", { name: "hasFormula" }),
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
      screen.getByRole("button", { name: "publicationDate" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "est entre" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("2010");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("2020");
  });
  it("should display an empty boolean field on hasFormula selection", () => {
    /* TODO */
  });
  it("should display an empty range field on publicationDate selection", () => {
    /* TODO */
  });
  it("should display an text range field on corpusName selection", () => {
    /* TODO */
  });
});
