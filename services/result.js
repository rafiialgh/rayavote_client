import axios from 'axios';

const ROOT_API = process.env.NEXT_PUBLIC_SERVER;

export async function sendResult(data) {
  const URL = 'result';

  console.log(data)

  const response = await axios
    .post(`${ROOT_API}/${URL}`, data)
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
      totalEmails: response.data.totalEmails
    };
  
    return res;
}