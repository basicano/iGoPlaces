import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  // returns an object with properties such as isLoading (indicating whether a request is in progress), error (holding any error that occurred during the request), 
  // sendRequest (a function to send HTTP requests), and clearError (a function to clear the error).
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  // useState hook to define a state variable loadedUsers, which will store the fetched user data.
  const [loadedUsers, setLoadedUsers] = useState();

  // useEffect hook is used to fetch the list of users when the component mounts
  useEffect(() => {
    //  uses the sendRequest function to send a GET request to the backend API (/users)
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +'/users'
        );

        // stored in the loadedUsers state variable using the setLoadedUsers function.
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);  // dependency array [sendRequest] ensures that the effect is only re-executed if sendRequest changes

  // It includes an ErrorModal component to display any errors, a conditional rendering of the LoadingSpinner component when isLoading is true, 
  // and the UsersList component when isLoading is false and loadedUsers is not null
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
