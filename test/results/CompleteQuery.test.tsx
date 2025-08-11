import {
  mockIsSecureContext,
  customRender as render,
  restoreIsSecureContext,
  screen,
  userEvent,
} from "../test-utils";
import CompleteQuery from "@/app/[locale]/results/components/CompleteQuery";
import { createCompleteQuery } from "@/lib/istexApi";

describe("CompleteQuery", () => {
  it("displays the correct query", () => {
    const queryString = "hello";
    render(<CompleteQuery />, { queryString });

    const query = screen.getByRole("code");

    expect(query).toHaveTextContent(createCompleteQuery(queryString));
  });

  it("truncates the displayed query when it's too long", () => {
    const queryString = Array(100).fill("hello").join("");
    render(<CompleteQuery />, { queryString });

    const query = screen.getByRole("code");

    expect(query.innerHTML.length).toBeLessThan(queryString.length);
  });

  it("copies the query to the clipboard when clicking on the copy button", async () => {
    const queryString = "hello";
    render(<CompleteQuery />, { queryString });

    mockIsSecureContext(true);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    restoreIsSecureContext();

    const clipboardContent = await navigator.clipboard.readText();
    const snackbar = screen.getByRole("alert");

    expect(clipboardContent).toBe(queryString);
    expect(snackbar).toHaveClass("MuiAlert-colorSuccess");
  });

  it("displays a warning when trying to copy to the clipboard while in an insecure context", async () => {
    const queryString = "hello";
    render(<CompleteQuery />, { queryString });

    mockIsSecureContext(false);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    restoreIsSecureContext();

    const clipboardContent = await navigator.clipboard.readText();
    const snackbar = screen.getByRole("alert");

    expect(clipboardContent).toBe("");
    expect(snackbar).toHaveClass("MuiAlert-colorWarning");
  });
});
