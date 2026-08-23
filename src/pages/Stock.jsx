import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks, getStockQuote } from "../services/stockService"
import searchIcon from "../../picture/find-svgrepo-com.png"

export default function Stock() {
    const [stocks, setStocks] = useState([]);
    const [quotes, setQoutes] = useState({});
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function handleGetStock() {
        try {
            setLoading(true);
            setError(null);

            const data = await getStockQuote();

            const stockList = data?.data ?? [];
            setStocks(stockList);

            const qouteResults = await Promise.all(
                stockList.map(async (stock) => {
                    const qoute = await getStockQuote(stock.symbol);
                    return {
                        symbol: stock.symbol,
                        qoute: qoute?.data ?? qoute
                    };
                })
            );

            const qouteMap = {};
            qouteResults.forEach(({ symbol, qoute }) => {
                qouteMap[symbol] = qoute;
            });
            setQoutes(qouteMap);
        } catch (error) {
            console.log("Get Stocks Error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetStocks();
    }, []);

    const filteredStocks = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            return stocks;
        }

        return stock.filter((stock) =>
            stock.symbol?.toLowerCase().includes(keyword) ||
            stock.companyName?.toLowerCase().includes(keyword)
        );
    }, [stocks, search]);

    function formatPrice(value, currentcy = "USD") {
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
        <div>
            <div>

                <div>
                    <div>
                        <h1>Stocks</h1>
                        <p>Explore the market</p>
                    </div>

                    <label>
                        <svg>
                            <path />
                        </svg>
                        <input />

                    </label>
                </div>

                <div>
                    Stocks
                </div>

                {filteredStocks.length === 0 ? (
                    <div>
                        <div>
                            <div className="w-12 h-12">
                                <img src={searchIcon} alt="Search" className="w-full h-full" />
                            </div>
                            <h2>No STocks found</h2>
                            <p>Try another symbol or company name.</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {filteredStocks.map((stock) => {
                            const qoute = qoutes[stock.symbol];
                            const currentPrice =
                                qoute?.currentPrice ??
                                qoute?.c ??
                                null;

                            const previousClose = previousClose && currentPrice ? ((currentPrice - previousClose) / previousClose) * 100 : null;

                            const isPositive = changPercent >= 0;
                            return (
                                <Link>
                                    <div>

                                        <div>  
                                            <div>
                                                <div>
                                                    {stock.logo?(
                                                        <img src={stock.logo} alt={stock.symbol}/>
                                                    ):(
                                                        <span>{stock.symbol?.charAt(0)}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h2>{stock.symbol}</h2>
                                                <p>{stock.companyName}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                <span>
                                                    {formatPrice(currentPrice,stock.currency||"USD")}
                                                </span>
                                                {changPercent !== null && ():()}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )

                        })}
                    </div>
                )}
            </div>
        </div>
    )
}