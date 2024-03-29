"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ElementRef,
  type KeyboardEventHandler,
  type UIEventHandler,
} from "react";
import { createPortal } from "react-dom";
import { Box, TextField, type TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

const LINE_HEIGHT = 23;

type MultilineTextFieldProps = TextFieldProps & {
  showLineNumbers?: boolean;
  errorLines?: number[];
};

const MultilineTextField: ClientComponent<MultilineTextFieldProps> = forwardRef(
  function MultilineTextField(props, forwardedRef) {
    const [, forceUpdate] = useState(false);
    const lineNumbersRef = useRef<ElementRef<"div">>(null);
    const inputRef = useRef<ElementRef<"div">>(null);
    const { showLineNumbers, errorLines, onSubmit, ...rest } = props;
    const maxHeight =
      typeof props.maxRows === "number" ? LINE_HEIGHT * props.maxRows : null;
    const requiresLineNumbers =
      showLineNumbers === true && inputRef.current?.parentElement != null;

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      // textarea elements don't submit the form when pressing Enter by default
      // so we recreate this behavior but still allow to insert new lines by
      // pressing Shift+Enter
      if (onSubmit != null && event.code === "Enter" && !event.shiftKey) {
        onSubmit(event);
      }
    };

    const getLineNumbers = () => {
      if (typeof props.value !== "string") {
        return [1];
      }

      return props.value.split("\n").map((_, i) => {
        const lineNumber = i + 1;
        const hasError = errorLines?.includes(lineNumber) ?? false;

        return (
          <Box
            key={lineNumber}
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
      });
    };

    const handleScroll: UIEventHandler = (event) => {
      if (lineNumbersRef.current != null) {
        // When the textarea is scrolled, apply the same scroll to the line numbers
        lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
      }
    };

    useEffect(() => {
      // The inputRef isn't populated on the first render so we need to rerender
      // immediately to be able to use the inputRef in the portal for the line numbers
      forceUpdate(true);
    }, []);

    const lineNumbersElement = (
      <Box
        data-testid="line-numbers"
        ref={lineNumbersRef}
        sx={{
          textAlign: "right",
          pr: 2,
          "&.MuiBox-root": {
            order: 0,
            maxHeight: maxHeight ?? "inherit",
            overflow: maxHeight != null ? "hidden" : "inherit",
          },
        }}
      >
        {getLineNumbers()}
      </Box>
    );

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
  },
);

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root > *": {
    order: 1,
  },
});

export default MultilineTextField;
