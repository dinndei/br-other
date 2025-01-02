
import axios from 'axios';

export async function verifyToken(token: string) {
    
  try {
    const response = await axios.get('/api/user/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (response.data.isValid) {
      console.log("res verify token",response);
      
      console.log('Token is valid');
      return response.data.decoded;
    } else {
      console.log('Token is invalid');
      return response.data;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
  }
}

