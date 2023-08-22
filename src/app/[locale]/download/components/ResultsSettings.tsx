"use client";

import { type ChangeEventHandler } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, TextField } from "@mui/material";
import { istexApiConfig } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import { clamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const ResultsSettings: ClientComponent<{ actualSize: number }> = ({
  actualSize,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const maxSize = clamp(actualSize, 0, istexApiConfig.maxSize);
  const size = clamp(searchParams.getSize(), 0, maxSize);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    searchParams.setSize(parseInt(event.target.value));
    router.replace(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Box>
      <TextField
        id="size-input"
        type="number"
        size="small"
        inputProps={{
          min: 0,
          max: maxSize,
        }}
        value={size}
        onChange={handleChange}
      />
    </Box>
  );
};

export default ResultsSettings;
