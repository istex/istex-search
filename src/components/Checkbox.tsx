"use client";

import {
  type CheckboxProps as MuiCheckboxProps,
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

interface CustomCheckboxProps extends MuiCheckboxProps {
  label: string;
}

const CustomCheckbox: ClientComponent<CustomCheckboxProps> = (props) => {
  const { name, label, checked, disabled, indeterminate, onChange, ...rest } =
    props;

  return (
    <FormControlLabel
      label={label}
      htmlFor={name ?? label}
      disabled={disabled}
      componentsProps={{
        typography: {
          sx: (theme) => ({ fontSize: theme.typography.body2.fontSize }),
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
          {...rest}
        />
      }
    />
  );
};

const Checkbox = styled(CustomCheckbox)<CustomCheckboxProps>(({ theme }) => ({
  "&.MuiCheckbox-root": {
    padding: theme.spacing(0.75),
  },
}));

export default Checkbox;
