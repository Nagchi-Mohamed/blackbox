import { Container } from '@mui/material';
import ProfileEditor from '../components/user/ProfileEditor';

const ProfilePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ProfileEditor />
    </Container>
  );
};

export default ProfilePage; 