import { useTranslations } from "next-intl";
import { ArrowRightAltIcon } from "@/mui/icons-material";
import { Box, Container, Typography } from "@/mui/material";
import Button from "@/components/Button";
import CorpusGrid from "./CorpusGrid";
import { usages } from "@/config";
import type { ClientComponent, ServerComponent } from "@/types/next";
import type { BoxProps, TypographyProps } from "@mui/material";

const CorpusSection: ServerComponent = () => {
  const t = useTranslations("Home.CorpusSection");
  const tUsages = useTranslations("usages");

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: "url(/wires.svg)",
        backgroundPosition: "bottom left",
        backgroundRepeat: "no-repeat",
        bgcolor: "#f6f9fa",
        mb: { xs: 6, md: 0 },
      }}
    >
      <Container sx={{ display: { xs: "block", md: "flex" }, gap: 8 }}>
        {/* Ready-to-use corpus */}
        <Article sx={{ flex: 1.5 }}>
          <Title sx={{ mb: 1 }}>{t("corpus.title")}</Title>
          <Typography variant="subtitle1">{t("corpus.subtitle")}</Typography>

          {/*
           * We wrap the CorpusGrid in a div to remove a children prop validation error
           * CorpusGrid is a server component, so the parent <Article> sees it as server-rendered
           * HTML and not a proper ReactNode
           */}
          <div>
            <CorpusGrid />
          </div>

          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <CorpusButton>{t("corpus.seeMoreButton")}</CorpusButton>
            <CorpusButton>{t("corpus.contactButton")}</CorpusButton>
          </Box>
        </Article>

        {/* Gateways */}
        <Article
          sx={{ flex: 1, px: 3, bgcolor: "colors.blue", color: "colors.white" }}
        >
          <Title sx={{ mb: 4 }}>{t("gateways.title")}</Title>
          <Paragraph sx={{ fontWeight: "bold" }}>
            {t("gateways.subtitle")}
          </Paragraph>
          <Paragraph>{t("gateways.paragraph")}</Paragraph>
          <Paragraph>{t("gateways.buttonTop")}</Paragraph>
          <Box sx={{ display: "flex", gap: 2, pt: 1, mb: 4 }}>
            {usages
              .filter(({ isGateway }) => isGateway)
              .map(({ name, label, url }) => (
                <GatewayButton key={name} href={url}>
                  {tUsages(label)}
                </GatewayButton>
              ))}
          </Box>
          <Paragraph sx={{ fontWeight: "bold" }}>
            {t("gateways.gatewaySuggestion")}
          </Paragraph>
          <Typography
            sx={{ fontWeight: "bold", display: "inline-flex", gap: 1 }}
          >
            {t("gateways.contactButton")} <ArrowRightAltIcon />
          </Typography>
        </Article>
      </Container>
    </Box>
  );
};

const Title: ClientComponent<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h5" {...props} />
);

const Article: ClientComponent<Omit<BoxProps, "component" | "pt" | "pb">> = (
  props
) => <Box component="article" pt={8} pb={6} {...props} />;

const Paragraph: ClientComponent<
  Omit<TypographyProps, "variant" | "paragraph">
> = (props) => <Typography variant="body2" paragraph {...props} />;

const CorpusButton: ClientComponent<unknown, true> = ({ children }) => (
  <Button mainColor="colors.blue" secondaryColor="colors.white">
    {children}
  </Button>
);

const GatewayButton: ClientComponent<{ href: string }, true> = ({
  href,
  children,
}) => (
  <Button
    mainColor="colors.white"
    secondaryColor="colors.blue"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </Button>
);

export default CorpusSection;
