import axios from 'axios';
interface ApiProps {
  baseURL?: string;
  token?: string;
}
export const api = ({baseURL, token}: ApiProps) => {
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL: baseURL || import.meta.env.VITE_API_URL,
    timeout: 60000,
  });

  instance.interceptors.request.use(
    async function (config: any) {
      const jwt = token || localStorage.getItem("token");
      if (jwt) {
        config.headers!.Authorization = `Bearer ${jwt}`;
      }
      return config;
    },
    function (error: any) {
      return Promise.reject(error);
    },
  );

  instance.interceptors.request.use(
    function (response: any) {
      return response;
    },
    function (error: any) {
      return Promise.reject(error);
    },
  );

  return instance;
};

export default api;
