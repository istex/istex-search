import pkg from '../../package.json';
import MuiSetup from '@/lib/mui/setup';
import Navbar from './Navbar';
import type { Layout } from '@/lib/helperTypes';

export const metadata = {
  title: 'Istex-DL',
  description: pkg.description,
};

const RootLayout: Layout = ({ children }) => {
  return (
    <html lang='en'>
      <body>
        <MuiSetup>
          <Navbar />
          {children}
        </MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
