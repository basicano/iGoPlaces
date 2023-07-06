import { createContext } from 'react';

// AuthContext object is initialized with a default value
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});
