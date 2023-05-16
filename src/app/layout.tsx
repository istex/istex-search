import type { Layout } from '@/lib/helperTypes';
import pkg from '../../package.json';
import MuiSetup from '@/lib/MuiSetup';
import { Container } from '@/components/@mui/material';

export const metadata = {
  title: 'Istex-DL',
  description: pkg.description,
};

const RootLayout: Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <MuiSetup>
          <Container>
            {children}
          </Container>
        </MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
