'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@/components/@mui/material';
import { FavoriteIcon } from '@/components/@mui/icons-material';
import { type ClientComponent } from '@/lib/helperTypes';
import type { Result } from '../results';

interface ResultModalProps {
  result: Result;
}

const ResultModal: ClientComponent<ResultModalProps, false> = ({ result }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const close = (): void => {
    setOpen(false);
    router.push('/results');
  };

  return (
    <Dialog open={open} onClose={close}>
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
