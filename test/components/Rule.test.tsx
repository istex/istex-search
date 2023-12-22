import { customRender as render, screen } from "../test-utils";
import Rule from "@/app/[locale]/components/SearchSection/AssistedSearch/Rule";

describe("Rule", () => {
  it("should render an empty Rule", () => {
    render(<Rule node={{ nodeType: "node" }} />);
    expect(screen.getByLabelText("Champ")).toBeInTheDocument();
    expect(screen.getByLabelText("Comparateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Valeur")).toBeInTheDocument();
    expect(screen.getByTestId("CancelIcon")).toBeInTheDocument();
  });
  it("should render a simple Rule", () => {
    const node = {
      nodeType: "node",
      fieldType: "text",
      field: "corpusName",
      value: "elsevier",
      comparator: "equal",
    };
    render(<Rule node={node} />);
    expect(
      screen.getByRole("button", { name: "corpusName" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("elsevier");
  });
  it("should render a Rule with a boolean fieldType", () => {
    const node = {
      nodeType: "node",
      fieldType: "boolean",
      field: "hasFormula",
      value: "true",
      comparator: "equal",
    };
    render(<Rule node={node} />);
    expect(
      screen.getByRole("button", { name: "hasFormula" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "égal" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "vrai" })).toBeInTheDocument();
  });
  it("should render a Rule with a range fieldType", () => {
    const node = {
      nodeType: "node",
      fieldType: "range",
      field: "publicationDate",
      min: "2010",
      max: "2020",
      comparator: "isBetween",
    };
    render(<Rule node={node} />);
    expect(
      screen.getByRole("button", { name: "publicationDate" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "entre" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("2010");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("2020");
  });
});
