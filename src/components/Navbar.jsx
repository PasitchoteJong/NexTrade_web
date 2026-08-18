function Navbar(props) {
    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">
                    NexTrade
                </a>
            </div>

            <div className="flex-none">
                <button className="btn btn-primary">
                    Hello {props.name}
                </button>
            </div>
        </div>
    )
}
export default Navbar