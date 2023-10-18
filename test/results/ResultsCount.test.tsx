import { customRender as render, screen } from "../test-utils";
import ResultsCount from "@/app/[locale]/results/components/ResultsCount";

describe("ResultsCount", () => {
  it("displays the results count", () => {
    const count = 3;
    render(<ResultsCount count={count} />);

    const countLabel = screen.getByText(count);

    expect(countLabel).toBeInTheDocument();
  });
});
