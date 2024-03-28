import type { ComponentProps } from "react";
import {
  mockPathname,
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../../test-utils";
import AssistedSearchInput from "@/app/[locale]/components/SearchSection/AssistedSearch/AssistedSearchInput";
import ExpertSearchInput from "@/app/[locale]/components/SearchSection/AssistedSearch/ExpertSearchInput";
import { useRouter } from "@/i18n/navigation";
import type { AST } from "@/lib/assistedSearch/ast";

describe("AssistedSearchInput", () => {
  it("goes to the results page when clicking on the search button while the form is complete", async () => {
    const router = useRouter();
    render(<AssistedSearchInput />);

    await selectField();
    await selectComparator();
    await selectValue();
    await search();

    expect(router.push).toHaveBeenCalled();
  }, 30_000);

  it("fills the inputs based on the AST in the URL", () => {
    renderAssistedSearchInput(true);

    const fieldInput = getFieldInput();
    const comparatorInput = getComparatorInput();
    const valueInput = getValueInput();

    expect(fieldInput).toHaveValue("Résumé");
    expect(comparatorInput).toHaveValue("contient");
    expect(valueInput).toHaveValue("hello");
  });

  it("renders the query panel when on the results page", () => {
    renderAssistedSearchInput();

    const queryPanel = getQueryPanel();
    const assistedEditButton = getAssistedEditButton();
    const expertEditButton = getExpertEditButton();

    expect(queryPanel).toBeInTheDocument();
    expect(assistedEditButton).toBeInTheDocument();
    expect(expertEditButton).toBeInTheDocument();
  });

  it("displays the assistant form and removes the assisted edit button when clicking on the assisted edit button", async () => {
    renderAssistedSearchInput();

    const assistedEditButton = getAssistedEditButton();
    await userEvent.click(assistedEditButton);

    expect(assistedEditButton).not.toBeInTheDocument();

    const group = screen.getByTestId("group");

    expect(group).toBeInTheDocument();
  });

  it("displays the expert edit input and removes the query panel when clicking on the expert edit button", async () => {
    renderAssistedSearchInput();

    const queryPanel = getQueryPanel();
    await goToExpertMode();

    expect(queryPanel).not.toBeInTheDocument();

    const expertInput = getExpertInput();
    const goBackButton = getGoBackButton();
    const validateButton = getValidateButton();

    expect(expertInput).toBeInTheDocument();
    expect(goBackButton).toBeInTheDocument();
    expect(validateButton).toBeInTheDocument();
  });

  it("initializes the expert input with the correct query string", async () => {
    renderAssistedSearchInput();

    await goToExpertMode();

    const expertInput = getExpertInput();

    expect(expertInput).toHaveValue('abstract:"hello"');
  });

  it("displays the query panel again when clicking on the go back button while being in expert mode", async () => {
    renderAssistedSearchInput();

    await goToExpertMode();

    const goBackButton = getGoBackButton();
    const expertInput = getExpertInput();
    await userEvent.click(goBackButton);
    const queryPanel = getQueryPanel();

    expect(queryPanel).toBeInTheDocument();
    expect(expertInput).not.toBeInTheDocument();
  });

  it("displays the confirm modal when clicking on the validate button while being in expert mode", async () => {
    renderAssistedSearchInput();

    await goToExpertMode();

    const validateButton = getValidateButton();
    await userEvent.click(validateButton);

    const confirmModal = screen.getByRole("dialog");
    expect(confirmModal).toBeInTheDocument();
  });

  it("calls onSubmit when clicking confirm in the confirm modal", async () => {
    const onSubmit = jest.fn();
    renderConfirmModal({ onSubmit });

    const confirmButton = screen.getByRole("button", { name: "Confirmer" });
    await userEvent.click(confirmButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("closes the modal when clicking cancel in the confirm modal", async () => {
    const setModalOpen = jest.fn();
    renderConfirmModal({ setModalOpen });

    const cancelButton = screen.getByRole("button", { name: "Annuler" });
    await userEvent.click(cancelButton);

    expect(setModalOpen).toHaveBeenCalledWith(false);
  });
});

function renderAssistedSearchInput(onHomePage: boolean = false) {
  const ast: AST = [
    {
      root: true,
      nodeType: "group",
      nodes: [
        {
          id: 0,
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "hello",
          comparator: "contains",
        },
      ],
    },
  ];

  mockSearchParams({
    ast: btoa(JSON.stringify(ast)),
  });

  if (!onHomePage) {
    mockPathname("/results");
  }

  render(<AssistedSearchInput />);
}

function renderConfirmModal({
  setModalOpen,
  onSubmit,
}: Partial<
  Pick<ComponentProps<typeof ExpertSearchInput>, "setModalOpen" | "onSubmit">
>) {
  render(
    <ExpertSearchInput
      queryString=""
      setQueryString={() => {}}
      errorMessage=""
      setErrorMessage={() => {}}
      modalOpen
      setModalOpen={setModalOpen ?? (() => {})}
      onSubmit={onSubmit ?? (() => {})}
      hide={() => {}}
    />,
  );
}

function getQueryPanel() {
  return screen.getByTestId("query-panel");
}

function getAssistedEditButton() {
  return screen.getByRole("button", {
    name: "Édition assistée",
  });
}

function getExpertEditButton() {
  return screen.getByRole("button", {
    name: "Édition experte",
  });
}

function getExpertInput() {
  return screen.getByRole("textbox");
}

function getGoBackButton() {
  return screen.getByTestId("go-back-button");
}

function getValidateButton() {
  return screen.getByRole("button", {
    name: "Valider vos modifications",
  });
}

function getFieldInput() {
  return screen.getByRole("combobox", { name: "Champ" });
}

function getComparatorInput() {
  return screen.getByRole("combobox", { name: "Comparateur" });
}

function getValueInput() {
  return screen.getByRole("combobox", { name: "Valeur" });
}

async function selectField() {
  const fieldInput = getFieldInput();
  await userEvent.click(fieldInput);
  await userEvent.keyboard("Affiliations d'auteur{ArrowDown}{Enter}");
}

async function selectComparator() {
  const comparatorInput = getComparatorInput();
  await userEvent.click(comparatorInput);
  await userEvent.keyboard("contient{ArrowDown}{Enter}");
}

async function selectValue() {
  const valueInput = getValueInput();
  await userEvent.click(valueInput);
  await userEvent.keyboard("CNRS");
}

async function search() {
  const searchButton = screen.getByRole("button", { name: "Rechercher" });
  await userEvent.click(searchButton);
}

async function goToExpertMode() {
  const expertEditButton = getExpertEditButton();
  await userEvent.click(expertEditButton);
}
