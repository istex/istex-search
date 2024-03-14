import type { ComponentProps } from "react";
import { customRender as render, screen, userEvent } from "../../test-utils";
import Group from "@/app/[locale]/components/SearchSection/AssistedSearch/Group";
import {
  getDefaultOperatorNode,
  getEmptyFieldNode,
  getEmptyGroupNode,
  type FieldNode,
  type Node,
  type OperatorNode,
} from "@/lib/assistedSearch/ast";

const node = getEmptyGroupNode();

describe("Group", () => {
  it("doesn't render the border when root", () => {
    const group = renderGroup({ root: true });

    expect(getComputedStyle(group).border).toBe("");
  });

  it("renders the border when not root", async () => {
    const group = renderGroup({ root: false });

    expect(getComputedStyle(group).borderWidth).toBe("1px");
  });

  it("doesn't render the hover background color when root", async () => {
    const group = renderGroup({ root: true });
    await userEvent.hover(group);

    expect(getComputedStyle(group).backgroundColor).toBe("");
  });

  it("renders the hover background color when not root", async () => {
    const group = renderGroup({ root: false });
    await userEvent.hover(group);

    expect(getComputedStyle(group).backgroundColor).not.toBe("");
  });

  it("renders the reset button when root", () => {
    renderGroup({ root: true });
    const resetButton = screen.queryByRole("button", { name: "Réinitialiser" });
    const removeButton = screen.queryByRole("button", { name: "Supprimer" });

    expect(resetButton).toBeInTheDocument();
    expect(removeButton).toBeNull();
  });

  it("renders the remove button when not root", () => {
    renderGroup({ root: false });
    const resetButton = screen.queryByRole("button", { name: "Réinitialiser" });
    const removeButton = screen.queryByRole("button", { name: "Supprimer" });

    expect(resetButton).toBeNull();
    expect(removeButton).toBeInTheDocument();
  });

  it("adds the default operator and an empty rule when clicking on the add rule button", async () => {
    const setChildNodes = jest.fn();
    renderGroup({ setChildNodes });

    const addRuleButton = screen.getByRole("button", {
      name: "Ajouter une règle",
    });
    await userEvent.click(addRuleButton);

    expect(setChildNodes).toHaveBeenCalledWith([
      ...node.nodes,
      getDefaultOperatorNode(),
      getEmptyFieldNode(),
    ]);
  });

  it("adds the default operator and an empty group when clicking on the add group button", async () => {
    const setChildNodes = jest.fn();
    renderGroup({ setChildNodes });

    const addGroupButton = screen.getByRole("button", {
      name: "Ajouter un groupe",
    });
    await userEvent.click(addGroupButton);

    expect(setChildNodes).toHaveBeenCalledWith([
      ...node.nodes,
      getDefaultOperatorNode(),
      getEmptyGroupNode(),
    ]);
  });

  it("calls remove when clicking on the reset button", async () => {
    const remove = jest.fn();
    renderGroup({ root: true, remove });

    const resetButton = screen.getByRole("button", { name: "Réinitialiser" });
    await userEvent.click(resetButton);

    expect(remove).toHaveBeenCalled();
  });

  it("calls remove when clicking on the remove button", async () => {
    const remove = jest.fn();
    renderGroup({ root: false, remove });

    const resetButton = screen.getByRole("button", { name: "Supprimer" });
    await userEvent.click(resetButton);

    expect(remove).toHaveBeenCalled();
  });

  it("removes the first rule and the following operator when clicking on its remove button", async () => {
    const setChildNodes = jest.fn();
    const firstFieldNode: FieldNode = {
      ...getEmptyFieldNode(),
      id: 0,
      value: "firstNode",
    };
    const firstOperatorNode: OperatorNode = {
      ...getDefaultOperatorNode(),
      id: 1,
      value: "OR",
    };
    const secondFieldNode: FieldNode = {
      ...getEmptyFieldNode(),
      id: 2,
      value: "secondNode",
    };
    const childNodes: Node[] = [
      firstFieldNode,
      firstOperatorNode,
      secondFieldNode,
    ];
    renderGroup({ childNodes, setChildNodes });

    const firstRuleRemoveButton =
      screen.getAllByTestId("remove-rule-button")[0];
    await userEvent.click(firstRuleRemoveButton);

    expect(setChildNodes).toHaveBeenCalledWith([secondFieldNode]);
  });

  it("removes the second rule and the preceding operator when clicking on its remove button", async () => {
    const setChildNodes = jest.fn();
    const firstFieldNode: FieldNode = {
      ...getEmptyFieldNode(),
      id: 0,
      value: "firstNode",
    };
    const firstOperatorNode: OperatorNode = {
      ...getDefaultOperatorNode(),
      id: 1,
      value: "OR",
    };
    const secondFieldNode: FieldNode = {
      ...getEmptyFieldNode(),
      id: 2,
      value: "secondNode",
    };
    const childNodes: Node[] = [
      firstFieldNode,
      firstOperatorNode,
      secondFieldNode,
    ];
    renderGroup({ childNodes, setChildNodes });

    const secondRuleRemoveButton =
      screen.getAllByTestId("remove-rule-button")[1];
    await userEvent.click(secondRuleRemoveButton);

    expect(setChildNodes).toHaveBeenCalledWith([firstFieldNode]);
  });

  it("resets the group to just one empty rule when removing the last rule from a group", async () => {
    const setChildNodes = jest.fn();
    const firstFieldNode: FieldNode = {
      ...getEmptyFieldNode(),
      value: "firstNode",
    };
    const childNodes: Node[] = [firstFieldNode];
    renderGroup({ childNodes, setChildNodes });

    const ruleRemoveButton = screen.getAllByTestId("remove-rule-button")[0];
    await userEvent.click(ruleRemoveButton);

    expect(setChildNodes).toHaveBeenCalledWith([getEmptyFieldNode()]);
  });

  // Make Math.random always return the same value to avoid mismatches in node IDs when testing
  beforeAll(() => {
    jest.spyOn(Math, "random").mockReturnValue(0);
  });
  afterAll(() => {
    jest.spyOn(Math, "random").mockRestore();
  });
});

function renderGroup({
  root,
  displayErrors,
  childNodes,
  setChildNodes,
  remove,
}: Partial<ComponentProps<typeof Group>>) {
  render(
    <Group
      root={root}
      displayErrors={displayErrors ?? false}
      childNodes={childNodes ?? node.nodes}
      setChildNodes={setChildNodes ?? (() => {})}
      remove={remove ?? (() => {})}
    />,
  );

  return screen.getByTestId("group");
}
