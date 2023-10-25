import axios from 'axios';
import store from '@/store';
import { getToken, getData } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
});

async function request (url, method, params, data) {
  const token = getToken();
  const nickname = getData('nickname');
  const res = await service({
    url,
    method,
    params,
    data,
    headers: {
      authorization: token || '',
      nickname: encodeURIComponent(nickname || ''),
    },
  });
  if (res.data.code === 1) return res.data.data;
  if (res.data.code === -1) {
    return store.dispatch('user/resetToken').then(() => {
      location.reload();
    });
  }
  throw new Error(res.data.message);
}
async function request2 (url, method, params, data) {
  const token = getToken();
  const nickname = getData('nickname');
  const res = await axios({
    url,
    method,
    params,
    data,
    headers: {
      authorization: token || '',
      nickname: encodeURIComponent(nickname || ''),
    },
  });
  if (res.data.code === 1) return res.data.data;
  if (res.data.code === -1) {
    return store.dispatch('user/resetToken').then(() => {
      location.reload();
    });
  }
  throw new Error(res.data.msg);
}
export default {
  get (url, data) {
    return request(url, 'GET', data);
  },
  post (url, data) {
    return request(url, 'POST', {}, data);
  },
  post2Data (url, params, data) {
    return request2(url, 'POST', params, data);
  },
  get2Data (url, params, data) {
    return request2(url, 'GET', params, data);
  },
};
