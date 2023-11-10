import { customRender as render } from "../test-utils";
import ErrorCard from "@/components/ErrorCard";

describe("ErrorCard", () => {
  it("renders an appropriate error message when given a supported error code", () => {
    testMessageRender("Une erreur de syntaxe a été détectée", 400);
  });

  it("renders the default error message when given an unsupported error code", () => {
    testMessageRender("Une erreur est survenue", 666);
  });

  it("renders the default error message when given no error code", () => {
    testMessageRender("Une erreur est survenue");
  });
});

function testMessageRender(message: string, code?: number) {
  const { container } = render(<ErrorCard code={code} />);

  const text = container.querySelector("p");

  expect(text).toHaveTextContent(message);
}
