import type { Layout } from '@/lib/helperTypes';
import pkg from '../../package.json';

export const metadata = {
  title: 'Istex-DL',
  description: pkg.description,
};

const RootLayout: Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
