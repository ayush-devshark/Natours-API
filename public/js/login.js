/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    // axios will itself throw a new Error, if there is an error
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: { email, password },
    });
    console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', 'Logged In successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  // BUG
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    // Fresh page coming down from the server
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAert('error', 'Error logging out! Try again.');
  }
};
