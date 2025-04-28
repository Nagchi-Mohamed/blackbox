import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  deleteUser as firebaseDeleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  socialLogin, 
  resetPassword,
  verifyEmail,
  updateUserEmail,
  updateUserPassword,
  uploadProfilePicture,
  enableTwoFactorAuth,
  verifyTwoFactorCode
} from '../lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // In a real app, you would fetch from your database
        const roles = {
          isAdmin: false,
          isTeacher: false,
          isStudent: true
        };
        setUserRoles(roles);
      } else {
        setUserRoles({});
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email, password, name) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setCurrentUser({ ...userCredential.user, displayName: name });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await socialLogin(googleProvider);
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      const result = await socialLogin(facebookProvider);
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email) => {
    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyUserEmail = async () => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const result = await verifyEmail(currentUser);
      if (!result.success) throw result.error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (newEmail, password) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const result = await updateUserEmail(currentUser, newEmail, password);
      if (!result.success) throw result.error;
      setCurrentUser({ ...currentUser, email: newEmail });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword, currentPassword) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const result = await updateUserPassword(currentUser, newPassword, currentPassword);
      if (!result.success) throw result.error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePicture = async (file) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const result = await uploadProfilePicture(currentUser.uid, file);
      if (!result.success) throw result.error;
      
      await updateProfile(currentUser, { photoURL: result.url });
      setCurrentUser({ ...currentUser, photoURL: result.url });
      
      return { success: true, url: result.url };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async (phoneNumber, recaptchaVerifier) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const result = await enableTwoFactorAuth(currentUser, phoneNumber, recaptchaVerifier);
      if (!result.success) throw result.error;
      return { success: true, verificationId: result.verificationId };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const verify2FACode = async (verificationId, verificationCode) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const result = await verifyTwoFactorCode(currentUser, verificationId, verificationCode);
      if (!result.success) throw result.error;
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await firebaseDeleteUser(currentUser);
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    userRoles,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    sendPasswordReset,
    verifyUserEmail,
    changeEmail,
    changePassword,
    updateProfilePicture,
    enable2FA,
    verify2FACode,
    deleteAccount,
    logout,
    is2FAEnabled: currentUser?.multiFactor?.enrolledFactors?.length > 0
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 