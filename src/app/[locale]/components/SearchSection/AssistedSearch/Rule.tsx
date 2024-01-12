import { useTranslations } from "next-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, MenuItem, Stack, TextField } from "@mui/material";
import {
  textComparators,
  numberComparators,
  type FieldNode,
  booleanComparators,
  rangeComparators,
  type Comparator,
} from "@/lib/queryAst";

const Rule = ({
  node,
  displayError,
  setField,
  setComparator,
  setValue,
  setRangeValue,
  remove,
}: {
  node: FieldNode;
  displayError: boolean;
  setField: (newField: string) => void;
  setComparator: (newComparator: Comparator) => void;
  setValue: (newValue: string | number | boolean | null) => void;
  setRangeValue: ({
    min,
    max,
  }: {
    min?: number | null | "*";
    max?: number | null | "*";
  }) => void;
  remove: () => void;
}) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.AssistedInput.Dropdown",
  );
  const operatorsList = [
    ...textComparators,
    ...numberComparators,
    ...rangeComparators,
    ...booleanComparators,
  ]
    .filter(
      (value, index) =>
        [
          ...textComparators,
          ...numberComparators,
          ...rangeComparators,
          ...booleanComparators,
        ].indexOf(value) === index,
    )
    .filter((word) => word !== "");
  const fieldsList = [
    "corpusName",
    "publicationDate",
    "subject.value",
    "hasFormula",
    "fulltext",
    "qualityIndicators.tdmReady",
    "abstract",
  ];

  const getAllFields = fieldsList.map((field, index) => {
    return (
      <MenuItem value={field} key={index}>
        {field}
      </MenuItem>
    );
  });
  const getAllOperators = operatorsList.map((operator, index) => {
    return (
      <MenuItem value={operator} key={index}>
        {t(operator)}
      </MenuItem>
    );
  });
  const getRightValueField = (node: FieldNode) => {
    switch (node.fieldType) {
      case "boolean":
        return (
          <TextField
            size="small"
            fullWidth
            select
            value={"value" in node && node.value}
            label={"value" in node && node.value === null ? t("value") : null}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            sx={{ mr: 2 }}
            error={
              displayError &&
              "value" in node &&
              (node.value === "" || node.value === null)
            }
          >
            <MenuItem value="true">{t("true")}</MenuItem>
            <MenuItem value="false">{t("false")}</MenuItem>
          </TextField>
        );
      case "range":
        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: "100%" }}
          >
            <TextField
              placeholder={t("valueMin")}
              value={"min" in node && node.min}
              size="small"
              fullWidth
              onChange={(event) => {
                try {
                  if (!isNaN(+event.target.value)) {
                    setRangeValue({ min: +event.target.value });
                  } else if (event.target.value === "*") {
                    setRangeValue({ min: "*" });
                  } else if (event.target.value === "") {
                    setRangeValue({ min: null });
                  }
                } catch (e) {}
              }}
              error={
                displayError &&
                "min" in node &&
                (node.min === "" || node.min === null)
              }
            />
            <p>-</p>
            <TextField
              placeholder={t("valueMax")}
              value={"max" in node && node.max}
              size="small"
              fullWidth
              onChange={(event) => {
                try {
                  if (!isNaN(+event.target.value)) {
                    setRangeValue({ max: +event.target.value });
                  } else if (event.target.value === "*") {
                    setRangeValue({ max: "*" });
                  } else if (event.target.value === "") {
                    setRangeValue({ max: null });
                  }
                } catch (e) {}
              }}
              error={
                displayError &&
                "max" in node &&
                (node.max === "" || node.max === null)
              }
            />
          </Stack>
        );
      default: // case text or number
        return (
          <TextField
            label={
              "value" in node && (node.value === "" || node.value === null)
                ? t("value")
                : null
            }
            variant="outlined"
            value={"value" in node && (node.value === null ? "" : node.value)}
            size="small"
            fullWidth
            onChange={(e) => {
              if (
                node.fieldType === "text" ||
                (node.fieldType === "number" &&
                  (!isNaN(+e.target.value) || // Accept number
                    e.target.value === "*")) // Accept '*'
              ) {
                setValue(e.target.value);
              } else if (node.fieldType === "number" && e.target.value === "") {
                setValue(null);
              }
            }}
            error={
              displayError &&
              "value" in node &&
              (node.value === "" || node.value === null)
            }
          />
        );
    }
  };

  return (
    <Stack
      ml={11}
      my={1.5}
      direction="row"
      p={0.5}
      sx={(theme) => ({
        border: `1px ${theme.palette.primary.light} solid`,
        borderRadius: "10px",
        position: "relative",
      })}
    >
      {/* FIELD */}
      <TextField
        size="small"
        fullWidth
        sx={{ mr: 2 }}
        select
        value={node.field}
        label={node.field === "" ? t("field") : null}
        onChange={(e) => {
          setField(e.target.value);
        }}
        error={displayError && node.field === ""}
      >
        {getAllFields}
      </TextField>

      {/* COMPARATOR */}
      <TextField
        size="small"
        fullWidth
        sx={{ mr: 2 }}
        select
        value={node.comparator}
        label={node.comparator === "" ? t("comparator") : null}
        onChange={(e) => {
          setComparator(e.target.value as Comparator);
        }}
        error={displayError && node.comparator === ""}
      >
        {getAllOperators}
      </TextField>

      {/* VALUE */}
      {getRightValueField(node)}

      {/* REMOVE BUTTON */}
      <IconButton onClick={remove}>
        <CancelIcon color="error" />
      </IconButton>
    </Stack>
  );
};

export default Rule;
