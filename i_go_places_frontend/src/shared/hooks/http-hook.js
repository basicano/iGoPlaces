import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // activeHttpRequests is a useRef object that keeps track of the active HTTP requests using an array. 
  // It will be used to abort any pending requests when the component using this hook is unmounted.
  const activeHttpRequests = useRef([]);

  // sendRequest function is defined using the useCallback hook. 
  // It is responsible for sending HTTP requests using the Fetch API. 
  // It takes in the URL, HTTP method (defaulted to 'GET'), request body (defaulted to null), 
  // and request headers as parameters.
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();  //  controller will allow us to abort the request if needed
      activeHttpRequests.current.push(httpAbortCtrl);  // httpAbortCtrl is added to the activeHttpRequests array to keep track of the active requests.

      try {
        // console.log(url);
        // send the actual request using the fetch function. It awaits the response 
        const response = await fetch(url, {method,body,headers,signal: httpAbortCtrl.signal});

        // extracts the response data using response.json()
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        // console.log(err);
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // useEffect hook is used to define a cleanup function that will be called when the component unmounts. 
  // It iterates over each httpAbortCtrl in the activeHttpRequests array and calls the abort method to cancel any ongoing requests.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      console.log("abortinghere");
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
