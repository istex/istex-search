import { CircularProgress } from "@/mui/material";
import type { ServerComponent } from "@/types/next";

const Loading: ServerComponent = () => {
  return <CircularProgress color="primary" />;
};

export default Loading;
