import { Alert, AlertTitle, Box } from '@/components/@mui/material';
import type { ServerComponent } from '@/lib/helperTypes';

const NotFound: ServerComponent = () => {
  return (
    <Box>
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        Not Found!
      </Alert>
    </Box>
  );
};

export default NotFound;
