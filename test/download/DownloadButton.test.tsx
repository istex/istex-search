import DownloadButton from "@/app/[locale]/results/components/Download/DownloadButton";
import type { IstexApiResponse } from "@/lib/istexApi";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";

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

  it("closes the download modal and opens the waiting modal when clicking the button", async () => {
    const queryString = "hello";
    const closeModal = jest.fn();
    const openWaitingModal = jest.fn();
    mockSearchParams({
      q: queryString,
      extract: "metadata[json]",
      size: "3",
    });
    render(
      <DownloadButton
        closeModal={closeModal}
        openWaitingModal={openWaitingModal}
      />,
      { queryString, results: generateResults(3) },
    );

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(closeModal).toHaveBeenCalled();
    expect(openWaitingModal).toHaveBeenCalled();
  });
});

function testButtonState(
  searchParams: Parameters<typeof mockSearchParams>[0],
  enabled: boolean,
) {
  mockSearchParams(searchParams);
  render(
    <DownloadButton closeModal={jest.fn()} openWaitingModal={jest.fn()} />,
    {
      queryString: searchParams.q,
      results:
        searchParams.size != null
          ? generateResults(Number(searchParams.size))
          : undefined,
    },
  );

  const button = screen.getByRole("button");

  if (enabled) {
    expect(button).toBeEnabled();
  } else {
    expect(button).toBeDisabled();
  }
}

function generateResults(resultCount: number): IstexApiResponse {
  return {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
}
