import React from "react"
import { useState } from "react";
import userAuthStore from "../stores/authstore";
import { useNavigate } from "react-router-dom";
import { loginUserService } from "../services/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = userAuthStore((state) => state.login);

    async function handleSubmit(e) {
        e.preventDefault();

        const { token, user } = await loginUserService(email, password);

        // console.log("Login Response:", response.data)

        // const { token, user } = response.data;
        login(token, user);
        // console.log(respone.data);

        // console.log("Token:", token);
        // console.log("User:", user);

        navigate("/")
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-base-200 p-4">
            <div className="w-full max-w-7xl overflow-hidden rounded-2xl bg-base-100 shadow-2xl flex">

                {/*Left Photo */}
                <div className="hidden md:block md:w-1/2">
                    <img src="https://picsum.photos/id/476//5000"
                        alt="pic1"
                        className="h-full w-full object-cover" />
                </div>

                {/*Right Login */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-base-content">Welcome!</h1>
                            <br />
                            <p className="mt-2 text-base-content/60">Login to use your account.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input type="email" placeholder="mail@site.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>

                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    minLength="8"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be more than 8 characters, including
                                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                            </p>

                            <div className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                                    <span className="text-sm">Remember Me</span>
                                </label>

                                <a href="#" className="text-sm text-primary cursor-pointer">Forget Password?</a>
                            </div>

                            <button type="submit" className="btn btn-primary w-full">Login</button>

                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span> Don't have an account?</span>

                            <a href="#" className="ml-1 font-semibold text-primary cursor-pointer">Register</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
