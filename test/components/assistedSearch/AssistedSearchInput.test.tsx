import { customRender as render, screen, userEvent } from "../../test-utils";
import AssistedSearchInput from "@/app/[locale]/components/SearchSection/AssistedSearchInput";

describe("AssistedSearchInput", () => {
  it("should render an empty AssistedSearchInput", () => {
    render(
      <AssistedSearchInput
        goToResultsPage={() => {}}
        switchAssistedSearch={() => {}}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Assistant à la construction de requête",
    );
    expect(
      screen.getByRole("button", { name: "Ajouter une règle" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ajouter un groupe" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Réinitialiser" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "RECHERCHER" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "< recherche simple" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Champ")).toBeInTheDocument();
    expect(screen.getByLabelText("Comparateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Valeur")).toBeInTheDocument();
    expect(screen.getByTestId("CancelIcon")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Champ")).toHaveLength(1);
    expect(screen.getAllByLabelText("Comparateur")).toHaveLength(1);
    expect(screen.getAllByLabelText("Valeur")).toHaveLength(1);
    expect(screen.getAllByTestId("CancelIcon")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "AND" })).toBeNull();
  });
  it("should create a Rule (and an Operator)", async () => {
    render(
      <AssistedSearchInput
        goToResultsPage={() => {}}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ajouter une règle" }),
    );
    expect(
      screen.getByRole("button", { name: "Réinitialiser" }),
    ).toBeInTheDocument();
    expect(screen.getAllByLabelText("Champ")).toHaveLength(2);
    expect(screen.getAllByLabelText("Comparateur")).toHaveLength(2);
    expect(screen.getAllByLabelText("Valeur")).toHaveLength(2);
    expect(screen.getAllByTestId("CancelIcon")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "AND" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "AND" })).toHaveLength(1);
  });
  it("should remove a Rule (and an Operator)", async () => {
    render(
      <AssistedSearchInput
        goToResultsPage={() => {}}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ajouter une règle" }),
    );
    await userEvent.click(screen.getAllByTestId("CancelIcon")[0]);
    expect(screen.queryByRole("button", { name: "Réinitialiser" })).toBeNull();
    expect(screen.getAllByLabelText("Champ")).toHaveLength(1);
    expect(screen.getAllByLabelText("Comparateur")).toHaveLength(1);
    expect(screen.getAllByLabelText("Valeur")).toHaveLength(1);
    expect(screen.getAllByTestId("CancelIcon")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "AND" })).toBeNull();
  });
  it("should create a Group (and an Operator)", async () => {
    render(
      <AssistedSearchInput
        goToResultsPage={() => {}}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ajouter un groupe" }),
    );
    expect(screen.getByRole("button", { name: "AND" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "AND" })).toHaveLength(1);

    expect(
      screen.getByRole("button", { name: "Réinitialiser" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Ajouter une règle" }),
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: "Ajouter un groupe" }),
    ).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Supprimer" }),
    ).toBeInTheDocument();

    expect(screen.getAllByLabelText("Champ")).toHaveLength(2);
    expect(screen.getAllByLabelText("Comparateur")).toHaveLength(2);
    expect(screen.getAllByLabelText("Valeur")).toHaveLength(2);
    expect(screen.getAllByTestId("CancelIcon")).toHaveLength(3); // 2 for the rules + 1 for the group
  });
  it("should remove a Group (and an Operator)", async () => {
    render(
      <AssistedSearchInput
        goToResultsPage={() => {}}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ajouter un groupe" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(screen.queryByRole("button", { name: "AND" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Réinitialiser" })).toBeNull();
    expect(
      screen.getAllByRole("button", { name: "Ajouter une règle" }),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("button", { name: "Ajouter un groupe" }),
    ).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Supprimer" })).toBeNull();
    expect(screen.getAllByLabelText("Champ")).toHaveLength(1);
    expect(screen.getAllByLabelText("Comparateur")).toHaveLength(1);
    expect(screen.getAllByLabelText("Valeur")).toHaveLength(1);
    expect(screen.getAllByTestId("CancelIcon")).toHaveLength(1);
  });
  it("should reset", async () => {
    render(
      <AssistedSearchInput
        goToResultsPage={() => {}}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ajouter un groupe" }),
    );
    await userEvent.click(screen.getAllByLabelText("Champ")[0]);
    await userEvent.click(screen.getByRole("option", { name: "abstract" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Réinitialiser" }),
    );

    expect(screen.queryByRole("button", { name: "Réinitialiser" })).toBeNull();
    expect(screen.getAllByLabelText("Champ")).toHaveLength(1);
    expect(screen.getAllByLabelText("Comparateur")).toHaveLength(1);
    expect(screen.getAllByLabelText("Valeur")).toHaveLength(1);
    expect(screen.getAllByTestId("CancelIcon")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "AND" })).toBeNull();
  });
  it("shouldn't search if a field is null", async () => {
    const mockSearch = jest.fn();
    render(
      <AssistedSearchInput
        goToResultsPage={mockSearch}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.type(screen.getByLabelText("Valeur"), "test");
    await userEvent.click(screen.getByRole("button", { name: "RECHERCHER" }));
    expect(mockSearch).not.toBeCalled();
    expect(
      screen.getByText("Veuillez remplir tous les champs"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Champ")).toHaveClass("Mui-error");
    expect(screen.getByLabelText("Comparateur")).toHaveClass("Mui-error");
    expect(screen.getByRole("textbox")).not.toHaveClass("Mui-error");
  });
  it("should search the right query", async () => {
    const mockSearch = jest.fn();
    render(
      <AssistedSearchInput
        goToResultsPage={mockSearch}
        switchAssistedSearch={() => {}}
      />,
    );
    await userEvent.click(screen.getByLabelText("Champ"));
    await userEvent.click(screen.getByRole("option", { name: "abstract" }));
    await userEvent.click(screen.getByLabelText("Comparateur"));
    await userEvent.click(screen.getByRole("option", { name: "égal" }));
    await userEvent.type(screen.getByLabelText("Valeur"), "test");

    await userEvent.click(screen.getByRole("button", { name: "RECHERCHER" }));
    expect(mockSearch).toHaveBeenCalled();
    expect(mockSearch).toHaveBeenCalledWith(
      'abstract.raw:"test"',
      expect.any(Function),
    );

    expect(screen.queryByText("Veuillez remplir tous les champs")).toBeNull();
    expect(screen.getByRole("button", { name: "abstract" })).not.toHaveClass(
      "Mui-error",
    );
    expect(screen.getByRole("button", { name: "égal" })).not.toHaveClass(
      "Mui-error",
    );
    expect(screen.getByRole("textbox")).not.toHaveClass("Mui-error");
  });
});
