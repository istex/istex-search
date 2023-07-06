"use client";

import { useState, forwardRef } from "react";
import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, Slide } from "@/mui/material";
import useTheme from "@mui/material/styles/useTheme";
import type { TransitionProps } from "@mui/material/transitions";
import type { ClientComponent } from "@/types/next";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DownloadModal: ClientComponent = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const close = (): void => {
    setOpen(false);

    // Wait until the leaving screen animation is over to go back to the /results page
    setTimeout(() => {
      router.push(`/results?${searchParams.toString()}`);
    }, theme.transitions.duration.leavingScreen);
  };

  return (
    <Dialog open={open} onClose={close} TransitionComponent={Transition}>
      <DialogTitle>Configurer votre téléchargement</DialogTitle>
      <DialogContent>download modal</DialogContent>
    </Dialog>
  );
};

export default DownloadModal;
