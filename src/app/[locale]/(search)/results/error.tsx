"use client";

import { Alert, AlertTitle } from "@/mui/material";
import type { ClientComponent } from "@/types/next";

const ResultsError: ClientComponent<{ error: Error }> = ({ error }) => (
  <Alert severity="error">
    <AlertTitle>Error</AlertTitle>
    {error.message}
  </Alert>
);

export default ResultsError;
