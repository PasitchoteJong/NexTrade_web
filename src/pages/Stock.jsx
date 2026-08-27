import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteFavorite, createFavorite, getStockQuote, getStocks, updateStock, getFavoritees } from "../services/stockService"
import searchIcon from "../../picture/find-svgrepo-com.png"
import nextIcon from "../../picture/next-svgrepo-com.png"
import redHeartIcon from "../../picture/heart-angle-red-svgrepo-com.png"
import whiteHeartIcon from "../../picture/heart-angle-white-svgrepo-com.png"

export default function Stock() {
    const [stocks, setStocks] = useState([]);
    const [quotes, setQuotes] = useState({});
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [favoritePoint, setFavoritePoint] = useState([]);


    async function handleGetStock() {
        try {
            setLoading(true);
            setError(null);

            const data = await getStocks();

            const stockList = data?.data ?? [];
            setStocks(stockList);

            const quoteResults = await Promise.all(
                stockList.map(async (stock) => {
                    try {
                        const quote = await getStockQuote(stock.symbol);
                        return {
                            symbol: stock.symbol,
                            quote: quote?.data ?? quote
                        };
                    } catch (error) {
                        console.log("Stock Quote error:", error)
                    }
                    return {
                        symbol: stock.symbol,
                        quote: null
                    };
                })
            );

            const quoteMap = {};
            quoteResults.forEach(({ symbol, quote }) => {
                quoteMap[symbol] = quote;

                console.log("symbol from quoteResult: ", symbol)
                console.log("quote from quoteResult: ", quote)
            });
            setQuotes(quoteMap);
        } catch (error) {
            console.log("Get Stocks Error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetStock();
    }, []);

    useEffect(()=>{
        async function loadFavorites(){
            try{
                const data = await getFavoritees();

            console.log("Fav data:",data)
            setFavoritePoint(data.data.map((fav)=>fav.stockId));
            }catch(error){
                console.log("Get all Fav error:",error);
            }
        } loadFavorites();
    },[])

    const filteredStocks = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            return stocks;
        }

        return stocks.filter((stock) =>
            stock.symbol?.toLowerCase().includes(keyword) ||
            stock.companyName?.toLowerCase().includes(keyword)
        );
    }, [stocks, search]);

    function formatPrice(value, currency = "USD") {
        if (value == null) return "-";

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency
        }).format(value);
    }

    function formatPercent(value) {
        if (value == null) return "-";

        const number = Number(value);

        return `${number >= 0 ? "+" : ""} ${number.toFixed(2)}%`;

    }

    async function handleFavorite(stock) {
        try {

            console.log("Favorite stock:", stock)
            console.log("Stock ID:", stock.id)


            const isFavorite = favoritePoint.includes(stock.id);
            if (isFavorite) {
                await deleteFavorite(stock.id);

                setFavoritePoint((prev) => prev.filter((id) => id !== stock.id))
            } else {
                await createFavorite(stock.id);

                setFavoritePoint((prev) => [stock.id, ...prev]);
            }
        } catch (error) {
           
            console.log("Favorite error", error)
        }
    }

    const sortedStock = useMemo(() => {
        return [...filteredStocks].sort((a, b) => {
            const aFavorite = favoritePoint.includes(a.id)
            const bFavorite = favoritePoint.includes(b.id)

            if (aFavorite && !bFavorite) return -1;
            if (!aFavorite && bFavorite) return 1;

            return 0;
        })
    }, [filteredStocks, favoritePoint]);





    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-error mb-4">{error}</p>

                    <button className="btn btn-primary" onClick={handleGetStocks}>Try Again</button>
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Stocks</h1>
                        <p className="text-base-content/60 mt-1">Explore the market</p>
                    </div>

                    <label className="input input-bordered flex items-center gap-2 w-full md:w-96">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 opacity-60">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                        <input type="text" placeholder="Search stock..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </label>
                </div>

                <div className="mb-4 text-sm text-base-content/60">
                    {filteredStocks.length} Stocks
                </div>

                {filteredStocks.length === 0 ? (
                    <div className="card bg-base-100">
                        <div className="card-body items-center text-center py-16">
                            <div className="w-12 h-12">
                                <img src={searchIcon} alt="Search" className="w-full h-full" />
                            </div>
                            <h2 className="text-xl font-semibold">No Stocks found</h2>
                            <p className="text-base-content/60">Try another symbol or company name.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols2 lg:grid-cols3 xl:grid-cols4 gap-4">
                        {sortedStock.map((stock) => {
                            const quote = quotes[stock.symbol];
                            const currentPrice = quote?.currentPrice ?? quote?.c ?? null;
                            const previousClose = quote?.previousClose ?? quote?.pc ?? null
                            const changePercent = previousClose && currentPrice ? ((currentPrice - previousClose) / previousClose) * 100 : null;

                            const isPositive = changePercent >= 0;

                            return (
                                <Link key={stock.id} to={`/stock/${stock.symbol}`} className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                    <div className="card-body">

                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-zl bg-base-200 flex items-center justify-center">
                                                    {stock.logo ? (
                                                        <img src={stock.logo} alt={stock.symbol} />
                                                    ) : (
                                                        <span>{stock.symbol?.charAt(0)}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="font-bold text-lg">{stock.symbol}</h2>
                                                <p className="text-sm text-base-content/60 truncate">{stock.companyName}</p>
                                            </div>

                                            <div className="ml-auto">
                                                <button className="btn btn-sm btn-ghost btn-square"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();

                                                        handleFavorite(stock);
                                                    }}>
                                                    {favoritePoint.includes(stock.id) ? <img src={redHeartIcon} alt="redHeartIcon" className="w-full h-full" /> : <img src={whiteHeartIcon} alt="whiteHeartIcon" className="w-full h-full" />}
                                                </button>
                                            </div>

                                        </div>

                                        <div className="mt-5">
                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-bold">
                                                    {formatPrice(currentPrice)}
                                                </span>
                                                {changePercent !== null && (
                                                    <span>
                                                        {formatPercent(changePercent)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-base-content/50">{stock.exchange || "-"}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-base-content/50">Industry</span>
                                                <span className="truncate max-w-40">{stock.industry || "-"}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-base-300 flex justify-between items-center">
                                            <span className="text-sm text-base-content/50">View details</span>
                                            <div className="w-6 h-6">
                                                <img src={nextIcon} alt="Search" className="w-full h-full" />
                                                {/* <svg fill="#ffffff" height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.008 512.008" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M500.208,236.915L30.875,2.248C22.32-2.019,11.952-0.099,5.51,7.048c-6.443,7.125-7.317,17.643-2.176,25.749 l142.037,223.211L3.334,479.219c-5.141,8.107-4.267,18.624,2.176,25.749c4.139,4.608,9.941,7.04,15.829,7.04 c3.243,0,6.507-0.725,9.536-2.24l469.333-234.667c7.232-3.627,11.797-11.008,11.797-19.093S507.44,240.541,500.208,236.915z"></path> </g> </g> </g></svg> */}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );

                        })}
                    </div>
                )}
            </div>
        </div>
    );
}