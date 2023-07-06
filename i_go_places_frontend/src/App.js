// modules and components are used for building React components, managing routing in the application, and handling navigation.
import React, {Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

// Lazily loading components means they will be loaded only when they are actually needed, improving the performance of the application. 
const Users = React.lazy( ()=> import('./user/pages/Users'));
const NewPlace = React.lazy( ()=> import('./places/pages/NewPlace'));
const UserPlaces = React.lazy( ()=> import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy( ()=> import('./places/pages/UpdatePlace'));
const Auth = React.lazy( ()=> import('./user/pages/Auth'));

const App = () => {

  // he useAuth hook to get authentication-related data and functions such as token, login, logout, and userId.
  const { token, login, logout, userId } = useAuth();

  //  routes variable that will hold the JSX code for routing based on the authentication status. 
  let routes;

  if (token) {
    // If a token is present, meaning the user is authenticated, it sets up routes for Users, UserPlaces, NewPlace, and UpdatePlace components. 
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    // otherwise it sets up routes for Users, UserPlaces, and Auth components.
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  // return statement renders the JSX code for the entire application. We wrap the application with the AuthContext.
  // Provider component to provide the authentication context to all child components. 
  // Inside the provider, we define the values of the authentication context, including isLoggedIn, token, userId, login, and logout.
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
  // Router component from react-router-dom to enable routing functionality. 
      <Router>
        // MainNavigation component renders the main navigation bar.
        <MainNavigation />
        // The main content of the application is wrapped in the Suspense component, which provides a fallback loading spinner while lazy components are being loaded.
        <main><Suspense fallback={<div className="center">
          <LoadingSpinner />
        </div>
      }>{routes}</Suspense></main>
        // routes variable is rendered inside the Suspense component.
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
