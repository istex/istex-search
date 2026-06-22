import {
  type ActionResult,
  getQueryStringFromPrompt,
} from "@/app/[locale]/components/SearchSection/NaturalSearch/actions";
import PromptModal from "@/app/[locale]/components/SearchSection/NaturalSearch/PromptModal";
import { useRouter } from "@/i18n/routing";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
  waitFor,
} from "../test-utils";

jest.mock(
  "@/app/[locale]/components/SearchSection/NaturalSearch/actions",
  () => ({
    getQueryStringFromPrompt: jest.fn(),
  }),
);

describe("PromptModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("goes to the results page with the prompt converted into a query string when submitting the form", async () => {
    const router = useRouter();
    const prompt = "I want a corpus";
    const queryString = "some query";
    const result: ActionResult = {
      success: true,
      value: queryString,
    };
    await submitForm(prompt, result);

    expect(getQueryStringFromPrompt).toHaveBeenCalledWith(prompt);
    expect(router.push).toHaveBeenCalledWith(
      `/results?${new URLSearchParams({ prompt, q: queryString }).toString()}`,
    );
  });

  it("displays an error when submitting the form with an empty prompt", async () => {
    const router = useRouter();
    const prompt = "";
    await submitForm(prompt);

    expect(getQueryStringFromPrompt).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();

    await waitFor(() => {
      const input = getInput();
      const alert = getErrorAlert();

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(alert).toBeInTheDocument();
    });
  });

  it("displays an error message when converted the prompt into a query string fails", async () => {
    const router = useRouter();
    const prompt = "I want a corpus";
    const result: ActionResult = {
      success: false,
      errorInfo: { name: "TextLuceneError" },
    };
    await submitForm(prompt, result);

    expect(getQueryStringFromPrompt).toHaveBeenCalledWith(prompt);
    expect(router.push).not.toHaveBeenCalled();

    await waitFor(() => {
      const input = getInput();
      const alert = getErrorAlert();

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(alert).toBeInTheDocument();
    });
  });

  it("initializes the input based on the prompt in the URL", () => {
    const prompt = "I want a corpus";
    mockSearchParams({ prompt });
    render(<PromptModal open onClose={() => {}} />);

    const input = getInput();

    expect(input).toHaveValue(prompt);
  });
});

async function submitForm(prompt: string, result?: ActionResult) {
  const finalResult = result ?? { success: true, value: "some query" };
  (getQueryStringFromPrompt as jest.Mock).mockResolvedValue(finalResult);
  render(<PromptModal open onClose={() => {}} />);

  const input = getInput();
  const button = getSubmitButton();

  if (prompt !== "") {
    await userEvent.type(input, prompt);
  }

  await userEvent.click(button);
}

function getInput() {
  return screen.getByRole("textbox");
}

function getSubmitButton() {
  return screen.getByRole("button", { name: "Générer la requête" });
}

function getErrorAlert() {
  // We can't simply use .getByRole("alert") because there's already an info alert for the note
  return screen.getByTestId("ErrorOutlineIcon");
}
