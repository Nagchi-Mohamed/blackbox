// ... existing code ...
const AuthRoutes = React.lazy(() => import('./routes/AuthRoutes'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthRoutes />
      <Dashboard />
    </Suspense>
  );
}