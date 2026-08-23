import { mainApi } from "../assets/axios";

export async function getStocks() {
    const response = await mainApi.get("/stock/stocks");
    return response.data;
}

export async function getStockBySymbol(symbol) {
    const response = await mainApi.get(`/stock/stock/${symbol}`);
    return response.data;
}

export async function getStockQuote(symbol) {
    const response = await mainApi.get(`/market/qoute/${symbol}`);
    return response.data;
}