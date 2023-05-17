import { Alert, AlertTitle } from '@/components/@mui/material';
import type { ServerComponent } from '@/lib/helperTypes';

const NotFound: ServerComponent = () => {
  return (
    <div>
      <Alert severity='error'>
        <AlertTitle>Error</AlertTitle>
        Not Found!
      </Alert>
    </div>
  );
};

export default NotFound;
