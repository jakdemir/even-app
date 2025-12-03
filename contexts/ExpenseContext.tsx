"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Expense } from "@/types";
import { supabase } from "@/lib/supabase";

interface ExpenseContextType {
    expenses: Expense[];
    currentUser: string | null;
    login: (address: string) => void;
    addExpense: (expense: Omit<Expense, "id" | "date">) => void;
    clearExpenses: () => void;
    isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from LocalStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("even_user");
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    // Fetch expenses from Supabase
    useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching expenses:', error);
            } else if (data) {
                setExpenses(data as Expense[]);
            }
            setIsLoading(false);
        };

        fetchExpenses();

        // Realtime subscription
        const channel = supabase
            .channel('expenses_channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'expenses' },
                (payload) => {
                    setExpenses((prev) => [payload.new as Expense, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Save user to LocalStorage whenever state changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("even_user", currentUser);
        }
    }, [currentUser]);

    const login = async (address: string) => {
        setCurrentUser(address);
        // Upsert user to Supabase
        const { error } = await supabase
            .from('users')
            .upsert({ wallet_address: address }, { onConflict: 'wallet_address' });

        if (error) console.error('Error creating user:', error);
    };

    const addExpense = async (newExpense: Omit<Expense, "id" | "date">) => {
        const expenseData = {
            ...newExpense,
            date: new Date().toISOString(),
        };

        const { error } = await supabase
            .from('expenses')
            .insert([expenseData]);

        if (error) {
            console.error('Error adding expense:', error);
        }
        // No need to manually update state here because the realtime subscription will catch it
        // However, for immediate feedback, we could optimistically update, but let's rely on realtime for now to ensure consistency
    };

    const clearExpenses = () => {
        // For now, this just logs out the user locally
        setCurrentUser(null);
        localStorage.removeItem("even_user");
        // We don't clear expenses from DB here
    };

    return (
        <ExpenseContext.Provider value={{ expenses, currentUser, login, addExpense, clearExpenses, isLoading }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error("useExpenses must be used within an ExpenseProvider");
    }
    return context;
}
