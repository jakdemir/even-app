"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Expense, Group } from "@/types";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

interface ExpenseContextType {
    expenses: Expense[];
    groups: Group[];
    currentUser: string | null;
    displayName: string | null;
    groupId: string | null;
    login: (address: string, username?: string) => void;
    updateDisplayName: (name: string) => void;
    joinGroup: (groupId: string) => Promise<boolean>;
    leaveGroup: () => void;
    removeFromGroup: (groupId: string) => Promise<void>;
    createGroup: (name: string) => Promise<string | null>;
    updateGroup: (groupId: string, name: string) => Promise<void>;
    deleteGroup: (groupId: string) => Promise<void>;
    addExpense: (expense: Omit<Expense, "id" | "date" | "group_id">) => void;
    updateExpense: (expense: Expense) => Promise<void>;
    deleteExpense: (expenseId: string) => Promise<void>;
    clearExpenses: () => void;
    refreshExpenses: () => Promise<void>;
    refreshGroups: () => Promise<void>;
    isLoading: boolean;
    participants: string[];
    userWallets: Record<string, string>; // displayName -> walletAddress
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
    const [userWallets, setUserWallets] = useState<Record<string, string>>({}); // displayName -> walletAddress

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
            logger.dbQuery('SELECT', 'group_members', { user_id: currentUser });
            const { data, error } = await supabase
                .from('group_members')
                .select('group_id, groups(*)')
                .eq('user_id', currentUser);

            if (error) {
                logger.error('Error fetching groups', error);
            } else if (data) {
                logger.debug('Raw groups data received', { count: data.length });
                // @ts-ignore
                const groups = data.map(item => item.groups).filter(Boolean) as Group[];
                // Sort by created_at descending (most recent first)
                groups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                logger.info('Groups loaded', { count: groups.length });
                setGroups(groups);
            } else {
                logger.warn('No groups data returned');
                setGroups([]);
            }
        };

        fetchGroups();
    }, [currentUser]);

    const refreshGroups = async () => {
        if (!currentUser) return;

        console.log('🔄 [REFRESH GROUPS] Starting refresh for user:', currentUser);

        try {
            const { data, error } = await supabase
                .from('group_members')
                .select('group_id, groups(*)')
                .eq('user_id', currentUser);

            if (error) {
                console.error('❌ [REFRESH GROUPS] Error:', error);
            } else if (data) {
                const userGroups = data.map((item: any) => item.groups).filter(Boolean) as Group[];
                console.log('✅ [REFRESH GROUPS] Fetched groups:', userGroups.length);
                setGroups(userGroups);
            }
        } catch (error) {
            console.error('❌ [REFRESH GROUPS] Unexpected error:', error);
        }
    };

    const login = async (address: string, username?: string) => {
        setCurrentUser(address);

        // If username is provided (mock users), use it immediately
        if (username) {
            setDisplayNameState(username);
            // Save to database
            const { error } = await supabase
                .from('users')
                .upsert({
                    wallet_address: address,
                    display_name: username
                }, { onConflict: 'wallet_address' });
            if (error) console.error('Error saving username:', error);
            return;
        }

        // Fetch existing profile for World ID users
        const { data, error } = await supabase
            .from('users')
            .select('display_name')
            .eq('wallet_address', address)
            .single();

        if (data?.display_name) {
            setDisplayNameState(data.display_name);
        } else {
            // No existing profile, create a default one
            // Use a short version of the address as default name
            const defaultName = `User ${address.slice(2, 8)}`;
            setDisplayNameState(defaultName);

            // Save to database
            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    wallet_address: address,
                    display_name: defaultName
                }, { onConflict: 'wallet_address' });

            if (upsertError) console.error('Error saving default username:', upsertError);
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

        logger.userAction('Create Group', { name, userId: currentUser });

        // 1. Create Group
        logger.dbQuery('INSERT', 'groups', { name, created_by: currentUser });
        const { data: groupData, error: groupError } = await supabase
            .from('groups')
            .insert([{ name, created_by: currentUser }])
            .select()
            .single();

        if (groupError || !groupData) {
            logger.error('Error creating group', groupError);
            return null;
        }

        logger.info('Group created', { id: groupData.id, name: groupData.name });

        // 2. Add Creator as Member
        logger.dbQuery('INSERT', 'group_members', {
            group_id: groupData.id,
            user_id: currentUser
        });
        const { error: memberError } = await supabase
            .from('group_members')
            .insert([{ group_id: groupData.id, user_id: currentUser }]);

        if (memberError) {
            logger.error('Error adding member', memberError);
        } else {
            logger.info('Creator added as group member');
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

    const joinGroup = async (id: string): Promise<boolean> => {
        if (!currentUser) {
            logger.warn('Cannot join group: no current user');
            return false;
        }

        logger.userAction('Join Group', { groupId: id, userId: currentUser });

        try {
            // First, verify the group exists
            logger.dbQuery('SELECT', 'groups', { id });
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('*')
                .eq('id', id)
                .single();

            if (groupError || !groupData) {
                logger.error('Group not found or error fetching group', groupError);
                console.error('Cannot join group: group does not exist or is inaccessible');
                return false;
            }

            // Check if already a member
            const isMember = groups.some(g => g.id === id);
            if (!isMember) {
                logger.dbQuery('INSERT', 'group_members', { group_id: id, user_id: currentUser });
                const { error: joinError } = await supabase
                    .from('group_members')
                    .insert([{ group_id: id, user_id: currentUser }]);

                if (joinError) {
                    // Check if it's a duplicate key error (already a member)
                    if (joinError.code === '23505') {
                        logger.info('User already a member of group', { groupId: id });
                    } else {
                        logger.error('Error joining group', joinError);
                        console.error('Error joining group:', joinError);
                        return false;
                    }
                } else {
                    logger.info('Successfully joined group', { groupId: id });
                }

                // Add group to local state if not already there
                if (!groups.some(g => g.id === id)) {
                    setGroups(prev => [...prev, groupData as Group]);
                }
            } else {
                logger.info('Already a member, switching to group', { groupId: id });
            }

            setGroupId(id);
            setExpenses([]); // Clear previous expenses when switching groups
            logger.info('Group joined successfully', { groupId: id });
            return true;
        } catch (error) {
            logger.error('Unexpected error joining group', error);
            console.error('Unexpected error joining group:', error);
            return false;
        }
    };

    const leaveGroup = () => {
        setGroupId(null);
        setExpenses([]);
        setGroupMembers([]);
    };

    const removeFromGroup = async (id: string) => {
        if (!currentUser) return;

        logger.userAction('Remove from Group', { groupId: id, userId: currentUser });

        try {
            // Remove user from group_members table
            logger.dbQuery('DELETE', 'group_members', { group_id: id, user_id: currentUser });
            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', id)
                .eq('user_id', currentUser);

            if (error) {
                logger.error('Error removing from group', error);
                console.error('Error removing from group:', error);
                throw error;
            }

            logger.info('Successfully removed from group', { groupId: id });

            // Remove group from local state
            setGroups(prev => prev.filter(g => g.id !== id));

            // If currently viewing this group, leave it
            if (groupId === id) {
                leaveGroup();
            }
        } catch (error) {
            logger.error('Unexpected error removing from group', error);
            console.error('Unexpected error removing from group:', error);
            throw error;
        }
    };

    const addExpense = async (newExpense: Omit<Expense, "id" | "date" | "group_id">) => {
        if (!groupId) return;

        console.log('🔵 [ADD EXPENSE] Starting...', {
            type: newExpense.type,
            description: newExpense.description,
            amount: newExpense.amount,
            payer: newExpense.payer,
            recipient: newExpense.recipient,
            groupId
        });

        logger.userAction('Add Expense', {
            description: newExpense.description,
            amount: newExpense.amount,
            payer: newExpense.payer,
            groupId
        });

        const expenseData = {
            ...newExpense,
            group_id: groupId,
            date: new Date().toISOString(),
        };

        console.log('🔵 [ADD EXPENSE] Prepared data:', expenseData);

        logger.dbQuery('INSERT', 'expenses', {
            group_id: groupId,
            amount: newExpense.amount
        });

        console.log('🔵 [ADD EXPENSE] Sending to Supabase...');

        const { data, error } = await supabase
            .from('expenses')
            .insert([expenseData])
            .select()
            .single();

        if (error) {
            console.error('❌ [ADD EXPENSE] Error:', error);
            logger.error('Error adding expense', error);
            return;
        }

        if (data) {
            const createdExpense = {
                ...data,
                amount: Number(data.amount)
            } as Expense;

            console.log('✅ [ADD EXPENSE] Success:', {
                id: createdExpense.id,
                type: createdExpense.type,
                amount: createdExpense.amount,
                recipient: createdExpense.recipient
            });

            logger.info('Expense added successfully', {
                id: createdExpense.id,
                amount: createdExpense.amount
            });
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
        console.log('Attempting to delete expense:', expenseId);
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', expenseId);

        if (error) {
            console.error('Error deleting expense:', error);
            alert(`Failed to delete expense: ${error.message}`);
            return;
        }

        console.log('Expense deleted successfully:', expenseId);
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
                .select('user_id, users(display_name, wallet_address)')
                .eq('group_id', groupId);

            if (error) {
                console.error('Error fetching members:', error);
            } else if (data) {
                // Map to display names if available, else wallet addresses
                const members = data.map((m: any) => m.users?.display_name || m.user_id);
                const walletMap: Record<string, string> = {};

                // Create mapping of display names to wallet addresses
                data.forEach((m: any) => {
                    const displayName = m.users?.display_name;
                    const walletAddress = m.user_id;

                    if (displayName && walletAddress) {
                        // Validate wallet address format before adding to map
                        if (/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
                            walletMap[displayName] = walletAddress;
                            console.log('💼 [WALLET MAP] Added:', { displayName, wallet: walletAddress });
                        } else {
                            console.warn('⚠️ [WALLET MAP] Invalid wallet address format for', displayName, ':', walletAddress);
                        }
                    }
                });

                // Also add current user if they have a display name
                if (displayName && currentUser) {
                    if (/^0x[a-fA-F0-9]{40}$/.test(currentUser)) {
                        walletMap[displayName] = currentUser;
                        console.log('💼 [WALLET MAP] Added current user:', { displayName, wallet: currentUser });
                    } else {
                        console.warn('⚠️ [WALLET MAP] Current user has invalid wallet format:', currentUser);
                    }
                }

                console.log('💼 [INITIAL LOAD] Final wallet mapping:', walletMap);
                console.log('💼 [INITIAL LOAD] Total members:', members.length, 'Total wallets mapped:', Object.keys(walletMap).length);
                setGroupMembers(members);
                setUserWallets(walletMap);
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
                    console.log("🔔 Realtime expense INSERT received:", payload);
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
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'expenses'
                },
                (payload) => {
                    console.log("🔔 Realtime expense UPDATE received:", payload);
                    const updatedExpense = parseExpense(payload.new);
                    setExpenses((prev) =>
                        prev.map(e => e.id === updatedExpense.id ? updatedExpense : e)
                    );
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'expenses'
                },
                (payload) => {
                    console.log("🔔 Realtime expense DELETE received:", payload);
                    const deletedId = payload.old.id;
                    setExpenses((prev) => prev.filter(e => e.id !== deletedId));
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'group_members',
                    filter: `group_id=eq.${groupId}`
                },
                (payload) => {
                    console.log("🔔 Realtime group member event received:", payload);
                    // Refetch group members when a new member joins
                    fetchGroupMembers();
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

    const refreshExpenses = async () => {
        if (!groupId) return;

        console.log('🔄 [REFRESH] Starting refresh for group:', groupId);

        setIsLoading(true);
        try {
            console.log('🔄 [REFRESH] Fetching expenses...');
            // Fetch expenses
            const { data: expensesData, error: expensesError } = await supabase
                .from('expenses')
                .select('*')
                .eq('group_id', groupId)
                .order('date', { ascending: false });

            if (expensesError) {
                console.error('❌ [REFRESH] Error fetching expenses:', expensesError);
            } else if (expensesData) {
                console.log('✅ [REFRESH] Fetched expenses:', expensesData.length);
                setExpenses(expensesData.map(parseExpense));
            }

            console.log('🔄 [REFRESH] Fetching group members...');
            const fetchGroupMembers = async () => {
                logger.dbQuery('SELECT', 'group_members', { group_id: groupId });
                const { data: membersData, error: membersError } = await supabase
                    .from('group_members')
                    .select('user_id, users(display_name, wallet_address)')
                    .eq('group_id', groupId);

                if (membersError) {
                    console.error('❌ [REFRESH] Error fetching members:', membersError);
                } else if (membersData) {
                    const members = membersData.map((m: any) => m.users?.display_name || m.user_id);
                    const walletMap: Record<string, string> = {};

                    // Create mapping of display names to wallet addresses
                    membersData.forEach((m: any) => {
                        const displayName = m.users?.display_name;
                        const walletAddress = m.user_id;

                        if (displayName && walletAddress) {
                            // Validate wallet address format before adding to map
                            if (/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
                                walletMap[displayName] = walletAddress;
                                console.log('💼 [REFRESH] Added to wallet map:', { displayName, wallet: walletAddress });
                            } else {
                                console.warn('⚠️ [REFRESH] Invalid wallet address format for', displayName, ':', walletAddress);
                            }
                        }
                    });

                    // Also add current user if they have a display name
                    if (displayName && currentUser) {
                        if (/^0x[a-fA-F0-9]{40}$/.test(currentUser)) {
                            walletMap[displayName] = currentUser;
                            console.log('💼 [REFRESH] Added current user:', { displayName, wallet: currentUser });
                        } else {
                            console.warn('⚠️ [REFRESH] Current user has invalid wallet format:', currentUser);
                        }
                    }

                    logger.debug('Group members loaded', { count: members.length });
                    console.log('💼 [REFRESH] Final wallet mapping:', walletMap);
                    console.log('💼 [REFRESH] Total members:', members.length, 'Total wallets mapped:', Object.keys(walletMap).length);
                    setGroupMembers(members);
                    setUserWallets(walletMap);
                }
            };
            await fetchGroupMembers(); // Call the newly defined function
        } catch (error) {
            console.error('❌ [REFRESH] Unexpected error:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
        <ExpenseContext.Provider value={{ expenses, groups, currentUser, displayName, groupId, login, updateDisplayName, joinGroup, leaveGroup, removeFromGroup, createGroup, updateGroup, deleteGroup, addExpense, updateExpense, deleteExpense, clearExpenses, refreshExpenses, refreshGroups, isLoading, participants, userWallets }}>
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
