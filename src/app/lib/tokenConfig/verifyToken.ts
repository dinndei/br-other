
import axios from 'axios';

export async function verifyToken(token: string) {

  try {
    const response = await axios.get('/api/user/verify-token', {
      headers: {
        token,
      },
    });

    if (response.data.isValid) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error;
  }
}

