import { CircularProgress, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bgcolor="primary.main"
    >
      <CircularProgress color="secondary" size={60} />
    </Box>
  );
};

export default Loading;