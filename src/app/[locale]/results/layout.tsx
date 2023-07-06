import { Container } from "@/mui/material";
import type { Layout } from "@/types/next";

const ResultsLayout: Layout<{ modal: React.ReactNode }> = ({
  children,
  modal,
}) => {
  return (
    <Container component="section" sx={{ pb: 6 }}>
      {children}
      {modal}
    </Container>
  );
};

export default ResultsLayout;
