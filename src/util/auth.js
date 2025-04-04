import jwt from 'jsonwebtoken';

export const isTokenValid = (token, options = { checkExpiration: true }) => {
  if (!token) return false;
  
  try {
    if (token.split('.').length === 3) {
      const decoded = jwt.decode(token);

      if (!decoded) {
        return false;
      }
      
      if (options.checkExpiration && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          return false;
        }
      }
      
      return true;
    }
    return false;
    
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}
