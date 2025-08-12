import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import GrantsPage from './pages/GrantsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grants" element={<GrantsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* <Route path="/my-applications" element={
            <PrivateRoute>
              <MyApplicationsPage />
            </PrivateRoute>
          } /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;