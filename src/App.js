const express = require('express');
const app = express();
const AuthRoutes = React.lazy(() => import('./routes/AuthRoutes'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));

// Remove React components from server file
app.use(require('./middleware/errorHandler'));

module.exports = app;

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthRoutes />
      <Dashboard />
    </Suspense>
  );
}