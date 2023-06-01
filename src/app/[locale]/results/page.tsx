import { useTranslations } from 'next-intl';
import { Typography } from '@/mui/material';
import type { Page } from '@/types/next';

const ResultsPage: Page = () => {
  const t = useTranslations('results.ResultsPage');

  return <Typography>{t('selectResult')}</Typography>;
};

export default ResultsPage;
