import axios from "axios";
import userAuthStore from "../stores/authstore";

export const mainApi = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL}/api`,
    headers:{
        "Content-Type":"application/json"
    }
});

mainApi.interceptors.request.use((config)=>{
    const token = userAuthStore.getState().token;
    if(token){
        config.headers.Authorization= `Bearer ${token}`;
    }
    return config;
})
