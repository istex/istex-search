import DelayedCircularProgress from "@/components/DelayedCircularProgress";
import { customRender as render, screen } from "../test-utils";

describe("DelayedCircularProgress", () => {
  it("displays a circular progress by default", () => {
    render(<DelayedCircularProgress />);
    expect(screen.queryByRole("progressbar")).toBeInTheDocument();
  });

  it("displays a circular progress when isLoading is true", () => {
    render(<DelayedCircularProgress isLoading />);
    expect(screen.queryByRole("progressbar")).toBeInTheDocument();
  });

  it("doesn't display a circular progress when isLoading is false", () => {
    render(<DelayedCircularProgress isLoading={false} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
