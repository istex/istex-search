import { customRender as render, screen, userEvent } from "../../test-utils";
import Operator from "@/app/[locale]/components/SearchSection/AssistedSearch/Operator";
import {
  getDefaultOperatorNode,
  getEmptyFieldNode,
  type OperatorNode,
} from "@/lib/assistedSearch/ast";

const operatorNode = getDefaultOperatorNode();
const fieldNode = getEmptyFieldNode();

describe("Operator", () => {
  it("displays the correct operator", () => {
    renderOperator();

    const dropdown = getDropdown();
    expect(dropdown).toHaveTextContent(operatorNode.value);
  });

  it("changes the operator when selecting another option in the dropdown", async () => {
    const setNode = jest.fn();
    renderOperator(setNode);

    await selectNextOperator();

    const newNode: OperatorNode = {
      ...operatorNode,
      value: "OR",
    };
    expect(setNode).toHaveBeenCalledWith(newNode);
  });
});

function renderOperator(setNode?: jest.Func) {
  render(
    <Operator
      node={operatorNode}
      setNode={setNode ?? (() => {})}
      previousNode={fieldNode}
      nextNode={fieldNode}
      first={false}
      last={false}
    />,
  );
}

function getDropdown() {
  return screen.getByRole("combobox");
}

async function selectNextOperator() {
  const dropdown = getDropdown();
  await userEvent.click(dropdown);
  await userEvent.keyboard("{ArrowDown}{Enter}");
}
