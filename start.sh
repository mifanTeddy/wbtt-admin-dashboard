#!/bin/bash

# 安装必要的依赖项
echo "Installing dependencies..."
pnpm install react-router-dom sass antd axios

# 创建必要的目录结构
echo "Setting up directory structure..."
mkdir -p src/components src/pages src/context src/styles src/services

# 生成全局样式 global.scss
echo "Generating global.scss..."
cat > src/styles/global.scss <<EOL
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
EOL

# 生成 AuthProvider.tsx
echo "Generating AuthProvider.tsx..."
cat > src/context/AuthProvider.tsx <<EOL
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      message.success('Login successful');
      navigate('/');
    } else {
      message.error('Invalid username or password');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    message.info('Logged out');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
EOL

# 生成 API 服务文件 services/api.ts
echo "Generating api.ts..."
cat > src/services/api.ts <<EOL
import axios from 'axios';

const API_BASE_URL = 'https://venture.hzchainup.com/v1/event/admin';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: 'GpohjHpJxudTW1WgfK4kgUml35itZaDo5qu39z6',
  },
});

export const fetchEventList = async () => {
  const response = await instance.get('/list');
  return response.data.data.events;
};

export const toggleEventShow = async (id: number, isShow: number) => {
  await instance.post('/set-show', { id, is_show: isShow });
};

export const deleteEvent = async (id: number) => {
  await instance.post('/delete', { id });
};

export const setEventSort = async (id: number, sort: number) => {
  await instance.post('/set-sort', { id, sort });
};
EOL

# 生成 Login 页面
echo "Generating Login.tsx..."
cat > src/pages/Login.tsx <<EOL
import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import styles from './Login.module.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    auth?.login(username, password);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
EOL

# 生成 Login 样式 Login.module.scss
echo "Generating Login.module.scss..."
cat > src/pages/Login.module.scss <<EOL
.loginPage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.loginBox {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 350px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.inputGroup {
  margin-bottom: 15px;
}

.input {
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  width: 100%;
}

.submitButton {
  padding: 10px;
  background-color: #1890ff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submitButton:hover {
  background-color: #40a9ff;
}
EOL

# 生成 Dashboard 页面
echo "Generating Dashboard.tsx..."
cat > src/pages/Dashboard.tsx <<EOL
import React, { useEffect, useState } from 'react';
import { fetchEventList, toggleEventShow, deleteEvent, setEventSort } from '../services/api';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEventList();
      setEvents(data);
    };
    fetchData();
  }, []);

  const handleToggleShow = async (id: number, isShow: number) => {
    await toggleEventShow(id, isShow === 1 ? 0 : 1);
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, is_show: isShow === 1 ? 0 : 1 } : event
      )
    );
  };

  const handleDelete = async (id: number) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const handleSortChange = async (id: number, newSort: number) => {
    await setEventSort(id, newSort);
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, sort_order: newSort } : event))
    );
  };

  return (
    <div className={styles.dashboard}>
      <h2>Event List</h2>
      <ul className={styles.eventList}>
        {events.map((event) => (
          <li key={event.id} className={styles.eventItem}>
            <span>{event.event_title} (Sort: {event.sort_order})</span>
            <button onClick={() => handleToggleShow(event.id, event.is_show)}>
              {event.is_show ? 'Hide' : 'Show'}
            </button>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
            <input
              type="number"
              value={event.sort_order}
              onChange={(e) => handleSortChange(event.id, Number(e.target.value))}
              className={styles.sortInput}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
EOL

# 生成 Dashboard 样式 Dashboard.module.scss
echo "Generating Dashboard.module.scss..."
cat > src/pages/Dashboard.module.scss <<EOL
.dashboard {
  padding: 20px;
}

.eventList {
  list-style: none;
  padding: 0;
}

.eventItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sortInput {
  width: 50px;
  padding: 5px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
EOL

# 生成路由配置文件 router.tsx
echo "Generating router.tsx..."
cat > src/router.tsx <<EOL
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthProvider';

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
    </Routes>
  </Router>
);

export default AppRouter;
EOL

# 生成入口文件 App.tsx
echo "Generating App.tsx..."
cat > src/App.tsx <<EOL
import React from 'react';
import AppRouter from './router';
import { AuthProvider } from './context/AuthProvider';
import 'antd/dist/reset.css';  // Antd 样式重置
import './styles/global.scss';

const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;
EOL

# 启动项目
echo "Setup complete! Now you can run 'pnpm dev' to start the project."