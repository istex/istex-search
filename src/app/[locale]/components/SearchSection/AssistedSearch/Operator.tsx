import React from "react";
import { MenuItem, TextField } from "@mui/material";

const Operator = ({ operator }: { operator: "AND" | "OR" }) => {
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
      disabled
    >
      <MenuItem value="AND">AND</MenuItem>
      <MenuItem value="OR">OR</MenuItem>
    </TextField>
  );
};

export default Operator;
