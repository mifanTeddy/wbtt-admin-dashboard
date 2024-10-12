import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthProvider";
import NotFound from "./pages/NotFound";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  return auth?.isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default AppRouter;
