import { create } from "zustand";

const userAuthStore = create((set) => ({
    token: null,
    user: null,

    login: (token, user) => {
        set({ token, user })
    },

    logout: () => {
        set({
            token: null,
            user: null
        });
    }


}));
export default userAuthStore;