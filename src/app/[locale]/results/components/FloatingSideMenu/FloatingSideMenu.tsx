import { Box } from "@mui/material";
import HistoryButton from "./HistoryButton";
import ShareButton from "./ShareButton";
import type { ServerComponent } from "@/types/next";

const FloatingSideMenu: ServerComponent = () => {
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
};

export default FloatingSideMenu;
