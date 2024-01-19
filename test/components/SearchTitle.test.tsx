import { useRouter } from "next-intl/client";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import SearchTitle from "@/app/[locale]/components/SearchSection/SearchTitle";
import { SEARCH_MODE_ADVANCED, SEARCH_MODE_ASSISTED } from "@/config";

describe("SearchTitle", () => {
  it("should render the SearchTitle component", () => {
    render(<SearchTitle title="title" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "title",
    );
    expect(screen.getByTestId("regular-search-button")).toBeInTheDocument();
    expect(screen.getByTestId("assisted-search-button")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-search-button")).toBeInTheDocument();
  });
  it("should render the SearchTitle component on regular mode", () => {
    render(<SearchTitle title="title" />);
    expect(
      getComputedStyle(screen.getByTestId("regular-search-button")).border,
    ).toBe("1px solid #458ca5");
    expect(
      getComputedStyle(screen.getByTestId("assisted-search-button")).border,
    ).toBe("0px");
    expect(
      getComputedStyle(screen.getByTestId("advanced-search-button")).border,
    ).toBe("0px");
  });
  it("should render the SearchTitle component on assisted mode", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ASSISTED,
    });
    render(<SearchTitle title="title" />);
    expect(
      getComputedStyle(screen.getByTestId("regular-search-button")).border,
    ).toBe("0px");
    expect(
      getComputedStyle(screen.getByTestId("assisted-search-button")).border,
    ).toBe("1px solid #458ca5");
    expect(
      getComputedStyle(screen.getByTestId("advanced-search-button")).border,
    ).toBe("0px");
  });
  it("should render the SearchTitle component on advanced mode", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ADVANCED,
    });
    render(<SearchTitle title="title" />);
    expect(
      getComputedStyle(screen.getByTestId("regular-search-button")).border,
    ).toBe("0px");
    expect(
      getComputedStyle(screen.getByTestId("assisted-search-button")).border,
    ).toBe("0px");
    expect(
      getComputedStyle(screen.getByTestId("advanced-search-button")).border,
    ).toBe("1px solid #458ca5");
  });
  it("should switch search mode to assisted", async () => {
    const router = useRouter();
    render(<SearchTitle title="title" />);
    await userEvent.click(screen.getByTestId("assisted-search-button"));
    expect(router.push).toHaveBeenCalledWith("/?searchMode=assisted");
  });
  it("should switch search mode to advanced", async () => {
    const router = useRouter();
    render(<SearchTitle title="title" />);
    await userEvent.click(screen.getByTestId("advanced-search-button"));
    expect(router.push).toHaveBeenCalledWith("/?searchMode=advanced");
  });
  it("should switch search mode to regular", async () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ADVANCED,
    });
    const router = useRouter();
    render(<SearchTitle title="title" />);
    await userEvent.click(screen.getByTestId("regular-search-button"));
    expect(router.push).toHaveBeenCalledWith("/?");
  });
});
