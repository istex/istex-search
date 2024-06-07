import * as React from "react";
import { Box } from "@mui/material";
import SearchButton from "./SearchButton";

interface SearchBarProps {
  children: React.ReactNode;
}

export default function SearchBar({ children }: SearchBarProps) {
  return (
    <Box
      sx={{
        mt: 1,
        display: { xs: "block", sm: "flex" },
        textAlign: { xs: "center", sm: "inherit" },
      }}
    >
      {children}

      <SearchButton />
    </Box>
  );
}
