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
    console.log("Stock service StockId:", stockId)
    console.log("stock Servvice",payload)

    
    const response = await mainApi.patch(`/stock/stocks/${stockId}`,payload);

    console.log("Stcok Service Responde:",response)
    return response.data
}


export async function createFavorite(stockId){
    const response= await mainApi.post(`/stock/${stockId}/favorite`)

    return response.data
}

export async function deleteFavorite(stockId){
    const response = await mainApi.delete(`/stock/${stockId}/favorite`)

    return response.data
}

export async function getFavoritees(stockId){
    const response = await mainApi.get(`/stock/favorite`)

    return response.data
}