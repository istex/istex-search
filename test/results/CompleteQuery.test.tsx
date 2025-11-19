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

  it("truncates the displayed query when it's too long", () => {
    const queryString = Array(100).fill("hello").join("");
    render(<CompleteQuery />, { queryString });

    const query = screen.getByRole("code");

    expect(query.innerHTML.length).toBeLessThan(queryString.length);
  });
});
