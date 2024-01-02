import { customRender as render, screen, userEvent } from "../test-utils";
import AssistedSearchInput from "@/app/[locale]/components/SearchSection/AssistedSearchInput";

describe("AssistedSearchInput", () => {
  it("should render the AssistedSearchInput component", () => {
    render(<AssistedSearchInput switchAssistedSearch={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Collez ici votre objet JSON à transformer en recherche assistée",
    );
    expect(
      screen.getByRole("button", { name: "Transformer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Utiliser le template" }),
    ).toBeInTheDocument();
  });
  it("should render the AssistedSearchInput component with error", async () => {
    const { container } = render(
      <AssistedSearchInput switchAssistedSearch={() => {}} />,
    );
    const textbox = screen.getByRole("textbox");
    const ast = "non-json-string";
    await userEvent.type(textbox, ast);
    const submitButton = screen.getByRole("button", { name: "Transformer" });
    await userEvent.click(submitButton);
    expect(screen.getByText("Erreur de parsing JSON")).toBeInTheDocument();
    expect(
      container.querySelectorAll(".MuiOutlinedInput-notchedOutline"),
    ).toHaveLength(1);
  });
  it("should render the AssistedSearchInput component with a valid json", async () => {
    const { container } = render(
      <AssistedSearchInput switchAssistedSearch={() => {}} />,
    );
    const textbox = screen.getByRole("textbox");
    const ast =
      '[[ {{ "nodeType": "node", "fieldType": "text", "field": "corpusName", "value": "elsevier", "comparator": "equal" } ]';
    await userEvent.type(textbox, ast);
    const submitButton = screen.getByRole("button", { name: "Transformer" });
    await userEvent.click(submitButton);
    expect(
      screen.queryByText("Erreur de parsing JSON"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll(".MuiOutlinedInput-notchedOutline"),
    ).toHaveLength(4);
  });
  it("sould render the AssistedSearchInput component with the template", async () => {
    const { container } = render(
      <AssistedSearchInput switchAssistedSearch={() => {}} />,
    );
    const templateButton = screen.getByRole("button", {
      name: "Utiliser le template",
    });
    await userEvent.click(templateButton);
    expect(
      container.querySelectorAll(".MuiOutlinedInput-notchedOutline"),
    ).toHaveLength(33);
  });
});
