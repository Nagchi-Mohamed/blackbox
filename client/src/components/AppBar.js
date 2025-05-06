import { AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default AppBar;