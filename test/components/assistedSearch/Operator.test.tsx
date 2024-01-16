import { useState } from "react";
import { customRender as render, screen, userEvent } from "../../test-utils";
import Operator from "@/app/[locale]/components/SearchSection/AssistedSearch/Operator";

describe("Operator", () => {
  it("should render an AND Operator", () => {
    render(
      <Operator
        operator="AND"
        setEntry={() => {}}
        precedentNodeHeight={0}
        nextNodeHeight={0}
      />,
    );
    expect(screen.getByRole("button", { name: "AND" })).toBeInTheDocument();
  });
  it("should render an OR Operator", () => {
    render(
      <Operator
        operator="OR"
        setEntry={() => {}}
        precedentNodeHeight={0}
        nextNodeHeight={0}
      />,
    );
    expect(screen.getByRole("button", { name: "OR" })).toBeInTheDocument();
  });
  it("should toggle operator", async () => {
    const ToggleOperatorTest = () => {
      const [operator, setOperator] = useState<"AND" | "OR">("AND");
      return (
        <Operator
          operator={operator}
          setEntry={(newOperator: "AND" | "OR") => {
            setOperator(newOperator);
          }}
          precedentNodeHeight={0}
          nextNodeHeight={0}
        />
      );
    };
    render(<ToggleOperatorTest />);
    await userEvent.click(screen.getByRole("button", { name: "AND" }));

    expect(screen.getAllByRole("option").length).toBe(2);
    await userEvent.click(screen.getByRole("option", { name: "OR" }));

    expect(screen.getByRole("button", { name: "OR" })).toBeInTheDocument();
  });
});
