import { useRouter } from "next-intl/client";
import RegularSearchInput from "./RegularSearchInput";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "@/test-utils";

describe("RegularSearchInput", () => {
  it("goes to the results page with the query string in the URL when clicking the search button", async () => {
    render(<RegularSearchInput />);

    const router = useRouter();
    const queryString = "hello";
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button");
    await userEvent.type(input, queryString);
    await userEvent.click(button);

    expect(router.push).toBeCalledWith(`/results?q=${queryString}`);
  });

  it("initializes the input based on the query string in the URL", () => {
    const queryString = "hello";
    mockSearchParams({
      q: queryString,
    });
    render(<RegularSearchInput />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue(queryString);
  });
});
