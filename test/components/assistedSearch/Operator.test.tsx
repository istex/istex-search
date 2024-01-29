import { useState } from "react";
import { customRender as render, screen, userEvent } from "../../test-utils";
import Operator from "@/app/[locale]/components/SearchSection/AssistedSearch/Operator";
import type { Operator as OperatorType } from "@/lib/queryAst";

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

    expect(screen.getByRole("combobox")).toHaveTextContent("AND");
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

    expect(screen.getByRole("combobox")).toHaveTextContent("OR");
  });

  it("should toggle operator", async () => {
    const ToggleOperatorTest = () => {
      const [operator, setOperator] = useState<OperatorType>("AND");
      return (
        <Operator
          operator={operator}
          setEntry={setOperator}
          precedentNodeHeight={0}
          nextNodeHeight={0}
        />
      );
    };

    render(<ToggleOperatorTest />);
    await userEvent.click(screen.getByRole("combobox"));

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(2);
    await userEvent.click(options[1]);

    expect(screen.getByRole("combobox")).toHaveTextContent("OR");
  });
});
