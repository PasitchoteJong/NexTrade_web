import { useEffect, useState } from "react";
import {
    createWallet,
    getMyWallet,
    depositWallet,
    withdrawWallet,
    getWalletHistory
} from "../services/walletService";
import { toast } from "../components/Toast/toast";
import walletIcon from "../../picture/wallet-svgrepo-com.png"


export default function Wallet() {
    // const wallet = null;
    const [wallet, setWallet] = useState(null);
    const [modalType, setModalType] = useState(null);
    //"deposit"//"withdraw"//null

    const [amount, setAmount] = useState("");
    const [bookbankId, setBookbankId] = useState("");
    const [bankName, setBankName] = useState("");

    const [history, setHistory] = useState([]);

    const[showAllHistory,setShowAllHistory] = useState(false);
    const displayedHistory = showAllHistory ? history : history.slice(0,5);

    async function handleCreateWallet() {
        try {
            const data = await createWallet();
            // const respone = await mainApi.post("/wallet/walletCreate");
            console.log("Create Wallet:", data);

            // const { message, result } = respone.data;
            // console.log("Message:", message);
            // console.log("Wallet:", result);
            setWallet(data.result);
            toast.success(data.message);

        } catch (error) {
            console.log(error)
            toast.error(error?.response);
        }
    }



    async function handleGetWallet() {
        try {
            const data = await getMyWallet();
            // const respone = await mainApi.get(`/wallet/myWallet`);

            // console.log("Get Wallet:", respone.data);

            setWallet(data?.data ?? null);
            // console.log("Get Wallet:", data);

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        handleGetWallet();
    }, []);


    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const payload = {
                amount: Number(amount),
                bookbankId,
                bankName
            };

            let data;

            if (modalType === "deposit") {
                data = await depositWallet(payload);
            }
            if (modalType === "withdraw") {
                data = await withdrawWallet(payload);
            }

            setWallet(data.data.updatedWallet);

            toast.success(data.message);

            closeModal();
            // await handleGetWallet();
        } catch (error) {
            console.log("Wallet Transaction Error:", error)

            toast.error(error?.response);
        }

    }

    async function handleGetHistory() {
        try {
            const data = await getWalletHistory();
            // console.log("Wallet History:", data);
            setHistory(data.data.history);

        } catch (error) {
            console.log("History Error:", error)
        }
    }
    useEffect(() => {
        if (wallet) {
            handleGetHistory();
        }
    }, [wallet]);

    function openModal(type) {
        setModalType(type);
    }
    function closeModal() {
        setModalType(null);
        setAmount("");
        setBookbankId("");
        setBankName("");
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="min-h-screen bg-base-200 p-6">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-6 text-3xl font-bold">My Wallet</h1>

                    {!wallet ? (
                        <button onClick={handleCreateWallet} className="flex h-64 w-full items-center justify-center rounded-2xl border-2 border-dashed border-base-300 bg-base-100 hover:bg-base-300 cursor-pointer">
                            <div className="text-center">
                                <div className="text-5xl font-light">+</div>
                                <h2 className="text-xl font-bold">Create Wallet</h2>
                                <p className="mt-2 text-sm text-base-content/50">Create your wallet to start trading</p>
                            </div>
                        </button>
                    ) : (
                        <>
                            <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-8 text-primary-content shadow-xl">
                                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                                    <div>
                                        <p className="text-sm opacity-80">Available Balance</p>
                                        <h2 className="mt-2 text-5xl font-bold">฿{Number(wallet.balance).toLocaleString("th-TH",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}</h2>
                                        <p className="mt-3 text-sm opacity-70">Wallet ID:{wallet.walletId || wallet.id}</p>
                                    </div>

                                    <div className="hidden md:flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
                                        <img src={walletIcon} alt="wallet icon" />
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <button onClick={() => openModal("deposit")} className="btn border-none bg-white text-primary hover:bg-white/90">
                                        Deposit
                                    </button>

                                    <button onClick={() => openModal("withdraw")} className="btn border-none bg-white text-primary hover:bg-white/90">
                                        Withdraw
                                    </button>
                                </div>
                            </div>


                            <div className="mt-8 rounded-3xl bg-base-100 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold">Recent Transactions</h2>
                                        <p className="text-sm text-base-content/50">Your lastest wallet activities</p>
                                    </div>

                                    {history.length > 4 && !showAllHistory && (
                                        <button onClick={()=> setShowAllHistory(true)} className="btn btn-ghost btn-sm">View All</button>
                                    )}
                                </div>

                                <div className="mt-8 flex min-h-32 items-center justify-center text-base-content/40">
                                    <div className="mt-8">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-xl font-bold">
                                                Recent Transactions
                                            </h2>

                                            <span className="text-sm text-base-content/60">
                                                {history.length} transactions
                                            </span>
                                        </div>

                                        <div className="space-y-3">

                                            {history.length === 0 ? (
                                                <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
                                                    <p className="text-base-content/50">
                                                        No transactions yet
                                                    </p>
                                                </div>
                                            ) : (

                                                displayedHistory.map((item) => {

                                                    const amount = Number(item.amount);
                                                    const isDeposit = amount > 0;

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between rounded-xl bg-base-100 p-4 shadow-sm"
                                                        >

                                                            <div className="flex items-center gap-4">

                                                                <div
                                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${isDeposit
                                                                        ? "bg-success/10 text-success"
                                                                        : "bg-error/10 text-error"
                                                                        }`}
                                                                >
                                                                    {isDeposit ? "+" : "−"}
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {isDeposit
                                                                            ? "Deposit"
                                                                            : "Withdraw"}
                                                                    </p>

                                                                    <p className="text-sm text-base-content/60">
                                                                        {item.bankName} ••••{" "}
                                                                        {item.bookbankId.slice(-4)}
                                                                    </p>
                                                                </div>

                                                            </div>

                                                            <div className="text-right">

                                                                <p
                                                                    className={`font-bold ${isDeposit
                                                                        ? "text-success"
                                                                        : "text-error"
                                                                        }`}
                                                                >
                                                                    {isDeposit ? "+" : ""}
                                                                    {amount.toLocaleString()} THB
                                                                </p>

                                                                <p className="text-xs text-base-content/50">
                                                                    {new Date(
                                                                        item.createdAt
                                                                    ).toLocaleString("th-TH")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


                {modalType && (
                    <dialog className="modal modal-open">
                        <div className="modal-box max-w-md">
                            <h3 className="text-2xl font-bold">
                                {modalType === "deposit"
                                    ? "Deposit Money"
                                    : "Withdraw Money"}
                            </h3>

                            <p className="mt-1 text-sm text-base-content/60">

                                {modalType === "deposit"
                                    ? "Add money to your NexTrade wallet."
                                    : "Withdraw money from your NexTrade wallet."}

                            </p>


                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-4"
                            >

                                {/* Amount */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Amount
                                        </span>
                                    </label>

                                    <label className="input input-bordered flex items-center gap-2">
                                        <span className="text-base-content/50">
                                            ฿
                                        </span>

                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            placeholder="1000"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            className="grow"
                                            required
                                        />
                                    </label>
                                </div>

                                {/* Bank */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Bank Name</span>
                                    </label>

                                    <select
                                        value={bankName}
                                        onChange={(e) =>
                                            setBankName(e.target.value)
                                        }
                                        className="select select-bordered w-full"
                                        required
                                    >
                                        <option value="">Select your bank</option>
                                        <option value="KBANK">Kasikornbank (KBANK)</option>
                                        <option value="SCB">Siam Commercial Bank (SCB)</option>
                                        <option value="KTB">Krung Thai Bank (KTB)</option>
                                        <option value="BBL">Bangkok Bank (BBL)</option>
                                    </select>
                                </div>

                                {/* Bookbank */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Bank Account Number</span>
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="1234567890"
                                        value={bookbankId}
                                        onChange={(e) =>
                                            setBookbankId(e.target.value)
                                        }
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>


                                {/* Buttons */}
                                <div className="modal-action">

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className={`btn ${modalType === "deposit"
                                            ? "btn-success"
                                            : "btn-warning"
                                            }`}
                                    >
                                        {modalType === "deposit"
                                            ? "Confirm Deposit"
                                            : "Confirm Withdraw"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Click outside */}
                        <div
                            className="modal-backdrop"
                            onClick={closeModal}
                        />
                    </dialog>
                )}
            </div>
        </div>
    )
}