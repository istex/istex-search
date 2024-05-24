import { Box } from "@mui/material";

const highlightColors = ["#6F1B84", "colors.blue", "#4BBC2E"];

interface HighlightedUrlProps {
  url: URL;
}

export default function HighlightedUrl({ url }: HighlightedUrlProps) {
  const searchParams: string[][] = [];

  url.searchParams.forEach((value, name) => {
    searchParams.push([name, value]);
  });

  return (
    <>
      {url.origin}
      {url.pathname}?
      {searchParams.map(([name, value], i) => (
        <Box
          key={name}
          component="span"
          sx={{
            fontWeight: "bold",
            color: highlightColors[i % highlightColors.length],
          }}
        >
          {i !== 0 ? "&" : ""}
          {name}={value}
        </Box>
      ))}
    </>
  );
}
