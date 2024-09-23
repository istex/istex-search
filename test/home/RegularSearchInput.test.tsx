import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import RegularSearchInput from "@/app/[locale]/components/SearchSection/RegularSearchInput";
import { examples } from "@/config";
import { useRouter } from "@/i18n/navigation";

describe("RegularSearchInput", () => {
  beforeEach(jest.clearAllMocks);

  it("goes to the results page with the query string in the URL when clicking the search button", async () => {
    const router = useRouter();
    const queryString = "hello";

    await search(queryString);

    expect(router.push).toHaveBeenCalledWith(`/results?q=${queryString}`);
  });

  it("resets the size and the page when searching", async () => {
    const router = useRouter();
    const queryString = "hello";
    const size = 3;
    const page = 2;
    mockSearchParams({
      size: size.toString(),
      page: page.toString(),
    });

    await search(queryString);

    // router.push is only called with the queryString, not the size nor the page
    expect(router.push).toHaveBeenCalledWith(`/results?q=${queryString}`);
  });

  it("doesn't go to the results page when the input is empty and displays an error", async () => {
    const router = useRouter();

    await search();

    const alert = screen.queryByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("initializes the input based on the query string in the URL", () => {
    const queryString = "hello";
    render(<RegularSearchInput />, { queryString });

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue(queryString);
  });

  it("fills the input and goes to the results page when clicking on an example", async () => {
    const router = useRouter();
    render(<RegularSearchInput />);

    const firstExample = screen.getByRole("button", {
      name: "Emmanuel Kant",
    });
    const firstExampleQuery = examples[0];
    await userEvent.click(firstExample);

    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ q: firstExampleQuery }).toString()}`,
    );
  });

  it("should render the entire examples list", () => {
    render(<RegularSearchInput />);

    expect(screen.getAllByRole("button")).toHaveLength(
      Object.keys(examples).length + 4,
    ); // +4 for the 3 search modes buttons + the search button
  });
});

async function search(queryString?: string) {
  const renderResult = render(<RegularSearchInput />);

  const input = screen.getByRole("textbox");
  const button = screen.getByRole("button", { name: "Rechercher" });

  if (queryString != null) {
    await userEvent.type(input, queryString);
  }

  await userEvent.click(button);

  return renderResult;
}
