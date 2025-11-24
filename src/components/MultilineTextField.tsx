"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, TextField, type TextFieldProps } from "@mui/material";

const LINE_HEIGHT = 23;

type MultilineTextFieldProps = TextFieldProps & {
  showLineNumbers?: boolean;
  errorLines?: number[];
};

export default function MultilineTextField(props: MultilineTextFieldProps) {
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
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: lineCount,
    getScrollElement: () => lineNumbersRef.current,
    estimateSize: () => LINE_HEIGHT,
    initialRect: { width: digitCount, height: LINE_HEIGHT },
    overscan: 5,
  });

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
      ref={lineNumbersRef}
      sx={{
        textAlign: "right",
        pr: 2,
        overflow: maxHeight != null ? "hidden" : "inherit",
        height: maxHeight,
      }}
    >
      <Box
        sx={{
          height: rowVirtualizer.getTotalSize(),
          width: `${digitCount}ch`,
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const lineNumber = virtualItem.index + 1;
          const hasError = errorLines.includes(lineNumber);

          return (
            <Box
              key={virtualItem.key}
              data-testid={`line-number-${virtualItem.key}`}
              sx={(theme) => ({
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
                fontWeight: hasError ? "bold" : "normal",
                color: hasError
                  ? theme.vars.palette.colors.red
                  : theme.typography.body1.color,
              })}
            >
              {lineNumber}
            </Box>
          );
        })}
      </Box>
    </Box>
  ) : undefined;

  return (
    <TextField
      onKeyDown={handleKeyDown}
      multiline
      slotProps={{
        ...slotProps,
        input: {
          startAdornment: lineNumbersElement,
          ...slotProps?.input,
        },
        htmlInput: {
          ...slotProps?.htmlInput,
          onScroll: handleScroll,
          style: {
            // TODO: investigate this TypeScript error more and make an MUI issue if needed
            // @ts-expect-error The type of slotProps.htmlInput is incorrect and TypeScript doesn't know style exists
            ...slotProps?.htmlInput?.style,

            // Dirty hack to avoid a flicker with the input height, explained here
            // https://github.com/mui/material-ui/issues/23031
            height: LINE_HEIGHT,
          },
        },
      }}
      {...rest}
    />
  );
}
