import axios from 'axios';
import { getToken } from '@/utils/auth';

export async function loginos(code) {
    const res = await axios.post(process.env.VUE_APP_LOGIN_CHECK, { code });
    return res.data.data;
}

export async function checkUser() {
    const token = getToken();
    if (!token) return null;
    const res = await axios.get(process.env.VUE_APP_USER_INFO, {
        headers: { token },
    });
    return res.data.data;
}
