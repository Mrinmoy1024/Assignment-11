
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://contest-carnival-server-1bxq19mi1-mtex1024-2836s-projects.vercel.app/",
});


axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosSecure;