import { useTranslations } from "next-intl";
import {
  Box,
  DialogActions,
  DialogContent,
  Link,
  Typography,
} from "@mui/material";
import Modal from "@/components/Modal";
import Panel, { type PanelProps } from "@/components/Panel";
import RichText from "@/components/RichText";

interface MemoModalProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    name: "general",
    listLength: 3,
  },
  {
    name: "operators",
    listLength: 3,
  },
  {
    name: "fields",
    listLength: 3,
  },
  {
    name: "metacharacters",
    listLength: 3,
  },
  {
    name: "parentheses",
    listLength: 1,
  },
  {
    name: "intervals",
    listLength: 1,
  },
  {
    name: "boosting",
    listLength: 2,
  },
  {
    name: "fuzzy",
    listLength: 1,
  },
  {
    name: "proximity",
    listLength: 1,
  },
  {
    name: "regex",
    listLength: 1,
  },
] as const;

export default function HistoryModal({ open, onClose }: MemoModalProps) {
  const t = useTranslations("results.MemoModal");

  return (
    <Modal title={t("title")} open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {t.rich("subtitle", {
            link: (chunks) => (
              <Link
                href="https://www.elastic.co/elasticsearch"
                target="_blank"
                rel="noreferrer"
              >
                {chunks}
              </Link>
            ),
          })}
        </Typography>

        <Box
          sx={{
            columnCount: { sm: 1, md: 2 },
            columnGap: 1,
            "& > *": {
              breakInside: "avoid",
              "&:not(:last-child)": {
                mb: 1,
              },
            },
            "& pre": {
              overflowX: "auto",
            },
          }}
        >
          {sections.map(({ name, listLength }) => (
            <CustomPanel key={name} heading={t(`${name}.title`)}>
              <Box
                component="ul"
                sx={(theme) => ({
                  listStyle: "unset",
                  pl: "1em",
                  fontSize: theme.typography.body2.fontSize,
                })}
              >
                {Array(listLength)
                  .fill(0)
                  .map((_, i) => (
                    <li key={i}>
                      <RichText>
                        {(tags) => t.rich(`${name}.list.${i}`, tags)}
                      </RichText>
                    </li>
                  ))}
              </Box>
            </CustomPanel>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Link
          href="https://lucene.apache.org/core/10_0_0/queryparser/org/apache/lucene/queryparser/classic/package-summary.html"
          target="_blank"
          rel="noreferrer"
          sx={{ fontWeight: "bold" }}
        >
          {t("seeMoreLink")}
        </Link>
      </DialogActions>
    </Modal>
  );
}

export function CustomPanel(props: PanelProps) {
  const { children, ...rest } = props;

  return (
    <Panel component="section" headingLevel={3} {...rest}>
      {children}
    </Panel>
  );
}
