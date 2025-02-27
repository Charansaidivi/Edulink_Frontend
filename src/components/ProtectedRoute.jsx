import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('loginToken');
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        if (error.response?.data?.expired) {
          localStorage.removeItem('loginToken');
          window.location.href = '/login';
        }
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;