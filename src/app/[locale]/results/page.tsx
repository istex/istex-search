import { useTranslations } from 'next-intl';
import { Typography } from '@/components/@mui/material';
import type { Page } from '@/lib/helperTypes';

const ResultsPage: Page = () => {
  const t = useTranslations('results.ResultsPage');

  return <Typography>{t('selectResult')}</Typography>;
};

export default ResultsPage;
