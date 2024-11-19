"use client";

import * as React from "react";
import { FixedSizeList } from "react-window";
import { Box, TextField, type TextFieldProps } from "@mui/material";

const LINE_HEIGHT = 23;

type MultilineTextFieldProps = TextFieldProps & {
  showLineNumbers?: boolean;
  errorLines?: number[];
};

const MultilineTextField = React.forwardRef<
  HTMLDivElement,
  MultilineTextFieldProps
>(function MultilineTextField(props, forwardedRef) {
  const lineNumbersRef = React.useRef<React.ComponentRef<"div">>(null);
  const {
    showLineNumbers = false,
    errorLines = [],
    onSubmit,
    slotProps,
    ...rest
  } = props;
  const maxHeight =
    typeof props.maxRows === "number" ? LINE_HEIGHT * props.maxRows : null;
  const lineCount =
    typeof props.value === "string" ? props.value.split("\n").length : 0;
  const digitCount = Math.floor(Math.log10(lineCount) + 1);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    // textarea elements don't submit the form when pressing Enter by default
    // so we recreate this behavior but still allow to insert new lines by
    // pressing Shift+Enter
    if (onSubmit != null && event.key === "Enter" && !event.shiftKey) {
      onSubmit(event);
    }
  };

  const handleScroll: React.UIEventHandler = (event) => {
    if (lineNumbersRef.current != null) {
      // When the textarea is scrolled, apply the same scroll to the line numbers
      lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const lineNumbersElement = showLineNumbers ? (
    <Box
      data-testid="line-numbers"
      sx={{
        textAlign: "right",
        pr: 2,
        "& > *": {
          overflow: maxHeight != null ? "hidden !important" : "inherit",
        },
      }}
    >
      <FixedSizeList
        outerRef={lineNumbersRef}
        height={maxHeight ?? 0}
        itemCount={lineCount}
        width={`${digitCount}ch`}
        itemSize={LINE_HEIGHT}
        overscanCount={5}
      >
        {({ index, style }) => {
          const lineNumber = index + 1;
          const hasError = errorLines.includes(lineNumber);

          return (
            <Box
              key={lineNumber}
              style={style}
              sx={(theme) => ({
                fontWeight: hasError ? "bold" : "normal",
                color: hasError
                  ? theme.vars.palette.colors.red
                  : theme.typography.body1.color,
              })}
            >
              {lineNumber}
            </Box>
          );
        }}
      </FixedSizeList>
    </Box>
  ) : undefined;

  return (
    <TextField
      ref={forwardedRef}
      onKeyDown={handleKeyDown}
      multiline
      slotProps={{
        ...slotProps,
        input: {
          startAdornment: lineNumbersElement,
          ...slotProps?.input,
        },
        htmlInput: {
          onScroll: handleScroll,
          // Dirty hack to avoid a flicker with the input height, explained here
          // https://github.com/mui/material-ui/issues/23031
          style: { minHeight: LINE_HEIGHT },
          ...slotProps?.htmlInput,
        },
      }}
      {...rest}
    />
  );
});

export default MultilineTextField;
