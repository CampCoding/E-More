import axios from "axios";


export const baseURL = "https://camp-coding.tech/emore/";
export const admin_base_url = "https://camp-coding.tech/emore/";


const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default API;
