import { customRender as render, screen, userEvent } from "../test-utils";
import HistoryModal from "@/app/[locale]/results/History/HistoryModal";
import {
  useHistoryContext,
  type HistoryEntry,
} from "@/contexts/HistoryContext";
import { SearchParams } from "@/lib/useSearchParams";

describe("HistoryModal", () => {
  const history = useHistoryContext();
  const fakeEntry: HistoryEntry = {
    date: Date.now(),
    searchParams: new SearchParams({ q: "hello" }),
  };

  (history.get as jest.Mock).mockReturnValue([fakeEntry]);
  (history.getCurrentRequest as jest.Mock).mockReturnValue(fakeEntry);

  it("renders the modal when open is true", () => {
    render(<HistoryModal open onClose={() => {}} />);

    const modal = screen.getByRole("dialog");

    expect(modal).toBeInTheDocument();
  });

  it("doesn't render the modal when open is false", () => {
    render(<HistoryModal open={false} onClose={() => {}} />);

    const modal = screen.queryByRole("dialog");

    expect(modal).not.toBeInTheDocument();
  });

  it("renders the current request as the first line in the table", () => {
    render(<HistoryModal open onClose={() => {}} />);

    const rows = screen.getAllByRole("row");

    expect(rows[0]).toHaveAccessibleName("Requête courante");
  });

  it("opens the confirm modal when clicking on the clear history button", async () => {
    render(<HistoryModal open onClose={() => {}} />);

    const clearButton = getClearButton();
    await userEvent.click(clearButton);
    const confirmModalTitle = screen.getByRole("heading", {
      name: "Confirmation",
    });

    expect(confirmModalTitle).toBeInTheDocument();
  });

  it("clears the history when clicking on the delete button in the confirm modal", async () => {
    render(<HistoryModal open onClose={() => {}} />);

    const clearButton = getClearButton();
    await userEvent.click(clearButton);
    const deleteButton = getConfirmDeleteButton();
    await userEvent.click(deleteButton);

    expect(history.clear);
  });

  it("disables the clear history button when the history is empty", () => {
    (history.isEmpty as jest.Mock).mockReturnValueOnce(true);
    render(<HistoryModal open onClose={() => {}} />);

    const clearButton = getClearButton();
    expect(clearButton).toBeDisabled();
  });

  it("renders a special text instead of the history table when the history is empty", () => {
    (history.isEmpty as jest.Mock).mockReturnValueOnce(true);
    render(<HistoryModal open onClose={() => {}} />);

    const rows = screen.getAllByRole("row");
    const emptyHistoryText = screen.getByText("Votre historique est vide.");

    expect(emptyHistoryText).toBeInTheDocument();
    expect(rows.length).toBe(1); // Even when the history is empty, the table has at least 1 row => the current request
  });
});

function getClearButton() {
  return screen.getByRole("button", { name: "Supprimer l'historique" });
}

function getConfirmDeleteButton() {
  return screen.getByRole("button", { name: "Supprimer" });
}
