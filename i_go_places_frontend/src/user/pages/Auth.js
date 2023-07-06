import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  // uses the useContext hook to access the authentication context from AuthContext
  const auth = useContext(AuthContext);
  // initializes necessary states using the useState hook, such as isLoginMode to manage the login/signup mode
  const [isLoginMode, setIsLoginMode] = useState(true);
  // useHttpClient hook is used to handle HTTP requests
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // useForm hook is used to manage the form state and input handling
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  // switchModeHandler, is called when the "Switch to Signup/Login" button is clicked.
  // It switches the mode between login and signup by toggling the isLoginMode state.
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  // called when the authentication form is submitted
  const authSubmitHandler = async event => {
    event.preventDefault();  //prevents the default form submission behavior

    if (isLoginMode) {
      try {
        // sends a login request to the backend server using the sendRequest 
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +'/users/login',
          'POST',      // sends a POST request to the /users/login endpoint with the user's email and password
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token);    // to set the user's authentication status

      } catch (err) {}
    } else {
      try {
        // creates a formData object and appends the user's email, name, password, and image data
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        // console.log(formState.inputs.image.value);
        // for (var key of formData.entries()) {
        //     console.log(key[0] + ', ' + key[1]);
        // }
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +'/users/signup',
          'POST',        // POST request to the /users/signup endpoint with the form data
          formData
        );

        auth.login(responseData.userId, responseData.token);   //function is called to set the user's authentication status.

      } catch (err) {}
    }
  };

  // renders the JSX code for the authentication form
  // omponent to display any errors, a Card component as a container for the form, 
  // and a LoadingSpinner component to show a loading spinner while the form is being processed.
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}     
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
              //  validators={[VALIDATOR_EMAIL()]}    array of validator functions to validate the input   
            // onInput={inputHandler}    a function that is called whenever the input field value changes. It is responsible for handling the input and updating the form state.
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
           // inverse: It is a boolean prop that determines the styling of the button. 
          // When set to true, it applies the "inverse" style, which typically means a button with a light background and dark text.
          // onClick: It is a function that is called when the button is clicked. In this case, it calls the switchModeHandler function when the button is clicked.
          // Children (text): The text content between the opening and closing tags of the <Button> component is the content of the button. 
          // It displays the text "SWITCH TO" followed by either "SIGNUP" or "LOGIN" based on the isLoginMode state. 
          // If isLoginMode is true, it displays "LOGIN", otherwise it displays "SIGNUP".
          
      </Card>
    </React.Fragment>
  );
};

export default Auth;
