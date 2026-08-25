import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createChart,
    CandlestickSeries
} from "lightweight-charts";
import {
    getStockBySymbol,
    getStockQuote
} from "../services/stockService";
import kebabIcon from "../../picture/kebab-svgrepo-com.png"
import threedotIcon from "../../picture/dots-vertical-svgrepo-com.png"


export default function StockDetail() {
    const { symbol } = useParams();
    const navigate = useNavigate();

    const chartContainerRef = useRef(null);

    const [stock, setStock] = useState(null);
    const [quote, setQuote] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [menuStockId, setMenuStockId] = useState(null);
    const [editStock, setEditStock] = useState(null);
    const [form, setForm] = useState({
        conpanyName: "",
        exchange: "",
        currency: "",
        logo: "",
        industry: ""
    })

    async function handleLoadStock() {
        try {
            setLoading(true)
            setError(null)

            const [stockData, quoteData] = await Promise.all([
                getStockBySymbol(symbol),
                getStockQuote(symbol)
            ]);

            setStock(stockData?.data ?? stockData)
            setQuote(quoteData?.data ?? quoteData)
        } catch (error) {
            console.log("Get StocksDetail Error:", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (symbol) {
            handleLoadStock();
        }
    }, [symbol]);

    useEffect(() => {
        if (!chartContainerRef.current) {
            return;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: {
                    color: "transparent"
                },
                textColor: "#888"
            },
            grid: {
                vertLines: {
                    color: "rgba(128,128,128,0.1)"
                }, horizLines: {
                    color
                        : "rgba(128,128,128,0.1)"
                }
            },
            width: chartContainerRef.current.clientWidth,
            height: 450,
            timeScale: { timeVisible: true }
        });

        const candleSeries = chart.addSeries(CandlestickSeries);

        //Wait historical Data from BackEng

        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current?.clientWidth || 0
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            chart.remove();
        }

    }, [symbol]);

    function formatPrice(value) {
        if (value == null) {
            return "-";
        }
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: stock?.currency || "USD"
        }).format(value);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    function handleEdit(stock) {
        setEditStock(stock);

        setForm({
            companyName: stock.companyName ?? "",
            exchange: stock.exchange ?? "",
            currency: stock.currency ?? "",
            logo: stock.logo ?? "",
            industry: stock.industry ?? ""
        });

        setMenuStockId(null)
    }

    async function handleUpdateStock(e) {
        e.preventDefault();
        try {
            const data = await updateStock(editStock.id, form);
            console.log("Update Stock:", data)

            setEditStock(null);

            await handleGetStock();
        } catch (error) {
            console.log("Update Stock Error:", error)
        }
    }

    const currentPrice = quote?.currentPrice ?? quote?.c ?? null;
    const previousClose = quote?.previousClose ?? quote?.pc ?? null;
    const change = currentPrice !== null && previousClose !== null ? currentPrice - previousClose : null;
    const changePercent = previousClose ? (change / previousClose) * 100 : null;
    const isPositive = changePercent >= 0;

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-7xl mx-auto">
                <button className="btn btn-ghost mb-6" onClick={() => navigate("/stock")}>
                    Back
                </button>

                <div className="card bg-base-100 shadow-sm relative">
                    <div className="absolute top-3 right-3 z-20">
                        <button
                            className="btn btn-sm btn-ghost btn-square"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setMenuStockId(menuStockId === stock.id ? null : stock.id)
                            }}
                        >   
                            <img src={threedotIcon} alt="threedotIcon" />
                        </button>

                        {menuStockId === stock.id && (
                            <div className="absolute right-0 top-10 z-30 w-36 rounded-box bg-base-100 border border-base-300 shadow-lg overflow-hidden">
                                <button className="w-full text-left px-4 py-2 hover:bg-base-500" onClick={() => handleEdit(stock)}>
                                    แก้ไข
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-body pr-14">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-xl bg-base-200 flex items-center justify-center">
                                        {stock?.logo ? (
                                            <img src={stock.logo} alt={stock.symbol} />
                                        ) : (
                                            <span>{stock?.symbol?.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold">{stock?.symbol}</h1>
                                    <p className="text-base-content/60">{stock?.companyName}</p>
                                </div>
                            </div>

                            <div className="text-left md:text-right">
                                <div className="text-4xl font-bold">
                                    {formatPrice(currentPrice)}
                                </div>
                                <div className={`text-sm font-semibold ${isPositive ? "text-success" : "text-error"}`}>
                                    {change !== null && `${isPositive ? "+" : ""}${change.toFixed(2)}`}
                                    {changePercent !== null && `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm mt-6">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-bold">{stock?.symbol} Price</h2>
                                <p className="text-sm text-base-content/50">Price history</p>
                            </div>

                            <div className="join">
                                <button className="btn btn-sm join-item">1M</button>
                                <button className="btn btn-sm join-item">5M</button>
                                <button className="btn btn-sm join-item">15M</button>
                                <button className="btn btn-sm join-item">30M</button>
                                <button className="btn btn-sm join-item btn-active">1H</button>
                                <button className="btn btn-sm join-item">4H</button>
                                <button className="btn btn-sm join-item">1D</button>
                                <button className="btn btn-sm join-item">1W</button>
                            </div>
                        </div>

                        <div ref={chartContainerRef} className="w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <p className="text-sm text-base-content/50">Open</p>
                            <p className="text-xl font-semibold">{formatPrice(quote?.open)}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <p className="text-sm text-base-content/50">High</p>
                            <p className="text-sl font-semibold">{formatPrice(quote?.high)}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <p className="text-sm text-base-content/50">Low</p>
                            <p className="text-xl font-semibold">{formatPrice(quote?.low)}</p>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <p className="text-sm text-base-content/50">Previous Close</p>
                            <p className="text-xl font-semibold">{formatPrice(quote?.close)}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button className="btn btn-success">Buy</button>
                        <button className="btn btn-error flex-1">Sell</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

