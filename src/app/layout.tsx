import type { Layout } from '@/lib/helperTypes';
import pkg from '../../package.json';
import MuiSetup from '@/lib/mui/setup';

export const metadata = {
  title: 'Istex-DL',
  description: pkg.description,
};

const RootLayout: Layout = ({ children }) => {
  return (
    <html lang='en'>
      <body>
        <MuiSetup>{children}</MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
