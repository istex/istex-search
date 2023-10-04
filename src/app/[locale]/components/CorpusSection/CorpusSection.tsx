import { useTranslations } from "next-intl";
import { Box, Container, Link, Typography } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";
import type { TypographyProps } from "@mui/material/Typography";
import CorpusGrid from "./CorpusGrid";
import corpus from "./corpus";
import wires from "@/../public/wires.svg";
import Button from "@/components/Button";
import { usages } from "@/config";
import type { ClientComponent, ServerComponent } from "@/types/next";

const CorpusSection: ServerComponent = () => {
  const t = useTranslations("home.CorpusSection");
  const tUsages = useTranslations("config.usages");

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `url(${wires.src as string})`,
        backgroundPosition: "bottom left",
        backgroundRepeat: "no-repeat",
        bgcolor: "#f6f9fa",
        mb: { xs: 6, sm: 0 },
      }}
    >
      <Container
        sx={{
          display: { xs: "block", sm: "flex" },
          gap: { xs: 0, sm: 3, md: 8 },
        }}
      >
        {/* Ready-to-use corpus */}
        <Article sx={{ flex: 1.5 }}>
          <Title>{t("corpus.title")}</Title>
          <Typography variant="subtitle1">
            {t("corpus.subtitle", { corpusLength: corpus.length })}
          </Typography>
          <CorpusGrid />
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <CorpusButton href="https://corpus-specialises.corpus.istex.fr/">
              {t("corpus.seeMoreButton")}
            </CorpusButton>
            <CorpusButton href="https://www.istex.fr/contactez-nous/">
              {t("corpus.contactButton")}
            </CorpusButton>
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
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1, mb: 4 }}>
            {Object.entries(usages)
              .filter(([_, { isGateway }]) => isGateway)
              .map(([name, { url }]) => (
                <GatewayButton key={name} href={url}>
                  {tUsages(`${name}.label`)}
                </GatewayButton>
              ))}
          </Box>
          <Paragraph sx={{ fontWeight: "bold" }}>
            {t("gateways.gatewaySuggestion")}
          </Paragraph>
          <Link
            color="colors.white"
            fontWeight="bold"
            href="https://www.istex.fr/contactez-nous/"
            target="_blank"
            rel="noreferrer"
          >
            {t("gateways.contactButton")}
          </Link>
        </Article>
      </Container>
    </Box>
  );
};

const Title: ClientComponent<
  Omit<
    TypographyProps & { component?: React.ElementType },
    "variant" | "gutterBottom"
  >
> = (props) => (
  <Typography variant="h5" component="h3" gutterBottom {...props} />
);

const Article: ClientComponent<Omit<BoxProps, "component" | "pt" | "pb">> = (
  props,
) => <Box component="article" pt={8} pb={6} {...props} />;

const Paragraph: ClientComponent<
  Omit<TypographyProps, "variant" | "paragraph">
> = (props) => <Typography variant="body2" paragraph {...props} />;

const CorpusButton: ClientComponent<{ href: string }, true> = ({
  href,
  children,
}) => (
  <Button variant="outlined" href={href} target="_blank" rel="noreferrer">
    {children}
  </Button>
);

const GatewayButton: ClientComponent<{ href: string }, true> = ({
  href,
  children,
}) => (
  <Button
    variant="outlined"
    mainColor="white"
    secondaryColor="blue"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </Button>
);

export default CorpusSection;
