import { getCookieValue } from '../utils/cookie-store';
import axios from 'axios';

let ssoUrl = process.env.REACT_APP_SSO_URL;
let ktUrl = process.env.REACT_APP_URL;

export const ktApi = axios.create({
    baseURL: ktUrl,
    timeout: 30000,
    timeoutErrorMessage: "conection timeout",
})

export const ssoApi = axios.create({
    baseURL: ssoUrl,
    timeout: 30000,
    timeoutErrorMessage: "conection timeout",
})

ktApi.interceptors.request.use(
    config => {
        config.headers = {
            Authorization: "Bearer " + getCookieValue("access-token"),
            PhanHe: process.env.REACT_APP_PHAN_HE
        }
        return config;
    },
    error => Promise.reject(error)
)

ssoApi.interceptors.request.use(
    config => {
        config.headers = {
            Authorization: "Bearer " + getCookieValue("access-token"),
            PhanHe: process.env.REACT_APP_PHAN_HE
        }
        return config;
    },
    error => Promise.reject(error)
)