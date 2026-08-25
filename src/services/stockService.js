import { mainApi } from "../assets/axios";

export async function getStocks() {
    const response = await mainApi.get("/stock/stocks");
    return response.data;
}

export async function getStockBySymbol(symbol) {
    const response = await mainApi.get(`/stock/stocks/${symbol}`);
    return response.data;
}

export async function getStockQuote(symbol) {
    const response = await mainApi.get(`/market/quote/${symbol}`);
    return response.data;
}

export async function updateStock(stockId, payload) {
    const response = await mainApi.patch(`/stock/stocks/${stockId}`,payload);
    return response.data
}