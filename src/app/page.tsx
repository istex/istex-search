import NextLink from 'next/link';
import { Container, Link, Typography } from '@/components/@mui/material';
import type { Page } from '@/lib/helperTypes';

const HomePage: Page = () => {
  return (
    <Container component='main'>
      <Typography variant='h3' py={3}>
        Hello, Istex-DL!
      </Typography>
      <Link href='/results' component={NextLink}>Go to results</Link>
    </Container>
  );
};

export default HomePage;
