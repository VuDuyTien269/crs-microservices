import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

import type { LoginResponse } from "../types/auth";

interface AuthUser {
    id: number;
    username: string;
    role: "ADMIN" | "STUDENT";
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext =
    createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "crs_token";
const USER_KEY = "crs_user";

export function AuthProvider({
                                 children,
                             }: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<AuthUser | null>(null);

    // Lấy thông tin đăng nhập khi F5 trang
    useEffect(() => {
        const savedToken =
            localStorage.getItem(TOKEN_KEY);

        const savedUser =
            localStorage.getItem(USER_KEY);

        if (savedToken && savedUser) {
            try {
                const parsedUser =
                    JSON.parse(savedUser);

                setUser(parsedUser);
            } catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        }
    }, []);

    // Đăng nhập
    const login = (data: LoginResponse) => {
        localStorage.setItem(
            TOKEN_KEY,
            data.token
        );

        const authUser: AuthUser = {
            id: data.userId,
            username: data.username,
            role: data.role,
        };

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(authUser)
        );

        setUser(authUser);
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth phải được sử dụng bên trong AuthProvider"
        );
    }

    return context;
}