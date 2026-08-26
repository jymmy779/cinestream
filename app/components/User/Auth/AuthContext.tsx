"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEMO_USER_KEY = "cinestream-demo-user";
const DEMO_AUTH_EVENT = "cinestream-demo-auth-change";
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (isDemoMode) {
            const syncDemoUser = () => {
                try {
                    const stored = localStorage.getItem(DEMO_USER_KEY);
                    setUser(stored ? JSON.parse(stored) as User : null);
                } catch {
                    localStorage.removeItem(DEMO_USER_KEY);
                    setUser(null);
                }
                setSession(null);
                setIsLoading(false);
            };

            syncDemoUser();
            window.addEventListener("storage", syncDemoUser);
            window.addEventListener(DEMO_AUTH_EVENT, syncDemoUser);
            return () => {
                window.removeEventListener("storage", syncDemoUser);
                window.removeEventListener(DEMO_AUTH_EVENT, syncDemoUser);
            };
        }

        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Lỗi khi lấy session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signOut = async () => {
        if (isDemoMode) {
            localStorage.removeItem(DEMO_USER_KEY);
            window.dispatchEvent(new Event(DEMO_AUTH_EVENT));
            return;
        }
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth phải được dùng trong AuthProvider");
    }
    return context;
}
