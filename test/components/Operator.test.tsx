import { customRender as render, screen } from "../test-utils";
import Operator from "@/app/[locale]/components/SearchSection/AssistedSearch/Operator";

describe("Operator", () => {
  it("should render an AND Operator", () => {
    render(<Operator operator="AND" />);
    expect(screen.getByRole("button", { name: "AND" })).toBeInTheDocument();
  });
  it("should render an OR Operator", () => {
    render(<Operator operator="OR" />);
    expect(screen.getByRole("button", { name: "OR" })).toBeInTheDocument();
  });
});
