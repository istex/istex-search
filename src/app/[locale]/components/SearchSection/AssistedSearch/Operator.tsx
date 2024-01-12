import React from "react";
import { MenuItem, TextField } from "@mui/material";
import type { Operator as OperatorType } from "@/lib/queryAst";

const Operator = ({
  operator,
  setEntry,
}: {
  operator: OperatorType;
  setEntry: (newOperator: OperatorType) => void;
}) => {
  return (
    <TextField
      select
      value={operator}
      size="small"
      sx={(theme) => ({
        "& .MuiOutlinedInput-notchedOutline": {
          border: `1px solid ${theme.palette.primary.light} !important`,
          borderRadius: "25px",
        },
        position: "absolute",
        marginTop: "-20px",
        width: "80px",
      })}
      onChange={(e) => {
        setEntry(e.target.value as OperatorType);
      }}
    >
      <MenuItem value="AND">AND</MenuItem>
      <MenuItem value="OR">OR</MenuItem>
    </TextField>
  );
};

export default Operator;
