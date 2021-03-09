import axios from 'axios';

export const signup = body => {
  return axios.post('/api/1.0/users', body);
};

export const activate = token => {
  return axios.post('/api/1.0/users/token/'+token);
}

export const login = creds => {
  return axios.post('/api/1.0/auth', {...creds});
};

export const logout = () => {
  return axios.post('/api/1.0/logout');
}

export const changeLanguage = language => {
  axios.defaults.headers['accept-language'] = language;
};

export const getUsers = (page = 0, size = 3) => {
  return axios.get(`/api/1.0/users?page=${page}&size=${size}`);
};

export const setAuthorizationHeader = ({ email, password, token, isLoggedIn }) => {
  if (isLoggedIn) {
    let authorizationHeaderValue;
    if(token) {
      authorizationHeaderValue = `Bearer ${token}`
    } else {
      authorizationHeaderValue = `Basic ${btoa(email + ':' + password)}`;
    }
    axios.defaults.headers['Authorization'] = authorizationHeaderValue;
  } else {
    delete axios.defaults.headers['Authorization'];
  }
};

export const getUser = username => {
  return axios.get(`/api/1.0/users/${username}`);
};

export const updateUser = (username, body) => {
  return axios.put(`/api/1.0/users/${username}`, body);
};

export const postHoax = hoax => {
  return axios.post('/api/1.0/hoaxes', hoax);
};

export const getHoaxes = (username, page = 0) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : '/api/1.0/hoaxes?page=';
  return axios.get(path + page);
};

export const getOldHoaxes = (id, username) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/${id}` : `/api/1.0/hoaxes/${id}`;
  return axios.get(path);
};

export const getNewHoaxCount = (id, username) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/${id}?count=true` : `/api/1.0/hoaxes/${id}?count=true`;
  return axios.get(path);
};

export const getNewHoaxes = (id, username) => {
  const path = username ? `/api/1.0/users/${username}/hoaxes/${id}?direction=after` : `/api/1.0/hoaxes/${id}?direction=after`;
  return axios.get(path);
};

export const postHoaxAttachment = attachment => {
  return axios.post('/api/1.0/hoaxes/attachments', attachment);
};

export const deleteHoax = id => {
  return axios.delete(`/api/1.0/hoaxes/${id}`);
};

export const deleteUser = id => {
  return axios.delete(`/api/1.0/users/${id}`);
};

export const requestReset = email => {
  return axios.post('/api/1.0/user/password', {email});
}

export const putPassword = body => {
  return axios.put('/api/1.0/user/password', body);
}