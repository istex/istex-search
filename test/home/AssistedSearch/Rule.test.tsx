import * as React from "react";
import { customRender as render, screen, userEvent } from "../../test-utils";
import Rule from "@/app/[locale]/components/SearchSection/AssistedSearch/Rule";
import { getComparators } from "@/app/[locale]/components/SearchSection/AssistedSearch/RuleUtils";
import {
  textComparators,
  numberComparators,
  booleanComparators,
  getEmptyFieldNode,
  type FieldNode,
} from "@/lib/ast";
import type { Field } from "@/lib/fields";
import { getPossibleValues } from "@/lib/istexApi";
import { unique } from "@/lib/utils";
import type { PartialExcept } from "@/types/utility";

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

  jest.setTimeout(20_000);

  beforeEach(jest.clearAllMocks);

  it("doesn't fill the inputs when the node is partial", () => {
    renderRule({ node: partialNode });

    const fieldInput = getFieldInput();
    const comparatorInput = getComparatorInput();
    const valueInput = getValueInput();

    expect(fieldInput).not.toHaveValue();
    expect(comparatorInput).not.toHaveValue();
    expect(valueInput).not.toHaveValue();
  });

  it("fills the inputs when the node is not partial", () => {
    renderRule({ node });

    const fieldInput = getFieldInput();
    const comparatorInput = getComparatorInput();
    const valueInput = getValueInput();

    expect(fieldInput).toHaveValue("Résumé");
    expect(comparatorInput).toHaveValue("contient");
    expect(valueInput).toHaveValue(
      "_YOU_SHOULD_NOT_SEE_THIS_MAKE_A_BUG_REPORT_",
    );
  });

  it("displays errors when at least one input is empty", () => {
    renderRule({ displayErrors: true, node: emptyValueNode });

    const valueInput = getValueInput();
    expect(valueInput).toBeInvalid();
  });

  it("resets the comparator and the values when selecting a new field", async () => {
    renderRule({ node });

    const comparatorInput = getComparatorInput();
    const valueInput = getValueInput();
    expect(comparatorInput).toHaveValue("contient");
    expect(valueInput).toHaveValue(node.value);

    await selectTextField();

    expect(comparatorInput).not.toHaveValue();
    expect(valueInput).not.toHaveValue();
  });

  it("resets the values when selecting a new comparator", async () => {
    renderRule({ node });

    const valueInput = getValueInput();
    expect(valueInput).toHaveValue();

    await selectEqualsComparator();
    expect(valueInput).not.toHaveValue();
  });

  it("renders two value inputs (min and max) when using the between operator", async () => {
    renderRule({ node: partialNode });

    const valueInput = getValueInput();
    expect(valueInput).toBeInTheDocument();

    await selectNumberField();
    await selectBetweenComparator();

    expect(valueInput).not.toBeInTheDocument();
    expect(getMinInput()).toBeInTheDocument();
    expect(getMaxInput()).toBeInTheDocument();
  });

  it("renders a boolean value input when selecting a boolean field", async () => {
    renderRule({ node: partialNode });

    await selectBooleanField();

    expect(getBooleanInput()).toBeInTheDocument();
  });

  it("automatically selects the first comparator when only one is available", async () => {
    const setNode = jest.fn();
    renderRule({ node: partialNode, setNode });

    await selectBooleanField();

    expect(getComparatorInput()).toHaveValue("est égal à");
    expect(setNode).toHaveBeenCalledWith(
      expect.objectContaining({ comparator: "equals" }),
    );
  });

  it("gets the possible values when selecting a field that requires fetching values", async () => {
    renderRule({ node: partialNode });

    await selectField("Catégorie Inist");

    expect(getPossibleValues).toHaveBeenCalledWith("categories.inist");
  });

  it("doesn't get the possible values when selecting a field that doesn't require fetching values", async () => {
    renderRule({ node: partialNode });

    await selectField("Résumé");

    expect(getPossibleValues).not.toHaveBeenCalled();
  });

  it("calls remove when clicking on the remove button", async () => {
    const remove = jest.fn();
    renderRule({ node, remove });

    const removeButton = getRemoveButton();
    await userEvent.click(removeButton);

    expect(remove).toHaveBeenCalled();
  });

  it("correctly sets implicit nodes", async () => {
    const setNode = jest.fn();
    renderRule({ node: partialNode, setNode });

    await selectField("Corps du texte sans les métadonnées");

    const { value, ...partialNodeWithoutValue } = partialNode;
    expect(setNode).toHaveBeenCalledWith({
      ...partialNodeWithoutValue,
      field: "fulltext@1",
      implicitNodes: [
        {
          nodeType: "node",
          fieldType: "boolean",
          field: "qualityIndicators.tdmReady",
          value: true,
          comparator: "equals",
        },
      ],
    });
  });

  it("removes the thousand separator and decimal from the value input when using a date field", () => {
    renderRule({
      node: {
        ...node,
        fieldType: "number",
        field: "publicationDate",
        comparator: "between",
        min: 1234.2,
        max: 5678.3,
      },
    });

    const minInput = getMinInput();
    const maxInput = getMaxInput();

    expect(minInput).toHaveValue("1234");
    expect(maxInput).toHaveValue("5678");
  });
});

describe("RuleUtils", () => {
  describe("getComparators", () => {
    it("returns the text comparators when given a text field type", () => {
      const field: Field = {
        name: "abstract",
        type: "text",
      };
      expect(getComparators(field)).toBe(textComparators);
    });

    it("returns the number comparators when given a number field type", () => {
      const field: Field = {
        name: "qualityIndicators.score",
        type: "number",
      };
      expect(getComparators(field)).toBe(numberComparators);
    });

    it("returns the boolean comparators when given a number field type", () => {
      const field: Field = {
        name: "qualityIndicators.tdmReady",
        type: "boolean",
      };
      expect(getComparators(field)).toBe(booleanComparators);
    });

    it("returns the custom comparators when given a field with custom comparators", () => {
      const field: Field = {
        name: "abstract",
        type: "text",
        comparators: ["startsWith"],
      };

      expect(getComparators(field)).toBe(field.comparators);
    });

    it("returns all the comparators when given no field type", () => {
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

function renderRule({
  displayErrors,
  node,
  setNode,
  remove,
}: PartialExcept<React.ComponentProps<typeof Rule>, "node">) {
  render(
    <Rule
      displayErrors={displayErrors ?? false}
      node={{ ...node }}
      setNode={setNode ?? jest.fn()}
      remove={remove ?? jest.fn()}
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
  return screen.getByRole("combobox", { name: "Valeur" });
}

function getMinInput() {
  return screen.getByRole("textbox", { name: "Valeur min" });
}

function getMaxInput() {
  return screen.getByRole("textbox", { name: "Valeur max" });
}

function getBooleanInput() {
  return screen.getByRole("combobox", { name: "Valeur" });
}

function getRemoveButton() {
  return screen.getByTestId("remove-rule-button");
}

async function selectField(fieldName: string) {
  const fieldInput = getFieldInput();
  await userEvent.click(fieldInput);
  await userEvent.keyboard(`${fieldName}{ArrowDown}{Enter}`);
}

async function selectTextField() {
  await selectField("Affiliation d'auteur");
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

async function selectEqualsComparator() {
  const comparatorInput = getComparatorInput();
  await userEvent.click(comparatorInput);
  await userEvent.keyboard("égal{ArrowDown}{Enter}");
}
