import axios from 'axios';
import Cookies from 'js-cookie';

const ROOT_API = process.env.NEXT_PUBLIC_SERVER;

export async function getDashboard() {
  const URL = 'dashboard';

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .get(`${ROOT_API}/${URL}`, { headers: { Authorization: jwtToken } })
    .catch((err) => err.response);

  if (response.status > 300) {
    const res = {
      error: true,
      message: response.data.message,
      data: null,
    };
    return res;
  }

  const res = {
    error: false,
    message: response.data.message,
    data: response.data.data,
  };

  return res;
}
