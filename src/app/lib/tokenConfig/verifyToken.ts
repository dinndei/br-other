
import axios from 'axios';

export async function verifyToken(token: string) {

  try {
    const response = await axios.get('https://br-other.vercel.app/api/user/verify-token', {
      headers: {
        token,
      },
    });

    if (response.data.isValid) {
      return response.data.decoded;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error;
  }
}

