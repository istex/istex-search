import { useTranslations } from 'next-intl';
import { Alert, AlertTitle, Box } from '@/components/@mui/material';
import type { ServerComponent } from '@/lib/helperTypes';

const NotFound: ServerComponent = () => {
  const t = useTranslations('NotFound');

  return (
    <Box>
      <Alert severity='error'>
        <AlertTitle>{t('title')}</AlertTitle>
        {t('content')}
      </Alert>
    </Box>
  );
};

export default NotFound;
