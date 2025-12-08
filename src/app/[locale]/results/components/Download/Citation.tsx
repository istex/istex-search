import * as React from "react";
import { useTranslations } from "next-intl";
import { Box, Stack, Typography, type BoxProps } from "@mui/material";
import CopyButton from "@/components/CopyButton";
import Selector from "@/components/Selector";

const CITATION_EXAMPLES = {
  BibTex: (
    <CitationContainer>
      {`@misc{inistcnrs_istex_2025,
  author       = {{Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)}},
  title        = {Istex - search.istex.fr},
  year         = {2025},
  url          = {https://search.istex.fr},
}`}
    </CitationContainer>
  ),

  BibLateX: (
    <CitationContainer>
      {`@online{inistcnrs_istex_2025,
  author    = {Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)},
  title     = {Istex – search.istex.fr},
  year      = {2025},
  url       = {https://search.istex.fr},
  urldate   = {2025-01-01},
}`}
    </CitationContainer>
  ),

  APA: (
    <CitationContainer component="p" sx={{ marginBlock: "1em 1em" }}>
      {`Institut de l'information scientifique et technique – UAR76 (Inist-CNRS). (2025). Istex – search.istex.fr. https://search.istex.fr`}
    </CitationContainer>
  ),

  mods: (
    <CitationContainer>
      {`<mods xmlns="http://www.loc.gov/mods/v3">
  <titleInfo>
    <title>Istex - search.istex.fr</title>
  </titleInfo>
  <name type="corporate">
    <namePart>Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)</namePart>
  </name>
  <originInfo>
    <dateIssued>2025</dateIssued>
  </originInfo>
  <location>
    <url>https://search.istex.fr</url>
  </location>
  <typeOfResource>software</typeOfResource>
</mods>`}
    </CitationContainer>
  ),

  dublinCore: (
    <CitationContainer>{`<record xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>Istex - search.istex.fr</dc:title>
  <dc:creator>Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)</dc:creator>
  <dc:date>2025</dc:date>
  <dc:type>Service/API</dc:type>
  <dc:identifier>https://search.istex.fr</dc:identifier>
  <dc:publisher>Inist-CNRS</dc:publisher>
</record>`}</CitationContainer>
  ),
} as const;

type CitationFormat = keyof typeof CITATION_EXAMPLES;
const CITATION_FORMATS = Object.keys(CITATION_EXAMPLES) as CitationFormat[];

export default function Citation() {
  const t = useTranslations("download.Citation");
  const [citationFormat, setCitationFormat] = React.useState(
    CITATION_FORMATS[0],
  );

  const handleCitationFormatChange = (
    _: React.SyntheticEvent,
    value: CitationFormat,
  ) => {
    setCitationFormat(value);
  };

  const labelizeCitationFormat = (format: CitationFormat) => {
    return format;
  };

  return (
    <Box>
      <Typography component="h3" variant="h6">
        {t("title")}
      </Typography>

      <Selector
        options={CITATION_FORMATS}
        t={labelizeCitationFormat}
        value={citationFormat}
        onChange={handleCitationFormatChange}
      />

      {CITATION_EXAMPLES[citationFormat]}
    </Box>
  );
}

function CitationContainer(props: BoxProps & { children: string }) {
  const { children, sx, ...rest } = props;
  const t = useTranslations("download.Citation");

  return (
    <Stack direction="row">
      <Box
        component="pre"
        sx={{
          fontSize: "0.875rem",
          height: "11.5rem",
          overflowY: "auto",
          flexGrow: 1,
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Box>

      <Box sx={{ alignItems: "start", justifySelf: "center" }}>
        <CopyButton
          aria-label={t("copy.aria-label")}
          clipboardText={children}
          successLabel={t("copy.success")}
        />
      </Box>
    </Stack>
  );
}
