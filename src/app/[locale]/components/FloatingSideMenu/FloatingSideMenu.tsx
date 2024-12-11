import { Stack } from "@mui/material";
import HistoryButton from "./HistoryButton";
import MemoButton from "./MemoButton";
import ShareButton from "./ShareButton";

export default function FloatingSideMenu() {
  return (
    <Stack
      component="aside"
      sx={{
        justifyContent: "center",
        alignItems: "end",
        gap: 0.5,
        position: "fixed",
        height: "100vh",
        top: 0,
        right: 0,
        pointerEvents: "none",
      }}
    >
      <HistoryButton />
      <ShareButton />
      <MemoButton />
    </Stack>
  );
}
