"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  type OutlinedInputProps,
  type SxProps,
} from "@mui/material";

// This component is a placeholder for FormControl to correctly set the shrink label state on SSR.
function SSRInitialFilled(_: BaseNumberField.Root.Props) {
  return null;
}
SSRInitialFilled.muiName = "Input";

export interface NumberInputProps extends BaseNumberField.Root.Props {
  error?: boolean;
  hideActionButtons?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  size?: "small" | "medium";
  slotProps?: OutlinedInputProps["slotProps"];
  sx?: SxProps;
}

export default function NumberInput(props: NumberInputProps) {
  const {
    error,
    hideActionButtons = false,
    id: idProp,
    label,
    placeholder,
    size = "medium",
    slotProps,
    sx,
    ...rest
  } = props;
  const t = useTranslations("NumberInput");
  const locale = useLocale();

  let id = React.useId();
  if (idProp != null && idProp !== "") {
    id = idProp;
  }

  const inputLabel = label != null && (
    <InputLabel htmlFor={id}>{label}</InputLabel>
  );

  const endAdornment = !hideActionButtons && (
    <InputAdornment
      position="end"
      sx={{
        flexDirection: "column",
        maxHeight: "unset",
        alignSelf: "stretch",
        borderLeft: "1px solid",
        borderColor: "divider",
        ml: 0,
        "& button": {
          py: 0,
          flex: 1,
          borderRadius: 0.5,
        },
      }}
    >
      <BaseNumberField.Increment
        render={<IconButton size={size} aria-label={t("incrementAriaLabel")} />}
      >
        <KeyboardArrowUpIcon
          fontSize={size}
          sx={{ transform: "translateY(2px)" }}
        />
      </BaseNumberField.Increment>

      <BaseNumberField.Decrement
        render={<IconButton size={size} aria-label={t("decrementAriaLabel")} />}
      >
        <KeyboardArrowDownIcon
          fontSize={size}
          sx={{ transform: "translateY(-2px)" }}
        />
      </BaseNumberField.Decrement>
    </InputAdornment>
  );

  return (
    <BaseNumberField.Root
      {...rest}
      locale={locale}
      render={(props, state) => (
        <FormControl
          size={size}
          ref={props.ref}
          disabled={state.disabled}
          required={state.required}
          error={error}
          variant="outlined"
          sx={sx}
        >
          {props.children}
        </FormControl>
      )}
    >
      <SSRInitialFilled {...rest} />

      {inputLabel}

      <BaseNumberField.Input
        id={id}
        aria-invalid={error}
        render={(props, state) => (
          <OutlinedInput
            label={label}
            placeholder={placeholder}
            inputRef={props.ref}
            value={state.inputValue}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            onFocus={props.onFocus}
            slotProps={{
              ...slotProps,
              input: { ...props, ...slotProps?.input },
            }}
            endAdornment={endAdornment}
            sx={{ pr: 0 }}
          />
        )}
      />
    </BaseNumberField.Root>
  );
}
