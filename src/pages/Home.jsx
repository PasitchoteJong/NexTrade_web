function Home() {
    return (
        <div className="min-h-screen">
            <div className="navbar bg-base-100 shadow">
                <div className="flex-1">
                    <span className="text-1 font-bold">NexTrade</span>
                </div>

                <div>
                    <button className="btn  btn-error">
                        Logout
                    </button>
                </div>

            </div>
            <main className="p-6">
                <h1 className="text-3xl font-bold">Welcome to NexTrade</h1>
                <p className="mt-2">Yout trading dashboard</p>
            </main>
        </div>
    )
}
export default Home;