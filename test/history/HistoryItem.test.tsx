import { Table, TableBody } from "@mui/material";
import HistoryItem from "@/app/[locale]/components/History/HistoryItem";
import type { HistoryEntry } from "@/contexts/HistoryContext";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { useRouter } from "@/i18n/routing";
import { useDownload, useShare } from "@/lib/hooks";
import SearchParams from "@/lib/SearchParams";
import { formatDate } from "@/lib/utils";
import { customRender as render, screen, userEvent } from "../test-utils";

const defaultParams = {
  q: "hello",
  size: "3",
  extract: "metadata[json]",
};
const defaultEntry: HistoryEntry = {
  date: Date.now(),
  searchParams: new SearchParams(defaultParams),
};

describe("HistoryItem", () => {
  it("displays the history entry elements properly", () => {
    renderHistoryItem();

    // We don't test the query string here because getting it from the search params
    // is asynchronous and is not ready on the first render

    const index = screen.getByRole("cell", { name: "1" });
    const formats = screen.getByRole("cell", { name: defaultParams.extract });
    const size = screen.getByRole("cell", { name: defaultParams.size });
    const date = screen.getByRole("cell", {
      name: formatDate(defaultEntry.date, "fr-FR"),
    });

    expect(index).toBeInTheDocument();
    expect(formats).toBeInTheDocument();
    expect(size).toBeInTheDocument();
    expect(date).toBeInTheDocument();
  });

  it("disables the download and delete actions when isCurrentRequest is true", () => {
    renderHistoryItem({ isCurrentRequest: true });

    const editButton = getEditButton();
    const shareButton = getShareButton();
    const downloadButton = getDownloadButton();
    const deleteButton = getDeleteButton();

    expect(editButton).toBeEnabled();
    expect(shareButton).toBeEnabled();
    expect(downloadButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it("goes to the results page and sets the current request with the correct search params when clicking on the edit button", async () => {
    const router = useRouter();
    const history = useHistoryContext();
    const onClose = jest.fn();
    renderHistoryItem({ onClose });

    const editButton = getEditButton();
    await userEvent.click(editButton);

    expect(router.push).toHaveBeenCalledWith(
      "/results?q=hello&size=3&extract=metadata%5Bjson%5D",
    );
    expect(history.populateCurrentRequest).toHaveBeenCalledWith(defaultEntry);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls the share hook when clicking on the share button", async () => {
    const share = useShare();
    renderHistoryItem();

    const shareButton = getShareButton();
    await userEvent.click(shareButton);

    expect(share).toHaveBeenCalledWith(
      "corpus",
      expect.objectContaining({
        search: "?q=hello&size=3&extract=metadata%5Bjson%5D",
      }),
    );
  });

  it("calls the download hook when clicking on the download button", async () => {
    const download = useDownload();
    renderHistoryItem();

    const downloadButton = getDownloadButton();
    await userEvent.click(downloadButton);

    expect(download).toHaveBeenCalledWith(
      expect.objectContaining({
        search:
          "?q=hello&size=3&rankBy=qualityOverRelevance&sid=istex-search&extract=metadata%5Bjson%5D",
      }),
    );
  });

  it("calls history.delete when clicking on the delete button", async () => {
    const history = useHistoryContext();
    const index = 2;
    renderHistoryItem({ index });

    const deleteButton = getDeleteButton();
    await userEvent.click(deleteButton);

    expect(history.delete).toHaveBeenCalledWith(index);
  });
});

function renderHistoryItem(
  props: Partial<React.ComponentProps<typeof HistoryItem>> = {},
) {
  const { entry = defaultEntry, onClose = jest.fn(), ...rest } = props;

  return render(
    <Table>
      <TableBody>
        <HistoryItem entry={entry} onClose={onClose} {...rest} />
      </TableBody>
    </Table>,
  );
}

function getEditButton() {
  return screen.getByRole("button", {
    name: "Éditer cette requête",
  });
}

function getShareButton() {
  return screen.getByRole("button", {
    name: "Partager cette requête",
  });
}

function getDownloadButton() {
  return screen.getByRole("button", {
    name: "Télécharger le corpus correspondant à cette requête",
  });
}

function getDeleteButton() {
  return screen.getByRole("button", {
    name: "Supprimer cette requête",
  });
}
