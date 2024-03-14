import { customRender as render, screen, userEvent } from "../../test-utils";
import Rule from "@/app/[locale]/components/SearchSection/AssistedSearch/Rule";
import { getComparators } from "@/app/[locale]/components/SearchSection/AssistedSearch/RuleUtils";
import {
  textComparators,
  numberComparators,
  booleanComparators,
  getEmptyFieldNode,
  type FieldNode,
} from "@/lib/assistedSearch/ast";
import { unique } from "@/lib/utils";

jest.setTimeout(15_000);

describe("Rule", () => {
  const partialNode = getEmptyFieldNode();
  const node: FieldNode = {
    ...partialNode,
    partial: false,
  };
  const emptyValueNode: FieldNode = {
    ...node,
    value: "",
  };

  it("doesn't fill the inputs when the node is partial", () => {
    renderRule(partialNode);

    const fieldInput = getFieldInput();
    const comparatorInput = getComparatorInput();
    const valueInput = getValueInput();

    expect(fieldInput).not.toHaveValue();
    expect(comparatorInput).not.toHaveValue();
    expect(valueInput).not.toHaveValue();
  });

  it("fills the inputs when the node is not partial", () => {
    renderRule(node);

    const fieldInput = getFieldInput();
    const comparatorInput = getComparatorInput();
    const valueInput = getValueInput();

    expect(fieldInput).toHaveValue("Résumé");
    expect(comparatorInput).toHaveValue("contient");
    expect(valueInput).toHaveValue("hello");
  });

  it("displays errors when at least one input is empty", () => {
    renderRule(emptyValueNode, true);

    const valueInput = getValueInput();
    expect(valueInput).toHaveAttribute("aria-invalid", "true");
  });

  it("resets the comparator when selecting a new field that doesn't support it", async () => {
    renderRule(partialNode);

    const comparatorInput = getComparatorInput();
    await selectBetweenComparator();
    await selectTextField();

    expect(comparatorInput).not.toHaveValue();
  });

  it("renders two value inputs (min and max) when using the between operator", async () => {
    renderRule(partialNode);

    const valueInput = getValueInput();
    await selectNumberField();
    expect(valueInput).toBeInTheDocument();

    await selectBetweenComparator();

    expect(valueInput).not.toBeInTheDocument();
    expect(getMinInput()).toBeInTheDocument();
    expect(getMaxInput()).toBeInTheDocument();
  });

  it("renders a boolean value input when selecting a boolean field", async () => {
    renderRule(partialNode);

    const valueInput = getValueInput();
    expect(valueInput).toBeInTheDocument();

    await selectBooleanField();

    expect(valueInput).not.toBeInTheDocument();
    expect(getBooleanInput()).toBeInTheDocument();
  });

  it("calls remove when clicking on the remove button", async () => {
    const remove = jest.fn();
    renderRule(node, false, remove);

    const removeButton = getRemoveButton();
    await userEvent.click(removeButton);

    expect(remove).toHaveBeenCalled();
  });
});

describe("RuleUtils", () => {
  describe("getComparators", () => {
    it("returns the text comparators when giving a text field type", () => {
      expect(getComparators("text")).toBe(textComparators);
    });

    it("returns the number comparators when giving a number field type", () => {
      expect(getComparators("number")).toBe(numberComparators);
    });

    it("returns the boolean comparators when giving a number field type", () => {
      expect(getComparators("boolean")).toBe(booleanComparators);
    });

    it("returns all the comparators when giving no field type", () => {
      expect(getComparators(null)).toEqual(
        unique([
          ...textComparators,
          ...numberComparators,
          ...booleanComparators,
        ]),
      );
    });
  });
});

function renderRule(
  node: FieldNode,
  displayErrors?: boolean,
  remove?: jest.Func,
) {
  render(
    <Rule
      displayErrors={displayErrors ?? false}
      node={node}
      setNode={() => {}}
      remove={remove ?? (() => {})}
    />,
  );
}

function getFieldInput() {
  return screen.getByRole("combobox", { name: "Champ" });
}

function getComparatorInput() {
  return screen.getByRole("combobox", { name: "Comparateur" });
}

function getValueInput() {
  return screen.getByRole("textbox", { name: "Valeur" });
}

function getMinInput() {
  return screen.getByRole("spinbutton", { name: "Valeur min" });
}

function getMaxInput() {
  return screen.getByRole("spinbutton", { name: "Valeur max" });
}

function getBooleanInput() {
  return screen.getByRole("combobox", { name: "Valeur" });
}

function getRemoveButton() {
  return screen.getByTestId("remove-rule-button");
}

async function selectTextField() {
  const fieldInput = getFieldInput();
  await userEvent.click(fieldInput);
  await userEvent.keyboard("Affiliations d'auteur{ArrowDown}{Enter}");
}

async function selectNumberField() {
  const fieldInput = getFieldInput();
  await userEvent.click(fieldInput);
  await userEvent.keyboard("Date de publication{ArrowDown}{Enter}");
}

async function selectBooleanField() {
  const fieldInput = getFieldInput();
  await userEvent.click(fieldInput);
  await userEvent.keyboard("PDF textuel{ArrowDown}{Enter}");
}

async function selectBetweenComparator() {
  const comparatorInput = getComparatorInput();
  await userEvent.click(comparatorInput);
  await userEvent.keyboard("est entre{ArrowDown}{Enter}");
}
