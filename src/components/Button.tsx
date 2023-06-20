import { Button as MuiButton } from "@/mui/material";
import type { Palette } from "@mui/material/styles";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { HTMLAttributeAnchorTarget } from "react";
import type { ClientComponent } from "@/types/next";
import type { KeyOf } from "@/types/utility";

type ButtonProps = MuiButtonProps & {
  mainColor: `colors.${KeyOf<Palette["colors"]>}`;
  secondaryColor: `colors.${KeyOf<Palette["colors"]>}`;
  target?: HTMLAttributeAnchorTarget;
};

const Button: ClientComponent<ButtonProps> = (props) => {
  const { mainColor, secondaryColor, ...rest } = props;

  return (
    <MuiButton
      variant="outlined"
      sx={{
        borderColor: mainColor,
        color: mainColor,
        "&:hover": {
          bgcolor: mainColor,
          borderColor: mainColor,
          color: secondaryColor,
        },
      }}
      {...rest}
    />
  );
};

export default Button;
