import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000/",
});

axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

axiosSecure.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosSecure;
