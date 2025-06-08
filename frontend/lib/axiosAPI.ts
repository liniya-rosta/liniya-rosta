import axios from "axios";
import {API_BASE_URL} from "@/lib/globalConstants";

const axiosAPI = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosAPI;
