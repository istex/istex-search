import pkg from '../../package.json';

export const metadata = {
  title: 'Istex-DL',
  description: pkg.description,
};

export default function RootLayout ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
