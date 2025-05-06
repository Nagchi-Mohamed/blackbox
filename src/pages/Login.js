// ... existing code ...
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  const success = await auth.login(username, password);
  if (!success) {
    setError('Login failed. Please check your credentials.');
  }
};
// ... existing code ...