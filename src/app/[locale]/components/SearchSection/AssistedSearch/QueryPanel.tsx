import { useTranslations } from "next-intl";
import Image from "next/image";
import { Box, Paper, Stack, Typography } from "@mui/material";
import AssistedSearchIcon from "@/../public/assisted-search.svg";
import ExpertSearchIcon from "@/../public/expert-search-icon.svg";
import Button from "@/components/Button";
import { astToString, type AST } from "@/lib/assistedSearch/ast";
import type { ClientComponent } from "@/types/next";

interface QueryPanelProps {
  ast: AST;
  displayAssistedEditButton: boolean;
  onAssistedEditClick: () => void;
  onExpertEditClick: () => void;
}

const QueryPanel: ClientComponent<QueryPanelProps> = ({
  ast,
  displayAssistedEditButton,
  onAssistedEditClick,
  onExpertEditClick,
}) => {
  const t = useTranslations(
    "home.SearchSection.SearchInput.AssistedSearchInput",
  );

  return (
    <Paper
      data-testid="query-panel"
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        bgcolor: "colors.veryLightBlue",
      }}
    >
      <Stack alignSelf="center" sx={{ p: 2, width: "100%" }}>
        <Typography>{astToString(ast)}</Typography>
      </Stack>

      <Stack direction="row">
        {displayAssistedEditButton && (
          <QueryPanelButton
            icon={
              <Image src={AssistedSearchIcon} alt="" width={18} height={18} />
            }
            onClick={onAssistedEditClick}
          >
            {t("assistedButton")}
          </QueryPanelButton>
        )}

        <QueryPanelButton
          icon={<Image src={ExpertSearchIcon} alt="" width={18} height={18} />}
          onClick={onExpertEditClick}
        >
          {t("expertButton")}
        </QueryPanelButton>
      </Stack>
    </Paper>
  );
};

interface QueryPanelButtonProps {
  icon: JSX.Element;
  onClick: () => void;
}

const QueryPanelButton: ClientComponent<QueryPanelButtonProps, true> = ({
  icon,
  onClick,
  children,
}) => (
  <Button
    variant="text"
    onClick={onClick}
    sx={{
      flexDirection: "column",
      fontSize: "0.5rem",
      gap: 0.5,
      color: "colors.lightBlack",
    }}
  >
    <Box
      sx={(theme) => ({
        backgroundColor: "white",
        padding: 0.5,
        borderRadius: "100%",
        aspectRatio: 1,
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
      })}
    >
      {icon}
    </Box>
    {children}
  </Button>
);

export default QueryPanel;
