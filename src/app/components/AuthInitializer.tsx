'use client'
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { verifyToken } from '../lib/tokenConfig/verifyToken';
import { getUserById } from '../actions/userActions';

const AuthInitializer: React.FC = () => {
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  const setUser = useUserStore(state => state.setUser)

  useEffect(() => {
    console.log("AuthInitializer rendered!");
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("All cookies:", document.cookie);

      try {
        const tokenFromCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))?.split('=')[1];

        console.log("Token from cookie:", tokenFromCookie);

        if (tokenFromCookie) {
          const res = await verifyToken(tokenFromCookie);
          console.log("verifyToken response:", res);

          if (res.isValid) {
            const user = await getUserById(res.decoded.userId);
            console.log("Fetched user:", user);

            setUser(user);
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
      }
    };

    initializeAuth();
  }, [setUser, setIsAuthenticated]);

  return null;
};
export default AuthInitializer;
