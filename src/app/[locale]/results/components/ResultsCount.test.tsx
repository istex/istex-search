import ResultsCount from "./ResultsCount";
import { customRender as render, screen } from "@/test-utils";

describe("ResultsCount", () => {
  it("displays the results count", () => {
    const count = 3;
    render(<ResultsCount count={count} />);

    const countLabel = screen.getByText(count);

    expect(countLabel).toBeInTheDocument();
  });
});
