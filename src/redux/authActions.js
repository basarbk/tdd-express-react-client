import * as ACTIONS from './Constants';
import { login, logout } from '../api/apiCalls';

export const logoutSuccess = () => {
  return async function(dispatch) {
    try {
      await logout();
    } catch (err) {
      console.log('backend not ready with logout')
    }
    dispatch({
      type: ACTIONS.LOGOUT_SUCCESS
    })
  }
};

export const loginSuccess = authState => {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    payload: authState
  };
};

export const updateSuccess = ({ username, image }) => {
  return {
    type: ACTIONS.UPDATE_SUCCESS,
    payload: {
      username,
      image
    }
  };
};

export const loginHandler = credentials => {
  return async function(dispatch) {
    const response = await login(credentials);
    const authState = {
      id: response.data.id,
      username: response.data.username,
      image: response.data.image,
      token: response.data.token,
      ...credentials
    };
    dispatch(loginSuccess(authState));
    return response;
  };
};
