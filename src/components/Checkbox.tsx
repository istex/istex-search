"use client";

import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  type CheckboxProps as MuiCheckboxProps,
  type FormControlLabelProps,
} from "@mui/material";
import { styled, type Theme } from "@mui/material/styles";
import IncludeIcon from "./IncludeIcon";
import IndeterminateIcon from "./IndeterminateIcon";

// Make the name prop required only if label is not a string
interface _PropsLabelString extends MuiCheckboxProps {
  label: string;
}
interface _PropsLabelReactNode extends MuiCheckboxProps {
  label: FormControlLabelProps["label"];
  name: string;
}
type CustomCheckboxProps = _PropsLabelString | _PropsLabelReactNode;

function CustomCheckbox(props: CustomCheckboxProps) {
  const {
    label,
    name = typeof label === "string" ? label : "",
    checked,
    disabled,
    indeterminate,
    size = "small",
    onChange,
    title,
    ...rest
  } = props;

  return (
    <FormControlLabel
      label={label}
      htmlFor={name}
      disabled={disabled}
      title={title}
      slotProps={{
        typography: {
          sx: (theme: Theme) => ({
            fontSize: theme.typography.body2.fontSize,
            flexGrow: 1,
          }),
        },
      }}
      control={
        <MuiCheckbox
          id={name}
          name={name}
          checked={checked}
          indeterminate={indeterminate}
          size={size}
          onChange={onChange}
          checkedIcon={<IncludeIcon />}
          indeterminateIcon={<IndeterminateIcon />}
          {...rest}
        />
      }
      sx={{
        marginInline: 0,
        pr: 2,
        width: "100%",
      }}
    />
  );
}

const Checkbox = styled(CustomCheckbox)<CustomCheckboxProps>(({ theme }) => ({
  "&.MuiCheckbox-root": {
    padding: theme.spacing(0.75),
  },
}));

export default Checkbox;
