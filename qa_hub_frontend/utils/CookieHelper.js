import Cookies from 'universal-cookie';

const cookie = new Cookies();

export function setCookie(key, value) {
    cookie.set(key, value)
}

export function getCookie(key) {
    return cookie.get(key)
}