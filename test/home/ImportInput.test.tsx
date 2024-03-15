import {
  customRender as render,
  screen,
  userEvent,
  waitFor,
} from "../test-utils";
import ImportInput from "@/app/[locale]/components/SearchSection/ImportInput";
import { supportedIdTypes } from "@/config";
import { useRouter } from "@/i18n/navigation";
import { buildQueryStringFromIds } from "@/lib/queryIds";

describe("ImportInput", () => {
  afterEach(jest.resetAllMocks);

  it("should go to the results page when submitting the form with valid IDs", async () => {
    const router = useRouter();
    const ids = [
      "ark:/67375/NVC-Z7G9LN4W-1",
      "ark:/67375/NVC-Z7GF9ML4-0",
      "ark:/67375/NVC-Z7GHR58X-4",
    ];
    const queryString = buildQueryStringFromIds(supportedIdTypes[1], ids);
    render(<ImportInput />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Rechercher" });
    await userEvent.type(input, ids.join("\n"));
    await userEvent.click(button);

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({
        q: queryString,
      }).toString()}`,
    );
  }, 10_000);

  it("should initialize the input when an ID query string is in the URL", () => {
    const ids = ["ark:/67375/NVC-Z7G9LN4W-1", "ark:/67375/NVC-Z7GF9ML4-0"];
    const queryString = buildQueryStringFromIds(supportedIdTypes[1], ids);
    render(<ImportInput />, { queryString });

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue(ids.join("\n"));
  });

  it("should not initialize the input when a non-ID query string is in the URL", () => {
    const queryString = "hello";
    render(<ImportInput />, { queryString });

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue("");
  });

  it("should display an error when trying to submit to form when the input is empty", async () => {
    const router = useRouter();
    render(<ImportInput />);

    const button = screen.getByRole("button", { name: "Rechercher" });
    await userEvent.click(button);
    const alert = screen.queryByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("should display an error when some IDs have syntax errors", async () => {
    const ids = [
      "ark:/67375/NVC-Z7G9LN4W-1",
      "ark:/67375/NVC-Z7GF9ML4-", // missing last character
    ];
    render(<ImportInput />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Rechercher" });
    await userEvent.type(input, ids.join("\n"));
    await userEvent.click(button);
    const alert = screen.queryByRole("alert");

    expect(alert).toBeInTheDocument();
  }, 10_000);

  it("should go to the results page when uploading a valid .corpus file", async () => {
    const router = useRouter();
    const ids = ["ark:/67375/NVC-Z7G9LN4W-1", "ark:/67375/NVC-Z7GF9ML4-0"];
    const queryString = buildQueryStringFromIds(supportedIdTypes[1], ids);
    const corpusFileContent = `[ISTEX]\n${ids.map((id) => `ark ${id}`).join("\n")}`;
    const corpusFile = new File([corpusFileContent], "file.corpus");
    render(<ImportInput />);

    const fileInput = screen.getByTestId("corpus-file-input");
    await userEvent.upload(fileInput, corpusFile);

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({
        q: queryString,
      }).toString()}`,
    );
  });

  it("should display an error when uploading an invalid .corpus file", async () => {
    const ids = [
      "ark:/67375/NVC-Z7G9LN4W-1",
      "ark:/67375/NVC-Z7GF9ML4-", // missing last character
    ];
    const corpusFileContent = `[ISTEX]\n${ids.map((id) => `ark ${id}`).join("\n")}`;
    const corpusFile = new File([corpusFileContent], "file.corpus");
    render(<ImportInput />);

    const fileInput = screen.getByTestId("corpus-file-input");
    await userEvent.upload(fileInput, corpusFile);
    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });
});
