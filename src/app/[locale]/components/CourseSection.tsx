import { useTranslations } from "next-intl";
import { Box, Container, Typography } from "@mui/material";
import courseImage from "@/../public/courses.webp";
import Button from "@/components/Button";
import type { ServerComponent } from "@/types/next";

const CourseSection: ServerComponent = () => {
  const t = useTranslations("home.CourseSection");

  return (
    <Box
      component="section"
      sx={{
        backgroundImage: `url(${courseImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center 27%",
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
        <Typography
          variant="h4"
          component="h2"
          sx={{ color: "colors.lightGreen", mb: 2 }}
        >
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
