import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import AdminAccount from './components/pages/AdminAccount';
import './components/assets/css/Style.css';
import { useEffect, useState } from 'react';
import BackendURL from './components/backend URL/BackendURL';
import axios from 'axios';
import StaffAccount from './components/pages/StaffAccount';
import StudentAccount from './components/pages/StudentAccount';

function App() {
  const backendUrl = BackendURL();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null
  const token = localStorage.getItem('token');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    if (token) {
      const test = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/protected`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      };

      test();
    } else {
      setIsAuthenticated(false);
    }
  }, [token, backendUrl]);

  if (isAuthenticated === null) {
    // Return a loading indicator while the asynchronous operation is in progress
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {isAuthenticated ? (
          <>
            <Route path="/admin" element={<AdminAccount />} />
            <Route path="/staff" element={<StaffAccount />} />
            <Route path="/student" element={<StudentAccount />} />
          </>
        ) : (
          <Route path="/" element={<Login />} />
        )}

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

function LoadingSpinner() {
  return (
    <div className="popup-modal-profile">
      <div className="modal-pop-up-loading">
        <div className="modal-pop-up-loading-spiner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default App;
