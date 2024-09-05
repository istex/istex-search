"use client";

import {
  type CheckboxProps as MuiCheckboxProps,
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@mui/material";
import { styled, type Theme } from "@mui/material/styles";
import IncludeIcon from "./IncludeIcon";
import IndeterminateIcon from "./IndeterminateIcon";

interface CustomCheckboxProps extends MuiCheckboxProps {
  label: string;
}

function CustomCheckbox(props: CustomCheckboxProps) {
  const { name, label, checked, disabled, indeterminate, onChange, ...rest } =
    props;

  return (
    <FormControlLabel
      label={label}
      htmlFor={name ?? label}
      disabled={disabled}
      slotProps={{
        typography: {
          sx: (theme: Theme) => ({ fontSize: theme.typography.body2.fontSize }),
        },
      }}
      control={
        <MuiCheckbox
          id={name ?? label}
          name={name ?? label}
          checked={checked}
          indeterminate={indeterminate}
          size="small"
          onChange={onChange}
          checkedIcon={<IncludeIcon />}
          indeterminateIcon={<IndeterminateIcon />}
          {...rest}
        />
      }
      sx={{ ml: 0 }}
    />
  );
}

const Checkbox = styled(CustomCheckbox)<CustomCheckboxProps>(({ theme }) => ({
  "&.MuiCheckbox-root": {
    padding: theme.spacing(0.75),
  },
}));

export default Checkbox;
