import HistoryModal from "@/app/[locale]/components/History/HistoryModal";
import {
  type HistoryEntry,
  useHistoryContext,
} from "@/contexts/HistoryContext";
import SearchParams from "@/lib/SearchParams";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("HistoryModal", () => {
  const history = useHistoryContext();
  const fakeEntry: HistoryEntry = {
    date: Date.now(),
    searchParams: new SearchParams({ q: "hello" }),
  };

  (history.get as jest.Mock).mockReturnValue([fakeEntry]);
  (history.getCurrentRequest as jest.Mock).mockReturnValue(fakeEntry);

  it("renders the modal when open is true", () => {
    render(<HistoryModal open onClose={jest.fn()} />);

    const modal = screen.getByRole("dialog");

    expect(modal).toBeInTheDocument();
  });

  it("doesn't render the modal when open is false", () => {
    render(<HistoryModal open={false} onClose={jest.fn()} />);

    const modal = screen.queryByRole("dialog");

    expect(modal).not.toBeInTheDocument();
  });

  it("renders the current request and the history in two separate tables", () => {
    render(<HistoryModal open onClose={jest.fn()} />);

    const currentRequestTitle = screen.getByRole("heading", {
      level: 3,
      name: "Recherche en cours",
    });
    const historyTitle = screen.getByRole("heading", {
      level: 3,
      name: "Derniers téléchargements",
    });

    expect(currentRequestTitle).toBeInTheDocument();
    expect(historyTitle).toBeInTheDocument();
  });

  it("opens the confirm modal when clicking on the clear history button", async () => {
    render(<HistoryModal open onClose={jest.fn()} />);

    const clearButton = getClearButton();
    await userEvent.click(clearButton);
    const confirmModalTitle = screen.getByRole("heading", {
      name: "Confirmation",
    });

    expect(confirmModalTitle).toBeInTheDocument();
  });

  it("clears the history when clicking on the delete button in the confirm modal", async () => {
    render(<HistoryModal open onClose={jest.fn()} />);

    const clearButton = getClearButton();
    await userEvent.click(clearButton);
    const deleteButton = getConfirmDeleteButton();
    await userEvent.click(deleteButton);

    expect(history.clear);
  });

  it("disables the clear history button when the history is empty", () => {
    (history.isEmpty as jest.Mock).mockReturnValueOnce(true);
    render(<HistoryModal open onClose={jest.fn()} />);

    const clearButton = getClearButton();
    expect(clearButton).toBeDisabled();
  });

  it("renders a special text instead of the history table when the history is empty", () => {
    (history.isEmpty as jest.Mock).mockReturnValueOnce(true);
    render(<HistoryModal open onClose={jest.fn()} />);

    const emptyHistoryText = screen.getByText("Votre historique est vide.");

    expect(emptyHistoryText).toBeInTheDocument();
  });
});

function getClearButton() {
  return screen.getByRole("button", { name: "Supprimer l'historique" });
}

function getConfirmDeleteButton() {
  return screen.getByRole("button", { name: "Supprimer" });
}
