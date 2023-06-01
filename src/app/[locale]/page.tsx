import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { Container, Link, Typography } from '@/mui/material';
import type { Page } from '@/types/next';

const HomePage: Page = () => {
  const t = useTranslations('Home');

  return (
    <Container component='main'>
      <Typography variant='h3' py={3}>
        {t('title')}
      </Typography>
      <Link href='/results' component={NextLink}>{t('goToResults')}</Link>
    </Container>
  );
};

export default HomePage;
