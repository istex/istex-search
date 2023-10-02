import { Container } from "@mui/material";
import type { Layout } from "@/types/next";

const ResultsLayout: Layout = ({ children }) => (
  <Container component="section" sx={{ pb: 6 }}>
    {children}
  </Container>
);

export default ResultsLayout;
