import { Box } from "@mui/material";
import HistoryButton from "./HistoryButton";
import ShareButton from "./ShareButton";

export default function FloatingSideMenu() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
    </Box>
  );
}
