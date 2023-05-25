import { CircularProgress } from '@/components/@mui/material';
import type { ServerComponent } from '@/lib/helperTypes';

const Loading: ServerComponent = () => {
  return <CircularProgress color='primary' />;
};

export default Loading;
