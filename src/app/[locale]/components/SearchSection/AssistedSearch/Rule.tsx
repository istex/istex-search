import { useTranslations } from "next-intl";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, MenuItem, Stack, TextField } from "@mui/material";

// TODO: remove "any" type when the structure is defined by Clement
const Rule = ({ node }: { node: any }) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.AssistedInput.Dropdown",
  );
  const fieldsList = [
    "corpusName",
    "publicationDate",
    "subject.value",
    "hasFormula",
    "fulltext",
    "qualityIndicators.tdmReady",
    "abstract",
  ];
  const operatorsList = [
    "equal",
    "notEqual",
    "contains",
    "notContains",
    "isBetween",
    "isGreaterThan",
    "isLessThan",
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
  const getRightValueField = (node: any) => {
    switch (node.fieldType) {
      case "boolean":
        return (
          <TextField
            size="small"
            fullWidth
            sx={{ mr: 2 }}
            select
            disabled
            value={node.value}
            label={node.value === undefined && t("value")}
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
              value={node.min}
              size="small"
              fullWidth
              disabled
            />
            <p>-</p>
            <TextField
              placeholder={t("valueMax")}
              value={node.max}
              size="small"
              fullWidth
              disabled
            />
          </Stack>
        );
      default: // case text
        return (
          <TextField
            label={t("value")}
            variant="outlined"
            value={node.value}
            size="small"
            fullWidth
            disabled
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
        disabled
        value={node.field}
        label={node.field === undefined && t("field")}
      >
        {getAllFields}
      </TextField>

      {/* COMPARATOR */}
      <TextField
        size="small"
        fullWidth
        sx={{ mr: 2 }}
        select
        disabled
        value={node.comparator}
        label={node.comparator === undefined && t("comparator")}
      >
        {getAllOperators}
      </TextField>

      {/* VALUE */}
      {getRightValueField(node)}

      {/* REMOVE BUTTON */}
      <IconButton>
        <CancelIcon color="error" />
      </IconButton>
    </Stack>
  );
};

export default Rule;
