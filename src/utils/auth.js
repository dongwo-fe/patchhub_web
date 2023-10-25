// import Cookies from 'js-cookie';

const TokenKey = 'dw_patch_token';

export function getToken() {
    return localStorage.getItem(TokenKey);
    // return Cookies.get(TokenKey);
}

export function setToken(token) {
    return localStorage.setItem(TokenKey, token);
    // return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return localStorage.removeItem(TokenKey);
    // return Cookies.remove(TokenKey);
}

export function setData(key, val) {
    return localStorage.setItem(TokenKey + key, val);
}

export function getData(key) {
    return localStorage.getItem(TokenKey + key);
}

export function removeData(key) {
    return localStorage.removeItem(TokenKey + key);
}
