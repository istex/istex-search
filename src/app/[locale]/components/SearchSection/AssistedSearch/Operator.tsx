import React from "react";
import { Box, MenuItem, Stack, TextField } from "@mui/material";
import { spacing } from "./utils";
import type { Operator as OperatorType } from "@/lib/queryAst";

const operatorHeight = 40;

const Operator = ({
  operator,
  setEntry,
  isFirstOperator,
  isLastOperator,
  precedentNodeHeight,
  nextNodeHeight,
}: {
  operator: OperatorType;
  setEntry: (newOperator: OperatorType) => void;
  isFirstOperator?: boolean;
  isLastOperator?: boolean;
  precedentNodeHeight: number;
  nextNodeHeight: number;
}) => {
  const marginTop = precedentNodeHeight / 2 - operatorHeight / 2;
  const height = spacing + precedentNodeHeight / 2 + nextNodeHeight / 2;
  return (
    <Stack direction="row" sx={{ position: "absolute", marginTop: "-20px" }}>
      <TextField
        select
        value={operator}
        size="small"
        className="operator"
        sx={(theme) => ({
          "& .MuiOutlinedInput-notchedOutline": {
            border: `1px solid ${theme.palette.primary.light} !important`,
            borderRadius: "85px",
          },
          "& .MuiSelect-select": {
            pr: "0 !important",
          },
          ".MuiInputBase-input": {
            fontWeight: 700,
            color: theme.palette.colors.lightBlack,
          },
          width: "80px",
          height: `${operatorHeight}px`,
          mt: "5px",
          backgroundColor: "white",
          borderRadius: "85px",
        })}
        onChange={(e) => {
          setEntry(e.target.value as OperatorType);
        }}
      >
        <MenuItem value="AND">AND</MenuItem>
        <MenuItem value="OR">OR</MenuItem>
      </TextField>
      <Box
        sx={(theme) => ({
          width: "50px",
          height: `${height}px`,
          marginTop: `-${marginTop}px`,
          marginLeft: "-41px",
          border: `1px solid ${theme.palette.primary.light}`,
          borderRight: "none",
          borderBottom:
            isLastOperator === true
              ? `1px solid ${theme.palette.primary.light}`
              : "none",
          borderTopLeftRadius: isFirstOperator === true ? "10px" : "",
          borderBottomLeftRadius: isLastOperator === true ? "10px" : "",
        })}
      />
    </Stack>
  );
};

export default Operator;
