import { mainApi } from "../assets/axios";

export async function createWallet() {
    const response = await mainApi.post("/wallet/walletCreate");

    return response.data;
}

export async function getMyWallet() {
    const response = await mainApi.get("/wallet/myWallet");

    return response.data;
}

export async function depositWallet(payload) {
    const response = await mainApi.post(
        "/wallet/deposit",
        payload
    );

    return response.data;
}

export async function withdrawWallet(payload) {
    const response = await mainApi.post(
        "/wallet/withdraw",
        payload);

    return response.data;
}
export async function getWalletHistory(){
    const response = await mainApi.get("/wallet/history");

    return response.data;
}