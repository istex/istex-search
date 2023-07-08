"use client";

import { useState, forwardRef } from "react";
import { useRouter } from "next-intl/client";
import { Dialog, DialogContent, Slide } from "@/mui/material";
import useTheme from "@mui/material/styles/useTheme";
import type { TransitionProps } from "@mui/material/transitions";
import type { ClientComponent } from "@/types/next";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DownloadModal: ClientComponent<Record<string, unknown>, true> = ({
  children,
}) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  const close = (): void => {
    setOpen(false);

    // Wait until the leaving screen animation is over to go back to the /results page
    setTimeout(() => {
      router.back();
    }, theme.transitions.duration.leavingScreen);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      TransitionComponent={Transition}
      maxWidth="xl"
      scroll="body"
    >
      <DialogContent sx={{ bgcolor: "colors.white" }}>{children}</DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
