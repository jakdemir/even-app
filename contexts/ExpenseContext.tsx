"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Expense, Group } from "@/types";
import { supabase } from "@/lib/supabase";

interface ExpenseContextType {
    expenses: Expense[];
    groups: Group[];
    currentUser: string | null;
    displayName: string | null;
    groupId: string | null;
    login: (address: string) => void;
    updateDisplayName: (name: string) => void;
    joinGroup: (groupId: string) => Promise<void>;
    leaveGroup: () => void;
    createGroup: (name: string) => Promise<string | null>;
    updateGroup: (groupId: string, name: string) => Promise<void>;
    deleteGroup: (groupId: string) => Promise<void>;
    addExpense: (expense: Omit<Expense, "id" | "date" | "group_id">) => void;
    updateExpense: (expense: Expense) => Promise<void>;
    deleteExpense: (expenseId: string) => Promise<void>;
    clearExpenses: () => void;
    isLoading: boolean;
    participants: string[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [displayName, setDisplayNameState] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [groupMembers, setGroupMembers] = useState<string[]>([]);

    // Derived state: Unique participants (only display names, never wallet addresses)
    // Include: current user's display name, group members, and anyone who has paid for an expense
    const participants = useMemo(() => {
        const allParticipants = new Set<string>();

        // Add current user's display name
        if (displayName) allParticipants.add(displayName);

        // Add group members
        groupMembers.forEach(member => allParticipants.add(member));

        // Add anyone who has paid for an expense (to catch people not yet in group_members)
        expenses.forEach(expense => {
            if (expense.payer && expense.payer !== currentUser) {
                allParticipants.add(expense.payer);
            }
            // Also add people from splits
            if (expense.splits) {
                Object.keys(expense.splits).forEach(person => {
                    if (person !== currentUser && person !== "Me") {
                        allParticipants.add(person);
                    }
                });
            }
        });

        return Array.from(allParticipants).filter(Boolean);
    }, [displayName, groupMembers, expenses, currentUser]);

    // Load user and group from LocalStorage on mount - DISABLED to prevent auto-login
    // Users must explicitly click a login option
    // useEffect(() => {
    //     const storedUser = localStorage.getItem("even_user");
    //     const storedName = localStorage.getItem("even_name");
    //     const storedGroup = localStorage.getItem("even_group");
    //     if (storedUser) setCurrentUser(storedUser);
    //     if (storedName) setDisplayNameState(storedName);
    //     if (storedGroup) setGroupId(storedGroup);
    // }, []);

    // Save user/group to LocalStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("even_user", currentUser);
        } else {
            localStorage.removeItem("even_user");
        }

        if (displayName) {
            localStorage.setItem("even_name", displayName);
        } else {
            localStorage.removeItem("even_name");
        }

        if (groupId) {
            localStorage.setItem("even_group", groupId);
        } else {
            localStorage.removeItem("even_group");
        }
    }, [currentUser, displayName, groupId]);

    // Fetch user's groups
    useEffect(() => {
        if (!currentUser) return;

        const fetchGroups = async () => {
            console.log("Fetching groups for user:", currentUser);
            const { data, error } = await supabase
                .from('group_members')
                .select('group_id, groups(*)')
                .eq('user_id', currentUser);

            if (error) {
                console.error('Error fetching groups:', error);
            } else if (data) {
                console.log("Raw groups data:", data);
                // @ts-ignore
                const groups = data.map(item => item.groups).filter(Boolean) as Group[];
                console.log("Parsed groups:", groups);
                setGroups(groups);
            } else {
                console.log("No groups data returned");
                setGroups([]);
            }
        };

        fetchGroups();
    }, [currentUser]);

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

    const createGroup = async (name: string) => {
        if (!currentUser) return null;

        // 1. Create Group
        const { data: groupData, error: groupError } = await supabase
            .from('groups')
            .insert([{ name, created_by: currentUser }])
            .select()
            .single();

        if (groupError || !groupData) {
            console.error('Error creating group:', groupError);
            return null;
        }

        // 2. Add Creator as Member
        const { error: memberError } = await supabase
            .from('group_members')
            .insert([{ group_id: groupData.id, user_id: currentUser }]);

        if (memberError) {
            console.error('Error adding member:', memberError);
        }

        const newGroup = groupData as Group;
        setGroups(prev => [...prev, newGroup]);
        return newGroup.id;
    };

    const updateGroup = async (id: string, name: string) => {
        const { error } = await supabase
            .from('groups')
            .update({ name })
            .eq('id', id);

        if (error) {
            console.error('Error updating group:', error);
            return;
        }

        setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g));
    };

    const deleteGroup = async (id: string) => {
        const { error } = await supabase
            .from('groups')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting group:', error);
            return;
        }

        setGroups(prev => prev.filter(g => g.id !== id));
        if (groupId === id) setGroupId(null);
    };

    const joinGroup = async (id: string) => {
        if (!currentUser) return;

        // Check if already a member
        const isMember = groups.some(g => g.id === id);
        if (!isMember) {
            const { error } = await supabase
                .from('group_members')
                .insert([{ group_id: id, user_id: currentUser }]);

            if (error) {
                console.error('Error joining group:', error);
                // If error is duplicate key, it means we are already joined, which is fine
            }

            // Fetch the group details to add to state
            const { data } = await supabase
                .from('groups')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setGroups(prev => [...prev, data as Group]);
            }
        }

        setGroupId(id);
        setExpenses([]); // Clear previous expenses when switching groups
    };

    const leaveGroup = () => {
        setGroupId(null);
        setExpenses([]);
        setGroupMembers([]);
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

    const updateExpense = async (updatedExpense: Expense) => {
        const { error } = await supabase
            .from('expenses')
            .update({
                description: updatedExpense.description,
                amount: updatedExpense.amount,
                payer: updatedExpense.payer,
                recipient: updatedExpense.recipient,
                type: updatedExpense.type
            })
            .eq('id', updatedExpense.id);

        if (error) {
            console.error('Error updating expense:', error);
            return;
        }

        setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    };

    const deleteExpense = async (expenseId: string) => {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', expenseId);

        if (error) {
            console.error('Error deleting expense:', error);
            return;
        }

        setExpenses(prev => prev.filter(e => e.id !== expenseId));
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

        const fetchGroupMembers = async () => {
            const { data, error } = await supabase
                .from('group_members')
                .select('user_id, users(display_name)')
                .eq('group_id', groupId);

            if (error) {
                console.error('Error fetching members:', error);
            } else if (data) {
                // Map to display names if available, else wallet addresses
                const members = data.map((m: any) => m.users?.display_name || m.user_id);
                setGroupMembers(members);
            }
        };

        fetchExpenses();
        fetchGroupMembers();

        // Realtime subscription filtered by group_id
        const channel = supabase
            .channel(`room_${groupId}`) // Deterministic channel name
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'expenses',
                    filter: `group_id=eq.${groupId}`
                },
                (payload) => {
                    console.log("🔔 Realtime event received:", payload);
                    const newExpense = parseExpense(payload.new);
                    setExpenses((prev) => {
                        // Deduplicate: if we already have this ID (e.g. from addExpense), don't add again
                        if (prev.some(e => e.id === newExpense.id)) {
                            console.log("Duplicate expense ignored:", newExpense.id);
                            return prev;
                        }
                        return [newExpense, ...prev];
                    });
                }
            )
            .subscribe((status) => {
                console.log(`📡 Subscription status for room_${groupId}:`, status);
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
        <ExpenseContext.Provider value={{ expenses, groups, currentUser, displayName, groupId, login, updateDisplayName, joinGroup, leaveGroup, createGroup, updateGroup, deleteGroup, addExpense, updateExpense, deleteExpense, clearExpenses, isLoading, participants }}>
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
