import axios from 'axios';
import Cookies from 'js-cookie';

const ROOT_API = process.env.NEXT_PUBLIC_SERVER;

// if (!tokenCookies) {
//   window.location.href = '/login/company';
// }

export async function addCandidate(data) {
  const URL = 'candidate/register';

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data, { headers: { Authorization: jwtToken } })
    .catch((err) => err.response);

  const axiosResponse = response.data;

  if (axiosResponse?.error === 1) {
    return axiosResponse;
  }

  return axiosResponse.data;
}

export async function getCandidate() {
  const URL = 'candidate/getCandidate';

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

export async function deleteCandidate(id) {
  const URL = 'candidate';

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .delete(`${ROOT_API}/${URL}/${id}`, {
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

export async function editCandidate(id, data) {
  const URL = 'candidate';

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

export async function getCandidateVoter() {
  const URL = 'candidate/getCandidate';

  const tokenCookies = Cookies.get('tokenVoter');
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

export async function addImageCandidate(data) {
  const URL = 'candidate/addImage';
  console.log(data)

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data)
    .catch((err) => err.response);

  const axiosResponse = response.data;

  if (axiosResponse?.error === 1) {
    return axiosResponse;
  }

  return axiosResponse.data;
}
