import { useTranslations } from "next-intl";
import { Box, Container, Typography } from "@/mui/material";
import Button from "@/components/Button";
import type { ServerComponent } from "@/types/next";

const CourseSection: ServerComponent = () => {
  const t = useTranslations("Home.CourseSection");

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: "url(https://placehold.co/1280x500/png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        component="article"
        sx={{
          color: "colors.white",
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography variant="h4" sx={{ color: "colors.lightGreen", mb: 2 }}>
          {t("title")}
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={{ maxWidth: "65ch", mx: "auto" }}
        >
          {t("body")}
        </Typography>
        <Button
          variant="contained"
          mainColor="blue"
          secondaryColor="white"
          href="https://www.istex.fr/fouille-de-texte/#ancre6"
          target="_blank"
          rel="noreferrer"
        >
          {t("button")}
        </Button>
      </Container>
    </Box>
  );
};

export default CourseSection;
