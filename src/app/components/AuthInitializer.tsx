'use client'
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { verifyToken } from '../lib/tokenConfig/verifyToken';

const AuthInitializer: React.FC = () => {
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);

  useEffect(() => {
    const tokenFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))?.split('=')[1];

    const checkToken = async (token: string | null) => {
      if (token && await verifyToken(token)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    if (tokenFromCookie) {
      checkToken(tokenFromCookie);
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]); // רק אחרי שהקומפוננטה מנותקת

  return null;
};

export default AuthInitializer;
