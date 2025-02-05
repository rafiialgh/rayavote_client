import axios from 'axios';

const ROOT_API = process.env.NEXT_PUBLIC_SERVER;

export async function setSignIn(data) {
  const URL = 'company/signin';

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

export async function setSignUp(data) {
  const URL = 'company/signup';

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data)
    .catch((err) => err.response);
  const axiosResponse = response.data;
  if (axiosResponse?.error === 1) {
    return axiosResponse;
  }

  return axiosResponse.data;
}
