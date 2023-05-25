import Link from 'next/link';
import { Box, Container, List, ListItem, ListItemButton, ListItemText, Typography } from '@/components/@mui/material';
import { results } from './results';
import type { Layout } from '@/lib/helperTypes';

export const metadata = {
  title: 'Istex-DL - results',
};

const ResultsLayout: Layout = ({ children }) => {
  return (
    <Container component='main'>
      <Typography variant='h3' py={3}>
        Results
      </Typography>
      <Box display='flex'>
        <Box component='aside' pr={2}>
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {results.map(result => (
              <ListItem key={result.id} disablePadding>
                <ListItemButton
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
              </ListItem>
            ))}
          </List>
        </Box>

        <Box width={0.3}>{children}</Box>
      </Box>
    </Container>
  );
};

export default ResultsLayout;
