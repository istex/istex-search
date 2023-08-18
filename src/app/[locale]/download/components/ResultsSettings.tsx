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
  const size = searchParams.getSize();

  const maxSizeToUse = clamp(actualSize, 0, istexApiConfig.maxSize);
  const sizeToUse = clamp(size, 0, maxSizeToUse);

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
          max: maxSizeToUse,
        }}
        value={sizeToUse}
        onChange={handleChange}
      />
    </Box>
  );
};

export default ResultsSettings;
