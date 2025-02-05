import axios from 'axios';
import Cookies from 'js-cookie';

const ROOT_API = process.env.NEXT_PUBLIC_SERVER;

export async function setElection(data) {
  const URL = 'election/create';

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data, { headers: { Authorization: jwtToken } })
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

export async function getElection() {
  const URL = 'election/getElection';

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

export async function checkElection(companyId) {
  const URL = 'election/check';

  const response = await axios
    .get(`${ROOT_API}/${URL}`, { params: { companyId } })
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

export async function editElection(id, data) {
  const URL = 'election';

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .put(`${ROOT_API}/${URL}/${id}`, data, {
      headers: { Authorization: jwtToken },
    })
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
