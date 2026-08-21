import { Link, NavLink } from "react-router-dom";
import userAuthStore from "../stores/authstore";



function Navbar(props) {

    const user = userAuthStore((state) => state.user);
    const logout = userAuthStore((state) => state.logout);

    const NavItem = [
        { name: "Home", path: "/" },
        { name: "About Me", path: "/about" },
        { name: "Stock", path: "/stock" },
        { name: "Wallet", path: "/wallet" },
        { name: "Trade", path: "/trade" },
        { name: "Portfolio", path: "/portfolio" }
    ];

    return (
        <div className="navbar bg-base-100 shadow-md px-6">
            <div className="navbar-start">
                <Link to="/" className="text-xl font-bold text-primary">NexTrade</Link>
            </div>

            <div className="navbar-center lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {NavItem.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                <div className="dropdown dropdown-hover dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" alt="User" />
                        </div>
                    </button>

                    <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-10 mt-0 w-64 p-2 shadow-lg">
                        <li className="menu-title">
                            <span>
                                {user?.firstName} {user?.lastName}
                            </span>

                            <span className="text-xs font-normal">
                                {user?.email}
                            </span>
                        </li>


                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/settings">Setting</Link>
                        </li>
                        <div></div>
                        <li>
                            <button onClick={logout} className="text-error">
                                Logout
                            </button>
                        </li>

                    </ul>
                </div>
            </div>

        </div>
    )
}
export default Navbar