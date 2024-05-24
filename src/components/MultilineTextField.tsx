"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { FixedSizeList } from "react-window";
import { Box, TextField, type TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const LINE_HEIGHT = 23;

type MultilineTextFieldProps = TextFieldProps & {
  showLineNumbers?: boolean;
  errorLines?: number[];
};

const MultilineTextField = React.forwardRef<
  HTMLDivElement,
  MultilineTextFieldProps
>(function MultilineTextField(props, forwardedRef) {
  const [, forceUpdate] = React.useState(false);
  const lineNumbersRef = React.useRef<React.ElementRef<"div">>(null);
  const inputRef = React.useRef<React.ElementRef<"div">>(null);
  const { showLineNumbers, errorLines, onSubmit, ...rest } = props;
  const maxHeight =
    typeof props.maxRows === "number" ? LINE_HEIGHT * props.maxRows : null;
  const lineCount =
    typeof props.value === "string" ? props.value.split("\n").length : 0;
  const digitCount = Math.floor(Math.log10(lineCount) + 1);
  const requiresLineNumbers =
    showLineNumbers === true && inputRef.current?.parentElement != null;

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    // textarea elements don't submit the form when pressing Enter by default
    // so we recreate this behavior but still allow to insert new lines by
    // pressing Shift+Enter
    if (onSubmit != null && event.code === "Enter" && !event.shiftKey) {
      onSubmit(event);
    }
  };

  const handleScroll: React.UIEventHandler = (event) => {
    if (lineNumbersRef.current != null) {
      // When the textarea is scrolled, apply the same scroll to the line numbers
      lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const lineNumbersElement = (
    <Box
      data-testid="line-numbers"
      sx={{
        textAlign: "right",
        pr: 2,
        "&.MuiBox-root": {
          order: 0,
        },
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
          const hasError = errorLines?.includes(lineNumber) ?? false;

          return (
            <Box
              key={lineNumber}
              style={style}
              sx={(theme) => ({
                fontWeight: hasError ? "bold" : "normal",
                color: hasError
                  ? theme.palette.colors.red
                  : theme.typography.body1.color,
              })}
            >
              {lineNumber}
            </Box>
          );
        }}
      </FixedSizeList>
    </Box>
  );

  React.useEffect(() => {
    // The inputRef isn't populated on the first render so we need to rerender
    // immediately to be able to use the inputRef in the portal for the line numbers
    forceUpdate(true);
  }, []);

  return (
    <>
      {requiresLineNumbers &&
        createPortal(lineNumbersElement, inputRef.current.parentElement)}

      <StyledTextField
        ref={forwardedRef}
        onKeyDown={handleKeyDown}
        multiline
        inputRef={inputRef}
        inputProps={{
          onScroll: handleScroll,
          // Dirty hack to avoid a flicker with the input height, explained here
          // https://github.com/mui/material-ui/issues/23031
          style: { minHeight: LINE_HEIGHT },
        }}
        {...rest}
      />
    </>
  );
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root > *": {
    order: 1,
  },
});

export default MultilineTextField;
