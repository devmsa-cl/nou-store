import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  token: string;
  loggedIn: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    _id: string;
  };
  loggedUser: (data: {
    token: string;
    name: string;
    email: string;
    role: string;
    _id: string;
  }) => void;
  logoutUser: () => void;
};

export const useUserStore = create<User>()(
  persist(
    (set) => ({
      token: "",
      loggedIn: false,
      user: {
        name: "",
        email: "",
        role: "",
        _id: "",
      },
      logoutUser: () => {
        window.document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        set({
          token: "",
          loggedIn: false,
          user: {
            name: "",
            email: "",
            role: "",
            _id: "",
          },
        });
      },
      loggedUser: (data) => {
        window.document.cookie = `token=${data.token}`;
        set({
          user: {
            email: data.email,
            name: data.name,
            role: data.role,
            _id: data._id,
          },
          loggedIn: true,
          token: data.token,
        });
      },
    }),
    {
      name: "user_store",
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Rehydrate error:", error);
          return;
        }
        if (state?.token) {
          document.cookie = `token=${state.token}`;
        }
      },
    },
  ),
);
