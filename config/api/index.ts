import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie';

interface CallAPIProps extends AxiosRequestConfig {
  token?: boolean;
  serverToken?: string;
}

export default async function callAPI({
  url, method, data, token, serverToken,
}: CallAPIProps) {
  let headers = {};

  if (serverToken) {
    headers = {
      Authorization: `Bearer ${serverToken}`,
    };
  } else if (token) {
    const tokenCookies = Cookies.get('token');
    if (tokenCookies) {
      const jwtToken = atob(tokenCookies);
      headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
    }
  }

  try {
    const response = await axios({
      url,
      method,
      data,
      headers,
    });

    const { length } = Object.keys(response.data);
    return {
      error: false,
      message: 'success',
      data: length > 1 ? response.data : response.data.data,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // err is an instance of AxiosError
      const response = err.response;

      if (response) {
        return {
          error: true,
          message: response.data.message,
          data: null,
        };
      }

      // Handle Axios errors that do not have a response
      return {
        error: true,
        message: err.message || 'An unexpected error occurred',
        data: null,
      };
    }

    // Handle unexpected errors that are not Axios errors
    return {
      error: true,
      message: 'An unexpected error occurred',
      data: null,
    };
  }
}
