"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Expense } from "@/types";
import { supabase } from "@/lib/supabase";

interface ExpenseContextType {
    expenses: Expense[];
    currentUser: string | null;
    displayName: string | null;
    groupId: string | null;
    login: (address: string) => void;
    updateDisplayName: (name: string) => void;
    joinGroup: (groupId: string) => void;
    addExpense: (expense: Omit<Expense, "id" | "date" | "group_id">) => void;
    clearExpenses: () => void;
    isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [displayName, setDisplayNameState] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load user and group from LocalStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("even_user");
        const storedName = localStorage.getItem("even_name");
        const storedGroup = localStorage.getItem("even_group");
        if (storedUser) setCurrentUser(storedUser);
        if (storedName) setDisplayNameState(storedName);
        if (storedGroup) setGroupId(storedGroup);
    }, []);

    // Save user/group to LocalStorage
    useEffect(() => {
        if (currentUser) localStorage.setItem("even_user", currentUser);
        if (displayName) localStorage.setItem("even_name", displayName);
        if (groupId) localStorage.setItem("even_group", groupId);
    }, [currentUser, displayName, groupId]);

    const login = async (address: string) => {
        setCurrentUser(address);

        // Fetch existing profile
        const { data, error } = await supabase
            .from('users')
            .select('display_name')
            .eq('wallet_address', address)
            .single();

        if (data?.display_name) {
            setDisplayNameState(data.display_name);
        } else {
            // Create initial record if not exists
            const { error: upsertError } = await supabase
                .from('users')
                .upsert({ wallet_address: address }, { onConflict: 'wallet_address' });
            if (upsertError) console.error('Error creating user:', upsertError);
        }
    };

    const updateDisplayName = async (name: string) => {
        if (!currentUser) return;
        setDisplayNameState(name);

        const { error } = await supabase
            .from('users')
            .update({ display_name: name })
            .eq('wallet_address', currentUser);

        if (error) console.error('Error updating name:', error);
    };

    const joinGroup = (id: string) => {
        setGroupId(id);
        setExpenses([]); // Clear previous expenses when switching groups
    };

    const addExpense = async (newExpense: Omit<Expense, "id" | "date" | "group_id">) => {
        if (!groupId) return;

        const expenseData = {
            ...newExpense,
            group_id: groupId,
            date: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('expenses')
            .insert([expenseData])
            .select()
            .single();

        if (error) {
            console.error('Error adding expense:', error);
            return;
        }

        if (data) {
            const createdExpense = {
                ...data,
                amount: Number(data.amount)
            } as Expense;

            setExpenses((prev) => [createdExpense, ...prev]);
        }
    };

    // Helper to safely parse expense from DB/Realtime
    const parseExpense = (data: any): Expense => ({
        ...data,
        amount: Number(data.amount)
    });

    // Fetch expenses from Supabase when groupId changes
    useEffect(() => {
        if (!groupId) return;

        const fetchExpenses = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('group_id', groupId)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching expenses:', error);
            } else if (data) {
                setExpenses(data.map(parseExpense));
            }
            setIsLoading(false);
        };

        fetchExpenses();

        // Realtime subscription filtered by group_id
        const channel = supabase
            .channel(`expenses_channel_${groupId}_${Date.now()}`) // Unique channel name
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'expenses',
                    filter: `group_id=eq.${groupId}`
                },
                (payload) => {
                    console.log("Realtime event received:", payload);
                    const newExpense = parseExpense(payload.new);
                    setExpenses((prev) => {
                        // Deduplicate: if we already have this ID (e.g. from addExpense), don't add again
                        if (prev.some(e => e.id === newExpense.id)) {
                            return prev;
                        }
                        return [newExpense, ...prev];
                    });
                }
            )
            .subscribe((status) => {
                console.log(`Subscription status for group ${groupId}:`, status);
            });

        return () => {
            console.log(`Unsubscribing from group ${groupId}`);
            supabase.removeChannel(channel);
        };
    }, [groupId]);

    const clearExpenses = () => {
        setCurrentUser(null);
        setDisplayNameState(null);
        setGroupId(null);
        localStorage.removeItem("even_user");
        localStorage.removeItem("even_name");
        localStorage.removeItem("even_group");
        setExpenses([]);
    };

    return (
        <ExpenseContext.Provider value={{ expenses, currentUser, displayName, groupId, login, updateDisplayName, joinGroup, addExpense, clearExpenses, isLoading }}>
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
