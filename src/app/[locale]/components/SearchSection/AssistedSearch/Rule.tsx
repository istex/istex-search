import { useState } from "react";
import { useTranslations } from "next-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { fieldsDefinition } from "./fieldsList";
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
  const [focus, setFocus] = useState(false);
  const t = useTranslations(
    "home.SearchSection.SearchInput.AssistedInput.Dropdown",
  );
  const numberAndRangeComparators = [...numberComparators, ...rangeComparators]
    .filter(
      (value, index) =>
        [...numberComparators, ...rangeComparators].indexOf(value) === index,
    )
    .filter((word) => word !== "");

  const fieldsList = Array.from(fieldsDefinition, (element) => {
    return element.field;
  });

  const getComparators = () => {
    const comparators =
      node.fieldType === "text"
        ? [...textComparators]
        : node.fieldType === "boolean"
        ? [...booleanComparators]
        : [...numberAndRangeComparators];

    return comparators.map((operator, index) => {
      if (operator === "") return null;
      return (
        <MenuItem value={operator} key={index}>
          {t(operator)}
        </MenuItem>
      );
    });
  };

  const getRightValueField = (node: FieldNode) => {
    switch (node.fieldType) {
      case "boolean":
        return (
          <TextField
            size="small"
            focused={false}
            fullWidth
            select
            value={"value" in node && node.value}
            label={"value" in node && node.value === null ? t("value") : null}
            onChange={(e) => {
              setValue(e.target.value);
            }}
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
            spacing="10px"
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
              sx={{
                "input::placeholder": {
                  fontWeight: 400,
                  opacity: 0.8,
                },
              }}
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
              sx={{
                "input::placeholder": {
                  fontWeight: 400,
                  opacity: 0.8,
                },
              }}
            />
          </Stack>
        );
      default: // case text or number
        return (
          <TextField
            focused={false}
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
      direction="row"
      gap="10px"
      p="5px"
      pr="14px"
      sx={(theme) => ({
        border: `1px ${theme.palette.primary.light} solid`,
        borderRadius: "5px",
        p: "5px 14px 5px 5px",
        mt: "10px",
        position: "relative",
      })}
    >
      {/* FIELD */}
      <Autocomplete
        value={node.field === "" ? null : node.field}
        onChange={(event: any, newField: string | null) => {
          setField(newField !== null ? newField : "");
        }}
        options={fieldsList}
        getOptionLabel={(option) => t(`fields.${option}.title`)}
        fullWidth
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={!focus && node.field === "" ? t("field") : null}
            error={displayError && node.field === ""}
          />
        )}
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            sx={{
              display: "block !important",
              width: "100%",
              fontWeight: 400,
              fontFamily: "Inter",
              my: "5px !important",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
              }}
            >
              {t(`fields.${option}.title`)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                wordWrap: "break-word",
                whiteSpace: "normal",
                fontSize: "0.5rem",
              }}
            >
              <i>{t(`fields.${option}.description`)}</i>
            </Typography>
          </MenuItem>
        )}
        onFocusCapture={() => {
          setFocus(true);
        }}
        onBlurCapture={() => {
          setFocus(false);
        }}
        blurOnSelect
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: "1px solid rgba(0, 0, 0, 0.23)",
            },
        }}
      />

      {/* COMPARATOR */}
      <TextField
        size="small"
        focused={false}
        fullWidth
        select
        value={node.comparator}
        label={node.comparator === "" ? t("comparator") : null}
        onChange={(e) => {
          setComparator(e.target.value as Comparator);
        }}
        error={displayError && node.comparator === ""}
      >
        {getComparators()}
      </TextField>

      {/* VALUE */}
      {getRightValueField(node)}

      {/* REMOVE BUTTON */}
      <IconButton onClick={remove} sx={{ width: "16px", p: 0 }}>
        <CancelIcon color="error" />
      </IconButton>
    </Stack>
  );
};

export default Rule;
