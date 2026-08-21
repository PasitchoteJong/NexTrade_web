

export default function Home() {
    return (
        <div className="mx-auto max-w-7xl">
            <section className="mb-8">
                <h1 className="text-3xl font-bold text-base-content">Walcome to NexTrade</h1>
                <p className="mt-2 text-base-content/60">Manage your stocks, wallet and portfolio in one place.</p>
            </section>

            <div className="grid grid-col-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="card bg-base-100 shadoq-sm border border-base300">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">Wallet Balance</p>
                        <h2 className="text-3xl font-bold">$10,000.00</h2>
                        <p className="text-sm text-success">+5.42%</p>
                    </div>
                </div>


                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">Portfolio Value</p>
                        <h2 className="text-3xl font-bold">$15,240.50</h2>
                        <p className="text-sm text-success">+8.21%</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">Holdings</p>
                        <h2 className="text-3xl font-bold">8</h2>
                        <p className="text-sm text-base-content/60">Defferrent stocks</p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                        <p className="text-sm text-base-content/60">Today's P/L</p>
                        <h2 className="text-3xl font-bold text-success">+245.80</h2>
                        <p className="text-sm text-base-content/60">Today</p>
                    </div>
                </div>

            </div>

            <div className="mt-6 grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="card bg-base-100 shadow-sm border-base-300 lg:col-span-2">
                    <div className="card-body">
                        <div className="flwx item-center justify-between">
                            <h2 className="card-title">Market Overview</h2>
                            <button className="btn btn-ghost btn-sm">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Stock</th>
                                        <th>Price</th>
                                        <th>Change</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">AAPL</td>
                                        <td>$303.42</td>
                                        <td className="text-error">-1.77%</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">MFST</td>
                                        <td>$502.15</td>
                                        <td className="text-success">+1.24%</td>
                                    </tr>

                                    <tr>
                                        <td className="font-semibold">NVDA</td>
                                        <td>$184.72</td>
                                        <td className="text-success">+2.81%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-6 card bg-base-100 shadow-sm border-base-300">
                    <div className="card-body">
                        <h2 className="card-title">Quick Actions</h2>
                        <div className="mt-3 flex flex-col gap-3">
                            <button className="btn btn-primary">Trade Stock</button>
                            <button className="btn btn-outline">Deposit</button>
                            <button className="btn btn-outline">Withdraw</button>
                            <button className="btn btn-outline">View portfolio</button>
        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
