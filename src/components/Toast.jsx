export default function Toast({ type, message }) {
    return (
        <div className="toast toast-top toast-end">
            <div className={`alert ${type === "success" ? "alert-success" : "alert-error"}`}>
                <span>{message}</span>
            </div>
        </div>
    )
}