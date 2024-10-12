import AppRouter from "./router";
import { AuthProvider } from "./context/AuthProvider";
import "antd/dist/reset.css";
// import "antd/dist/antd.dark.css";
import "./styles/global.scss";
import ErrorBoundary from "./ErrorBoundary";
import { ConfigProvider, theme } from "antd";

const App = () => (
  <AuthProvider>
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <AppRouter />
      </ConfigProvider>
    </ErrorBoundary>
  </AuthProvider>
);

export default App;
