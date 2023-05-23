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
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {results.map(result => (
              <ListItemButton
                key={result.id}
                href={`/results/${result.id}`}
                LinkComponent={Link}
                sx={{
                  color: 'colors.blue',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'colors.blue',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'colors.blue',
                    color: 'colors.white',
                  },
                }}
              >
                <ListItemText>
                  {result.name}
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
