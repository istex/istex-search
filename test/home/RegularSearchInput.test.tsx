import { useRouter } from "next-intl/client";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import RegularSearchInput from "@/app/[locale]/components/SearchSection/RegularSearchInput";
import SearchInput from "@/app/[locale]/components/SearchSection/SearchInput";
import { examples } from "@/config";

describe("RegularSearchInput", () => {
  async function search(queryString?: string) {
    const renderResult = render(
      <SearchInput switchAssistedSearch={() => {}} />,
    );

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "RECHERCHER" });

    if (queryString != null) {
      await userEvent.type(input, queryString);
    }

    await userEvent.click(button);

    return renderResult;
  }

  beforeEach(jest.resetAllMocks);

  it("goes to the results page with the query string in the URL when clicking the search button", async () => {
    const router = useRouter();
    const queryString = "hello";

    await search(queryString);

    expect(router.push).toBeCalledWith(`/results?q=${queryString}`);
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
    expect(router.push).toBeCalledWith(`/results?q=${queryString}`);
  });

  it("doesn't go to the results page when the input is empty and displays an error", async () => {
    const router = useRouter();
    const inputId = "regular-search-input";
    const helperTextId = `${inputId}-helper-text`;
    const { container } = await search();
    const invalidInput = container.querySelector(`#${inputId}`);
    const helperText = container.querySelector(`#${helperTextId}`);

    expect(invalidInput).toHaveAttribute("aria-invalid", "true");
    expect(invalidInput).toHaveAttribute("aria-describedby", helperTextId);
    expect(helperText).toBeInTheDocument();
    expect(router.push).not.toBeCalled();
  });

  it("initializes the input based on the query string in the URL", () => {
    const queryString = "hello";
    render(<SearchInput switchAssistedSearch={() => {}} />, { queryString });

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue(queryString);
  });

  it("fills the input and goes to the results page when clicking on an example", async () => {
    const router = useRouter();
    render(<SearchInput switchAssistedSearch={() => {}} />);
    const firstExample = screen.getByRole("button", {
      name: "Réchauffement climatique",
    });
    await userEvent.click(firstExample);
    const input = screen.getByRole("textbox");

    expect(input).not.toHaveValue("");
    expect(router.push).toBeCalled();
  });

  it("should render the entire examples list", () => {
    render(
      <RegularSearchInput
        searchBar={() => {
          return <></>;
        }}
        goToResultsPage={() => {}}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(
      Object.keys(examples).length,
    );
  });

  it("should display a spinner when loading", () => {
    render(<SearchInput switchAssistedSearch={() => {}} loading />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
