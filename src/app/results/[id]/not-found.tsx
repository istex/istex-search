import { Alert, AlertTitle } from '@/components/@mui/material';

const NotFound: React.FC = () => {
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
