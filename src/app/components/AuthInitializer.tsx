'use client'
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { verifyToken } from '../lib/tokenConfig/verifyToken';

const AuthInitializer: React.FC = () => {
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  const setUser = useUserStore(state => state.setUser)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenFromCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))?.split('=')[1];

        if (tokenFromCookie) {
          const res = await verifyToken(tokenFromCookie);
          if (res.isValid) {
            setUser(res.decoded.user);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setUser(null);
        setIsAuthenticated(false);
        throw new Error;
      }
    };

    initializeAuth();
  }, [setUser, setIsAuthenticated]);

  return null;
};
export default AuthInitializer;
