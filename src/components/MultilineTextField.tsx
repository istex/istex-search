"use client";

import { forwardRef, type KeyboardEventHandler } from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const MultilineTextField: ClientComponent<TextFieldProps> = forwardRef(
  function MultilineTextField(props, forwardedRef) {
    const { onSubmit, ...rest } = props;

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      // textarea elements don't submit the form when pressing Enter by default
      // so we recreate this behavior but still allow to insert new lines by
      // pressing Shift+Enter
      if (onSubmit != null && event.code === "Enter" && !event.shiftKey) {
        onSubmit(event);
      }
    };

    return (
      <TextField
        ref={forwardedRef}
        onKeyDown={handleKeyDown}
        multiline
        inputProps={{
          // Dirty hack to avoid a flicker with the input height, explained here
          // https://github.com/mui/material-ui/issues/23031
          style: { minHeight: 23 },
        }}
        {...rest}
      />
    );
  },
);

export default MultilineTextField;
