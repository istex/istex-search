import * as React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { useLocale, useTranslations } from "next-intl";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  type IconButtonProps,
  type TextFieldProps,
} from "@mui/material";

const NumericFormatCustom = React.forwardRef<
  HTMLInputElement,
  NumericFormatProps
>(function NumericFormatCustom(props, ref) {
  const { decimalSeparator, thousandSeparator, value, ...rest } = props;
  const locale = useLocale();

  const defaultThousandSeparator = React.useMemo(() => {
    return getThousandSeparator(locale);
  }, [locale]);

  const defaultDecimalSeparator = React.useMemo(() => {
    return getDecimalSeparator(locale);
  }, [locale]);

  return (
    <NumericFormat
      {...rest}
      value={value ?? ""} // We can't ever pass null to value because it breaks the shrink state of the label, so we pass empty string instead
      getInputRef={ref}
      thousandSeparator={thousandSeparator ?? defaultThousandSeparator}
      decimalSeparator={decimalSeparator ?? defaultDecimalSeparator}
    />
  );
});

type NumberInputProps = Omit<TextFieldProps, "onChange"> & {
  hideActionButtons?: boolean;
  max?: number;
  min?: number;
  numericFormatProps?: NumericFormatProps;
  onChange?: (value: number | null) => void;
  step?: number;
  value?: number | null;
};

const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  function NumberInput(props, ref) {
    const t = useTranslations("NumberInput");
    const {
      disabled = false,
      InputProps,
      inputProps,
      hideActionButtons = false,
      max = Infinity,
      min = -Infinity,
      numericFormatProps: numericFormatPropsProp,
      onChange,
      size,
      step = 1,
      value: valueProp,
      ...rest
    } = props;
    const isControlled = valueProp !== undefined && onChange !== undefined;

    // We use an internal state when the component is uncontrolled
    const [fallbackValue, setFallbackValue] = React.useState(valueProp);
    const value = isControlled ? valueProp : fallbackValue;
    const setValue = isControlled ? onChange : setFallbackValue;

    const increment = () => {
      // If we increment when the input is empty, we consider the previous value to be 0
      const newValue =
        (value != null && !Number.isNaN(value) ? value : 0) + step;

      if (newValue > max) {
        return;
      }

      setValue(newValue);
    };

    const decrement = () => {
      // If we decrement when the input is empty, we consider the previous value to be 0
      const newValue =
        (value != null && !Number.isNaN(value) ? value : 0) - step;

      if (newValue < min) {
        return;
      }

      setValue(newValue);
    };

    const numericFormatProps: NumericFormatProps = {
      // We set a default to avoid displaying floating point errors when using a decimal step
      decimalScale: 5,

      // react-number-format doesn't provide min or max props so we do the checking here instead
      isAllowed: ({ floatValue }) => {
        if (floatValue == null) {
          return true;
        }

        return floatValue >= min && floatValue <= max;
      },

      // Only add the min, max and step html attributes when the value isn't the default one
      max: max !== Infinity ? max : undefined,
      min: min !== -Infinity ? min : undefined,
      step: step !== 1 ? step : undefined,

      // Allow to increment with ArrowUp and decrement with ArrowDown
      onKeyDown: (event) => {
        if (event.key === "ArrowUp") {
          increment();
        } else if (event.key === "ArrowDown") {
          decrement();
        }
      },

      onValueChange: ({ floatValue }) => {
        // When incrementing or decrementing, the value prop is already up to date
        // so we make sure the value needs to be updated to prevent an unnecessary re-render
        if (floatValue === value) {
          return;
        }

        setValue(floatValue ?? null);
      },
      value,

      ...numericFormatPropsProp,
    };

    const commonAdornmentButtonProps: IconButtonProps = {
      edge: "end",
      sx: { p: size !== "small" ? "1px" : 0 },
    };

    return (
      <TextField
        {...rest}
        ref={ref}
        value={value ?? ""} // We can't ever pass null to value because it breaks the shrink state of the label, so we pass empty string instead
        disabled={disabled}
        size={size}
        InputProps={{
          ...InputProps,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: NumericFormatCustom as any,
          endAdornment: !hideActionButtons && (
            <InputAdornment position="end">
              <Stack>
                <IconButton
                  aria-label={t("incrementAriaLabel")}
                  disabled={disabled || (value ?? 0) + step > max}
                  onClick={increment}
                  {...commonAdornmentButtonProps}
                >
                  <AddCircleIcon fontSize={size} />
                </IconButton>
                <IconButton
                  aria-label={t("decrementAriaLabel")}
                  disabled={disabled || (value ?? 0) - step < min}
                  onClick={decrement}
                  {...commonAdornmentButtonProps}
                >
                  <RemoveCircleIcon fontSize={size} />
                </IconButton>
              </Stack>
            </InputAdornment>
          ),
        }}
        // @ts-expect-error The type should be React.ComponentProps<typeof inputComponent> but instead
        // it is hard-coded to InputBaseComponentProps
        inputProps={{ ...inputProps, ...numericFormatProps }}
      />
    );
  },
);

// Taken from here:
// https://stackoverflow.com/questions/32054025/how-to-determine-thousands-separator-in-javascript#comments-77517574

function getThousandSeparator(locale: string) {
  return (
    new Intl.NumberFormat(locale)
      .formatToParts(1234.5678)
      .find((part) => part.type === "group")?.value ?? ""
  );
}

function getDecimalSeparator(locale: string) {
  return (
    new Intl.NumberFormat(locale)
      .formatToParts(1234.5678)
      .find((part) => part.type === "decimal")?.value ?? "."
  );
}

export default NumberInput;
