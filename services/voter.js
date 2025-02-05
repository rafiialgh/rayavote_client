import axios from 'axios';
import Cookies from 'js-cookie';

const ROOT_API = process.env.NEXT_PUBLIC_SERVER;

// if (!tokenCookies) {
//   alert('Sesi anda telah habis. Silahkan login kembali')
//   window.location.href = '/login/company';
// }

export async function setSignInVoter(data) {
  const URL = 'voter/signin';

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data)
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
    message: 'success',
    data: response.data.data,
  };

  return res;
}

export async function addVoter(data) {
  const URL = 'voter/register';

  const tokenCookies = Cookies.get('token');
  const jwtToken = atob(tokenCookies);

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data, { headers: { Authorization: jwtToken } })
    .catch((err) => err.response);

    console.log(response)

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

export async function getVoter() {
  const URL = 'voter/getVoter';

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

export async function deleteVoter(id) {
  const URL = 'voter';

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

export async function editVoter(id, data) {
  const URL = 'voter';

  console.log(data)

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
