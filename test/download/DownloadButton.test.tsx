import {
  mockSearchParams,
  customRender as render,
  screen,
} from "../test-utils";
import DownloadButton from "@/app/[locale]/results/Download/DownloadButton";

describe("DownloadButton (download modal)", () => {
  it("disables the button when the query string is missing", () => {
    testButtonState(
      {
        extract: "metadata[json]",
        size: "3",
      },
      false,
    );
  });

  it("disables the button when the query string is an empty string", () => {
    testButtonState(
      {
        q: "",
        extract: "metadata[json]",
        size: "3",
      },
      false,
    );
  });

  it("disables the button when no formats are selected", () => {
    testButtonState(
      {
        q: "hello",
        size: "3",
      },
      false,
    );
  });

  it("disables the button when there is a syntax error in the extract params", () => {
    testButtonState(
      {
        q: "hello",
        extract: "foobar",
        size: "3",
      },
      false,
    );
  });

  it("disables the button when the size is missing", () => {
    testButtonState(
      {
        q: "hello",
        extract: "metadata[json]",
      },
      false,
    );
  });

  it("disables the button when the size is set to 0", () => {
    testButtonState(
      {
        q: "hello",
        extract: "metadata[json]",
        size: "0",
      },
      false,
    );
  });

  it("enables the button when the form is complete", () => {
    testButtonState(
      {
        q: "hello",
        extract: "metadata[json]",
        size: "3",
      },
      true,
    );
  });
});

function testButtonState(
  searchParams: Parameters<typeof mockSearchParams>[0],
  enabled: boolean,
) {
  mockSearchParams(searchParams);
  render(<DownloadButton />, { queryString: searchParams.q });

  const button = screen.getByRole("button");

  if (enabled) {
    expect(button).toBeEnabled();
  } else {
    expect(button).toBeDisabled();
  }
}
