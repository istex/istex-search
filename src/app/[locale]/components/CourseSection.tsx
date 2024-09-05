import { useTranslations } from "next-intl";
import { Box, Container, Typography } from "@mui/material";
import courseImage from "@/../public/courses.webp";
import Button from "@/components/Button";

export default function CourseSection() {
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
          sx={{ maxWidth: "65ch", mx: "auto", mb: 2 }}
        >
          {t("body")}
        </Typography>
        <Button
          href="https://www.istex.fr/formations/"
          target="_blank"
          rel="noreferrer"
        >
          {t("button")}
        </Button>
      </Container>
    </Box>
  );
}
