'use client';

import { forwardRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Typography } from '@/components/@mui/material';
import { FavoriteIcon } from '@/components/@mui/icons-material';
import useTheme from '@mui/material/styles/useTheme';
import type { TransitionProps } from '@mui/material/transitions';
import type { ClientComponent } from '@/types/next';
import type { Result } from '../results';

interface ResultModalProps {
  result: Result;
}

const Transition = forwardRef(function Transition (
  props: TransitionProps & { children: React.ReactElement; },
  ref: React.Ref<unknown>,
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const ResultModal: ClientComponent<ResultModalProps> = ({ result }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  const close = (): void => {
    setOpen(false);

    // Wait until the leaving screen animation is over to go back to the /results page
    setTimeout(() => {
      router.push('/results');
    }, theme.transitions.duration.leavingScreen);
  };

  return (
    <Dialog open={open} onClose={close} TransitionComponent={Transition}>
      <DialogTitle>{result.name}</DialogTitle>
      <DialogContent>
        <Typography mb={1.5} color='text.secondary'>{result.id}</Typography>
        <Typography>{result.description}</Typography>
      </DialogContent>
      <DialogActions>
        <IconButton aria-label='add to favorites'>
          <FavoriteIcon sx={{ color: 'colors.green.dark' }} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default ResultModal;
