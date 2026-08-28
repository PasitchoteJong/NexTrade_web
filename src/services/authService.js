import {mainApi} from "../assets/axios";

export async function loginUserService(email, password) {
    const response = await mainApi.post("/auth/login", { email, password });
    
    return response.data;
}