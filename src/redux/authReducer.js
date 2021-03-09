import * as ACTIONS from './Constants';

const defaultState = {
  isLoggedIn: false,
  id: undefined,
  username: undefined,
  email: undefined,
  image: undefined,
  password: undefined,
  token: undefined
};

const authReducer = (state = { ...defaultState }, action) => {
  if (action.type === ACTIONS.LOGOUT_SUCCESS) {
    return defaultState;
  } else if (action.type === ACTIONS.LOGIN_SUCCESS) {
    return {
      ...action.payload,
      isLoggedIn: true
    };
  } else if (action.type === ACTIONS.UPDATE_SUCCESS) {
    return {
      ...state,
      ...action.payload
    };
  }
  return state;
};

export default authReducer;
