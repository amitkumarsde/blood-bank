"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthUser, LoginResult } from "./api";

interface Session {
    user: AuthUser | null;
    token: string | null;
}

interface AuthState extends Session {
    ready: boolean;
    login: (result: LoginResult) => void;
    logout: () => void;
}

const STORAGE_KEY = "bloodbank.auth";
const EMPTY: Session = { user: null, token: null };

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session>(EMPTY);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let restored: Session = EMPTY;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as LoginResult;
                restored = { user: parsed.user, token: parsed.token };
            }
        } 
        catch {
            // ignore corrupt storage
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from an external store
        setSession(restored);
        setReady(true);
    }, []);

    const login = useCallback((result: LoginResult) => {
        setSession({ user: result.user, token: result.token });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    }, []);

    const logout = useCallback(() => {
        setSession(EMPTY);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <AuthContext.Provider
            value={{ ...session, ready, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
