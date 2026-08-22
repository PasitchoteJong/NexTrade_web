import { useEffect, useState } from "react";
import { subscribe } from "./toast";

const toastStyle = {
    succcess: "alart-success",
    error: "alart-error",
    waring: "alert-waring",
    info: "alert-info"
};

function ToastItem({
    toast, onClose
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onclose(toast.id);
        }, toast.duration);

        return () => { clearTimeout(timer); }
    }, [toast.id, toast.duration, onClose]);

    return (
        <div className="alert relative overflow-hidden">
            <span>{toast.message}</span>

            <div className={`absolute bottom-0 left-0 h-1 ${toastStyle[toast.type]}`}
                style={{ animation: `toast-progress ${toast.duration}ms linear forwards` }} />

        </div>
    );
}
export default function Toast() {
    const [toasts, setToast] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribe((newToast) => {
            setToasts((current) => [
                ...current,
                newToast
            ]);
        });

        return unsubscribe;
    }, []);

    const removeToast = (id) => {
        setToast((current) => current.filter((toast) => toast.id !== id))
    };

    return (
        <div>
            {toast.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
}