import Link from 'next/link';
import { Box, List, ListItemButton, ListItemText, Typography } from '@/components/@mui/material';
import { results } from './results';
import type { Layout } from '@/lib/helperTypes';

export const metadata = {
  title: 'Istex-DL - results',
};

const ResultsLayout: Layout = ({ children }) => {
  return (
    <main>
      <Typography
        variant='h3'
        sx={{ py: 3 }}
      >
        Results
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <Box component='aside' sx={{ pr: 2 }}>
          <List>
            {results.map(result => (
              <ListItemButton key={result.id}>
                <ListItemText>
                  <Link href={`/results/${result.id}`}>
                    {result.name}
                  </Link>
                </ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box width={0.3}>{children}</Box>
      </Box>
    </main>
  );
};

export default ResultsLayout;
