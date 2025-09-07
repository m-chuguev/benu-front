// src/services/http.ts
import axios, { AxiosError } from "axios";

export const http = axios.create({
    baseURL: 'https://app.bennu.cloud/ontology-access-service',
    withCredentials: true,
    timeout: 15000,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") ?? 'token';
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);
