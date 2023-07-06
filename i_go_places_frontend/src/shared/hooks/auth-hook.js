import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

// initializes state variables using the useState hook.
export const useAuth = () => {
  const [token, setToken] = useState(false);          // the authentication token
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  // memoized callback function created using the useCallback hook. 
  // It takes the user ID (uid), authentication token, and optional expiration date as parameters. 
  // It updates the token, userId, and tokenExpirationDate states with the provided values. 
  // If an expiration date is not provided, it sets a default expiration date one hour from the current time. 
  // It also saves the user data in the browser's local storage using the localStorage.setItem method.
  
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  // memoized callback function created using the useCallback hook. 
  // It clears the token, tokenExpirationDate, and userId states, and removes the user data from the local storage.
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  // useEffect hook is used to handle the token expiration and automatically log out the user when the token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {  //  watches for changes in the token, tokenExpirationDate, and logout dependencies
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      // calculates the remaining time until the token expires and sets a timer using setTimeout
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // useEffect hook is used to automatically log in the user when the component mounts or when the login function changes. 
  useEffect(() => {
    // retrieves the user data from the local storage using localStorage.getItem and parses it to an object.
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  // hook returns an object containing the token, login, logout, and userId. These values can be used in any component that uses this hook to manage authentication.
  return { token, login, logout, userId };
};
