import { customRender as render, screen } from "../test-utils";
import CompleteQuery from "@/app/[locale]/results/components/CompleteQuery";
import { createCompleteQuery } from "@/lib/istexApi";

describe("CompleteQuery", () => {
  it("displays the correct query", () => {
    const queryString = "hello";
    render(<CompleteQuery />, { queryString });

    const query = screen.getByRole("code");

    expect(query).toHaveTextContent(createCompleteQuery(queryString));
  });
});
