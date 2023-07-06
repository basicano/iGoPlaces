import { useCallback, useReducer } from 'react';

// provides a way to manage form state, input validation, and input change handling in a reusable manner.
// formReducer is a function that takes the current state and an action as parameters and returns a new state based on the action type
const formReducer = (state, action) => {
  // handles two types of actions: 'INPUT_CHANGE' and 'SET_DATA'
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return state;
  }
};

// useForm hook is defined. 
// It takes initialInputs (an object representing the initial input values and validity) and 
// initialFormValidity (a boolean representing the initial form validity) as parameters.
export const useForm = (initialInputs, initialFormValidity) => {

  // uses the useReducer hook to manage the state using the formReducer function. 
  // The initial state is set with the initialInputs and initialFormValidity values.
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  // inputHandler function dispatches an 'INPUT_CHANGE' action to update the input value and
  // validity based on the provided parameters (id, value, isValid).
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);

  // setFormData function dispatches a 'SET_DATA' action to set the inputs and 
  // form validity based on the provided data (inputData, formValidity).
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);

  return [formState, inputHandler, setFormData];
};
