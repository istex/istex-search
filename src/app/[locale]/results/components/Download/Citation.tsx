import { Box, type BoxProps, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import * as React from "react";
import CopyButton from "@/components/CopyButton";
import Selector from "@/components/Selector";

const CITATION_EXAMPLES = {
  BibTex: (
    <CitationContainer>
      {`@software{inistcnrs_istex_2025,
  keywords = {Istex, publications scientifiques, corpus, fouille de textes},
  author   = {{Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)}},
  title    = {Istex Search - search.istex.fr},
  year     = {2025},
  url      = {https://search.istex.fr},
}`}
    </CitationContainer>
  ),

  APA: (
    <CitationContainer component="p">
      {`Institut de l'information scientifique et technique – UAR76 (Inist-CNRS). (2025). Istex Search – search.istex.fr. https://search.istex.fr`}
    </CitationContainer>
  ),

  mods: (
    <CitationContainer>
      {`<?xml version="1.0"?>
<modsCollection
  xmlns="http://www.loc.gov/mods/v3"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.loc.gov/mods/v3 http://www.loc.gov/standards/mods/v3/mods-3-2.xsd">

  <mods>
    <titleInfo>
      <title>Istex Search - search.istex.fr</title>
    </titleInfo>

    <typeOfResource>software, multimedia</typeOfResource>
    <genre authority="local">computerProgram</genre>

    <name type="corporate">
      <namePart>Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)</namePart>
      <role>
        <roleTerm type="code" authority="marcrelator">ctb</roleTerm>
      </role>
    </name>

    <originInfo>
      <dateCreated>2025</dateCreated>
      <issuance>monographic</issuance>
    </originInfo>

    <location>
      <url usage="primary display">https://search.istex.fr</url>
    </location>

    <subject>
      <topic>corpus</topic>
    </subject>
    <subject>
      <topic>fouille de textes</topic>
    </subject>
    <subject>
      <topic>Istex</topic>
    </subject>
    <subject>
      <topic>publications scientifiques</topic>
    </subject>
  </mods>

</modsCollection>`}
    </CitationContainer>
  ),

  RIS: (
    <CitationContainer>
      {`TY  - COMP
TI  - Istex Search - search.istex.fr
AU  - Institut de l'information scientifique et technique - UAR76 (Inist-CNRS)
PY  - 2025
UR  - https://search.istex.fr
KW  - corpus
KW  - fouille de textes
KW  - Istex
KW  - publications scientifiques
ER  - `}
    </CitationContainer>
  ),
} as const;

type CitationFormat = keyof typeof CITATION_EXAMPLES;
const CITATION_FORMATS = Object.keys(CITATION_EXAMPLES) as CitationFormat[];

export default function Citation() {
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
    <Stack spacing={2}>
      <Selector
        options={CITATION_FORMATS}
        t={labelizeCitationFormat}
        value={citationFormat}
        onChange={handleCitationFormatChange}
      />

      {CITATION_EXAMPLES[citationFormat]}
    </Stack>
  );
}

function CitationContainer(props: BoxProps & { children: string }) {
  const { children, sx, ...rest } = props;
  const t = useTranslations("download.Citation");

  return (
    <Stack
      direction="row"
      sx={{
        bgcolor: "colors.white",
        borderRadius: 1,
        py: 2,
        pl: 2,
        pr: 0.5,
      }}
    >
      <Box
        component="pre"
        sx={{
          m: 0,
          fontSize: "0.875rem",
          height: "9.5rem",
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
